
// app/api/chat/route.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type ChatMsg = { role: "user" | "assistant"; content: string };

function log(...args: any[]) {
    console.log("[api/chat]", ...args);
}

function readFileSafe(p: string) {
    try {
        return fs.readFileSync(p, "utf-8");
    } catch (e: any) {
        log("readFileSafe failed:", p, e?.message);
        return "";
    }
}

function buildSystemPrompt() {
    const name = "Eliachar Feig";

    const summaryPath = path.join(process.cwd(), "me", "summary.txt");
    const linkedinPath = path.join(process.cwd(), "me", "linkedin.txt");

    const summary = readFileSafe(summaryPath);
    const linkedin = readFileSafe(linkedinPath);

    log("Loaded context lengths:", {
        summary: summary.length,
        linkedin: linkedin.length,
    });

    return `You are acting as ${name}. You are answering questions on ${name}'s website,
particularly questions related to ${name}'s career, background, skills and experience.
Your responsibility is to represent ${name} for interactions on the website as faithfully as possible.
You are given a summary of ${name}'s background and LinkedIn profile which you can use to answer questions.
Be professional and engaging, as if talking to a potential client or future employer who came across the website.
If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career.
If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool.

## Summary:
${summary}

## LinkedIn Profile:
${linkedin}

With this context, please chat with the user, always staying in character as ${name}.`;
}

async function push(text: string) {
    const token = process.env.PUSHOVER_TOKEN;
    const user = process.env.PUSHOVER_USER;

    if (!token || !user) {
        log("Pushover not configured (missing PUSHOVER_TOKEN or PUSHOVER_USER)");
        return;
    }

    await fetch("https://api.pushover.net/1/messages.json", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            token,
            user,
            message: text,
        }),
    });
}

async function record_user_details(args: { email: string; name?: string; notes?: string }) {
    const { email, name = "Name not provided", notes = "not provided" } = args;
    await push(`Recording ${name} with email ${email} and notes ${notes}`);
    return { recorded: "ok" };
}

async function record_unknown_question(args: { question: string }) {
    await push(`Recording ${args.question}`);
    return { recorded: "ok" };
}

const tools: OpenAI.Responses.Tool[] = [
    {
        type: "function",
        name: "record_user_details",
        strict: false,
        description:
            "Use this tool to record that a user is interested in being in touch and provided an email address",
        parameters: {
            type: "object",
            properties: {
                email: { type: "string", description: "The email address of this user" },
                name: { type: "string", description: "The user's name, if they provided it" },
                notes: {
                    type: "string",
                    description: "Any additional info about the conversation worth recording",
                },
            },
            required: ["email"],
            additionalProperties: false,
        },
    },
    {
        type: "function",
        name: "record_unknown_question",
        strict: true,
        description:
            "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
        parameters: {
            type: "object",
            properties: {
                question: { type: "string", description: "The question that couldn't be answered" },
            },
            required: ["question"],
            additionalProperties: false,
        },
    },
];


async function runToolCalls(output: any[]) {
    const toolOutputs: any[] = [];

    for (const item of output) {
        if (item.type !== "function_call") continue;

        const name = item.name as string;
        const call_id = item.call_id as string;

        let args: any = {};
        try {
            args = item.arguments ? JSON.parse(item.arguments) : {};
        } catch {
            args = {};
        }

        log("Tool called:", name, "args:", args);

        let result: any = {};
        if (name === "record_user_details") result = await record_user_details(args);
        else if (name === "record_unknown_question") result = await record_unknown_question(args);
        else result = { recorded: "ignored_unknown_tool" };

        toolOutputs.push({
            type: "function_call_output",
            call_id,
            output: JSON.stringify(result),
        });
    }

    return toolOutputs;
}

function safeError(err: any) {
    return {
        name: err?.name,
        message: err?.message,
        status: err?.status,
        code: err?.code,
        type: err?.type,
    };
}

export async function POST(req: Request) {
    const started = Date.now();

    try {
        log("POST start");

        const apiKey = process.env.OPENAI_API_KEY;
        log("OPENAI_API_KEY present?", Boolean(apiKey), "length:", apiKey?.length ?? 0);

        if (!apiKey) {
            return Response.json(
                { reply: "", error: "OPENAI_API_KEY is missing in server env (.env.local / Vercel env vars)." },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        const body = await req.json().catch(() => null);
        if (!body) {
            log("Failed to parse JSON body");
            return Response.json({ reply: "", error: "Invalid JSON body" }, { status: 400 });
        }

        const messages = (body?.messages ?? []) as ChatMsg[];
        log("Messages count:", messages.length);

        if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json({ reply: "", error: "No messages provided" }, { status: 400 });
        }

        const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
        const system = buildSystemPrompt();

        log("Transcript length:", transcript.length);
        log("System prompt length:", system.length);

        log("Calling OpenAI responses.create...");
        let response = await openai.responses.create({
            model: "gpt-4o-mini",
            tools,
            input: `${system}\n\n---\n\n${transcript}\nASSISTANT:`,
        });

        log("OpenAI response id:", response.id);
        log("OpenAI output items:", response.output?.length ?? 0);

        let loops = 0;
        while (true) {
            loops += 1;
            const output = response.output ?? [];
            const toolCalls = output.filter((x: any) => x.type === "function_call");
            log(`Loop ${loops}: toolCalls=${toolCalls.length}`);

            if (toolCalls.length === 0) break;

            const toolOutputItems = await runToolCalls(output);
            log(`Loop ${loops}: tool outputs=${toolOutputItems.length}`);

            response = await openai.responses.create({
                model: "gpt-4o-mini",
                tools,
                previous_response_id: response.id,
                input: toolOutputItems,
            });

            log(`Loop ${loops}: next response id=${response.id} output=${response.output?.length ?? 0}`);

            if (loops > 8) {
                log("Tool loop exceeded 8 iterations, breaking.");
                break;
            }
        }

        const texts: string[] = [];
        for (const item of response.output ?? []) {
            if (item.type === "message") {
                const content = item.content ?? [];
                for (const c of content) {
                    if (c.type === "output_text" && c.text) texts.push(c.text);
                }
            }
        }

        const reply = texts.join("\n").trim();
        log("Reply length:", reply.length, "ms:", Date.now() - started);

        return Response.json({ reply });
    } catch (err: any) {
        console.error("[api/chat] FULL ERROR:", err);

        const status = err?.status ?? 500;

        const details =
            err?.error ??
            err?.body ??
            err?.response ??
            null;

        const safe = {
            name: err?.name,
            message: err?.message,
            status: err?.status,
            code: err?.code,
            type: err?.type,
            error: details,
        };

        log("ERROR (safe):", safe);

        return Response.json(
            {
                reply: "Server error while calling the AI.",
                error: safe,
            },
            { status }
        );
    }

}
