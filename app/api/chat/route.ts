// app/api/chat/route.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

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

    log("Loaded context lengths:", { summary: summary.length, linkedin: linkedin.length });

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

function buildEmailSubject(kind?: "lead" | "unknown") {
    if (kind === "lead") return "New chat lead (email captured)";
    if (kind === "unknown") return "Chatbot unknown question";
    return "Chatbot notification";
}

/**
 * Turns Msg[] into a readable transcript (text).
 */
function formatConversationText(messages: ChatMsg[]) {
    const SEP = "\n────────────\n";
    const title = "──────────── Chat Transcript ────────────\n";

    const blocks = messages.map((m) => {
        const who = m.role === "user" ? "🧑 User" : "🤖 Assistant";
        return `${who}\n${m.content.trim()}`;
    });

    return title + "\n" + blocks.join(SEP) + "\n";
}

/**
 * Turns Msg[] into a readable transcript (HTML).
 */
function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatConversationHtml(messages: ChatMsg[]) {
    const rows = messages
        .map((m) => {
            const isUser = m.role === "user";
            const label = isUser ? "🧑 User" : "🤖 Assistant";
            const content = escapeHtml(m.content.trim()).replaceAll("\n", "<br/>");

            return `
        <div style="margin: 14px 0;">
          <div style="font-weight:700; margin-bottom:6px;">${label}</div>
          <div style="white-space:normal; line-height:1.5; color:#111;">${content}</div>
        </div>
        <div style="border-top:1px solid #e5e7eb; margin:14px 0;"></div>
      `;
        })
        .join("");

    return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 4px 2px;">
      <h2 style="margin:0 0 10px; font-size:18px;">Chat Transcript</h2>
      <div style="border:1px solid #e5e7eb; border-radius:12px; padding:14px; background:#fafafa;">
        ${rows}
      </div>
    </div>
  `;
}

async function sendAlertEmail(subject: string, text: string, html?: string) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "465");
    const secure = (process.env.SMTP_SECURE || "true") === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.ALERT_TO || user;

    log("SMTP config:", {
        hasHost: !!host,
        port,
        secure,
        hasUser: !!user,
        hasPass: !!pass,
        to,
    });

    if (!host || !user || !pass || !to) {
        log("Email not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS/ALERT_TO)");
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });

    await transporter.verify();
    log("SMTP verify OK");

    const info = await transporter.sendMail({
        from: `"Eliachar Website Bot" <${user}>`,
        to,
        subject,
        text,
        html: html || undefined,
    });

    log("Email sent:", { messageId: info.messageId, to, subject });
}

async function push(text: string, messages: ChatMsg[], kind?: "lead" | "unknown") {
    const token = process.env.PUSHOVER_TOKEN;
    const pushoverUser = process.env.PUSHOVER_USER;

    if (token && pushoverUser) {
        await fetch("https://api.pushover.net/1/messages.json", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ token, user: pushoverUser, message: text }),
        });
    } else {
        log("Pushover not configured (missing PUSHOVER_TOKEN or PUSHOVER_USER)");
    }

    const subject = buildEmailSubject(kind);

    const transcriptText = formatConversationText(messages);
    const transcriptHtml = formatConversationHtml(messages);

    const bodyText = `${text}\n\n${transcriptText}`;
    const bodyHtml = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
      <div style="font-size:14px; margin-bottom:12px;">
        <strong>Notification:</strong> ${escapeHtml(text)}
      </div>
      ${transcriptHtml}
    </div>
  `;

    try {
        await sendAlertEmail(subject, bodyText, bodyHtml);
    } catch (e: any) {
        log("sendAlertEmail failed:", e?.message || e);
    }
}

async function record_user_details(args: { email: string; name?: string; notes?: string }, messages: ChatMsg[]) {
    const { email, name = "Name not provided", notes = "not provided" } = args;
    await push(`Lead captured: ${email} (${name}) | notes: ${notes}`, messages, "lead");
    return { recorded: "ok" };
}

async function record_unknown_question(args: { question: string }, messages: ChatMsg[]) {
    await push(`Unknown question: ${args.question}`, messages, "unknown");
    return { recorded: "ok" };
}

const tools: OpenAI.Responses.Tool[] = [
    {
        type: "function",
        name: "record_user_details",
        strict: false,
        description: "Use this tool to record that a user is interested in being in touch and provided an email address",
        parameters: {
            type: "object",
            properties: {
                email: { type: "string", description: "The email address of this user" },
                name: { type: "string", description: "The user's name, if they provided it" },
                notes: { type: "string", description: "Any additional info worth recording" },
            },
            required: ["email"],
            additionalProperties: false,
        },
    },
    {
        type: "function",
        name: "record_unknown_question",
        strict: true,
        description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
        parameters: {
            type: "object",
            properties: { question: { type: "string" } },
            required: ["question"],
            additionalProperties: false,
        },
    },
];

async function runToolCalls(output: any[], messages: ChatMsg[]) {
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
        if (name === "record_user_details") result = await record_user_details(args, messages);
        else if (name === "record_unknown_question") result = await record_unknown_question(args, messages);
        else result = { recorded: "ignored_unknown_tool" };

        toolOutputs.push({
            type: "function_call_output",
            call_id,
            output: JSON.stringify(result),
        });
    }

    return toolOutputs;
}

function sseHeaders() {
    return {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
    };
}

function sseData(obj: any) {
    return `data: ${typeof obj === "string" ? obj : JSON.stringify(obj)}\n\n`;
}

export async function POST(req: Request) {
    const started = Date.now();

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const enc = new TextEncoder();
            const send = (obj: any) => controller.enqueue(enc.encode(sseData(obj)));

            try {
                log("POST start (stream)");

                const apiKey = process.env.OPENAI_API_KEY;
                log("OPENAI_API_KEY present?", Boolean(apiKey), "length:", apiKey?.length ?? 0);

                if (!apiKey) {
                    send({ type: "error", message: "OPENAI_API_KEY is missing in server env." });
                    send("[DONE]");
                    controller.close();
                    return;
                }

                const openai = new OpenAI({ apiKey });

                const body = await req.json().catch(() => null);
                if (!body) {
                    send({ type: "error", message: "Invalid JSON body" });
                    send("[DONE]");
                    controller.close();
                    return;
                }

                const messages = (body?.messages ?? []) as ChatMsg[];
                if (!Array.isArray(messages) || messages.length === 0) {
                    send({ type: "error", message: "No messages provided" });
                    send("[DONE]");
                    controller.close();
                    return;
                }

                const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
                const system = buildSystemPrompt();

                log("Transcript length:", transcript.length);
                log("System prompt length:", system.length);

                const response = await openai.responses.create({
                    model: "gpt-4o-mini",
                    tools,
                    input: `${system}\n\n---\n\n${transcript}\nASSISTANT:`,
                    stream: true,
                });

                const toolCallItems: any[] = [];

                for await (const event of response as any) {
                    if (event?.type === "response.output_text.delta") {
                        const delta = event?.delta;
                        if (typeof delta === "string" && delta.length) {
                            send({ type: "delta", text: delta });
                        }
                    }

                    if (event?.type === "response.output_item.added" && event?.item?.type === "function_call") {
                        toolCallItems.push(event.item);
                    }

                    if (event?.type === "response.function_call_arguments.delta") {
                        const last = toolCallItems[toolCallItems.length - 1];
                        if (last) {
                            last.arguments = (last.arguments || "") + (event?.delta || "");
                        }
                    }

                    if (event?.type === "response.completed") {
                        if (toolCallItems.length) {
                            const toolOutputs = await runToolCalls(toolCallItems, messages);

                            const followup = await openai.responses.create({
                                model: "gpt-4o-mini",
                                tools,
                                previous_response_id: event.response?.id,
                                input: toolOutputs,
                                stream: true,
                            });

                            for await (const ev2 of followup as any) {
                                if (ev2?.type === "response.output_text.delta") {
                                    const delta2 = ev2?.delta;
                                    if (typeof delta2 === "string" && delta2.length) {
                                        send({ type: "delta", text: delta2 });
                                    }
                                }
                                if (ev2?.type === "response.completed") break;
                            }
                        }
                        break;
                    }
                }

                send("[DONE]");
                controller.close();
                log("Stream done ms:", Date.now() - started);
            } catch (err: any) {
                console.error("[api/chat] STREAM ERROR:", err);
                send({ type: "error", message: err?.message || "Server error while calling the AI." });
                send("[DONE]");
                controller.close();
            }
        },
    });

    return new Response(stream, { headers: sseHeaders() });
}
