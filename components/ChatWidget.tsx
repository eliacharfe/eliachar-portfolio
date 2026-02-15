// compnenents/ChatWidget

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";

type Msg = { role: "user" | "assistant"; content: string };

type ModalState = {
    open: boolean;
    title?: string;
    message?: string;
    html?: string;
    kind?: "success" | "error";
};




export default function ChatWidget() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState<ModalState>({ open: false });

    const [messages, setMessages] = useState<Msg[]>([
        {
            role: "assistant",
            content:
                "Hi — I’m Eliachar, a Senior Mobile Engineer specializing in iOS, Flutter, and Applied AI. Feel free to ask about my experience, projects, architecture decisions, or how I build production-ready systems.",
        },
    ]);

    const listRef = useRef<HTMLDivElement | null>(null);
    const pendingRef = useRef<string>("");
    const flushTimerRef = useRef<number | null>(null);
    const streamDoneRef = useRef(false);
    const resolveDrainRef = useRef<null | (() => void)>(null);

    const FLUSH_EVERY_MS = 40;
    const CHARS_PER_TICK = 2;

    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        requestAnimationFrame(() => {
            const el = listRef.current;
            if (!el) return;
            el.scrollTop = el.scrollHeight;
        });
    }, [open, messages.length, loading]);

    useEffect(() => {
        return () => {
            if (flushTimerRef.current != null) {
                window.clearInterval(flushTimerRef.current);
                flushTimerRef.current = null;
            }
        };
    }, []);

    function updateAssistantAt(index: number, delta: string) {
        setMessages((prev) => {
            if (index < 0 || index >= prev.length) return prev;
            const next = [...prev];
            next[index] = { ...next[index], content: (next[index].content || "") + delta };
            return next;
        });
    }

    function startFlushLoop(index: number) {
        if (flushTimerRef.current != null) return;

        flushTimerRef.current = window.setInterval(() => {
            if (pendingRef.current.length) {
                const chunk = pendingRef.current.slice(0, CHARS_PER_TICK);
                pendingRef.current = pendingRef.current.slice(CHARS_PER_TICK);
                updateAssistantAt(index, chunk);
                return;
            }

            if (streamDoneRef.current) {
                stopFlushLoop();
                resolveDrainRef.current?.();
                resolveDrainRef.current = null;
            }
        }, FLUSH_EVERY_MS);
    }

    function stopFlushLoop() {
        if (flushTimerRef.current != null) {
            window.clearInterval(flushTimerRef.current);
            flushTimerRef.current = null;
        }
    }

    async function send() {
        const text = input.trim();
        if (!text || loading) return;

        const base: Msg[] = [...messages, { role: "user" as const, content: text }];
        setMessages(base);
        setInput("");
        setLoading(true);

        const assistantIndex = base.length;
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        pendingRef.current = "";
        streamDoneRef.current = false;

        const drainPromise = new Promise<void>((resolve) => {
            resolveDrainRef.current = resolve;
        });

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({ messages: base }),
            });

            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => ({}));
                setMessages((prev) => {
                    const next = [...prev];
                    next[assistantIndex] = {
                        role: "assistant",
                        content: `❌ API error: ${data?.error?.message || data?.error?.code || data?.error || "Unknown error"
                            }`,
                    };
                    return next;
                });
                stopFlushLoop();
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            startFlushLoop(assistantIndex);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() ?? "";

                for (const part of parts) {
                    const lines = part.split("\n");
                    for (const line of lines) {
                        if (!line.startsWith("data:")) continue;

                        const payload = line.slice(5).trim();
                        if (!payload) continue;

                        if (payload === "[DONE]") {
                            streamDoneRef.current = true;
                            break;
                        }

                        try {
                            const obj = JSON.parse(payload);

                            if (obj.type === "delta" && typeof obj.text === "string") {
                                pendingRef.current += obj.text;
                            }

                            if (obj.type === "push_success") {
                                setModal({
                                    open: true,
                                    kind: "success",
                                    title: obj.title || "Conversation sent",
                                    message: obj.message || "The conversation was sent successfully.",
                                    html: typeof obj.html === "string" ? obj.html : "",
                                });
                            }

                            if (obj.type === "push_error") {
                                setModal({
                                    open: true,
                                    kind: "error",
                                    title: obj.title || "Send failed",
                                    message: obj.message || "Failed to send the conversation.",
                                    html: "",
                                });
                            }

                            if (obj.type === "error") {
                                setMessages((prev) => {
                                    const next = [...prev];
                                    next[assistantIndex] = {
                                        role: "assistant",
                                        content: `❌ API error: ${obj.message || "Unknown error"}`,
                                    };
                                    return next;
                                });
                                streamDoneRef.current = true;
                            }
                        } catch { }
                    }
                }

                if (streamDoneRef.current) break;
            }

            streamDoneRef.current = true;
            await drainPromise;
        } catch {
            setMessages((prev) => {
                const next = [...prev];
                next[assistantIndex] = {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                };
                return next;
            });
        } finally {
            streamDoneRef.current = true;
            resolveDrainRef.current?.();
            resolveDrainRef.current = null;
            stopFlushLoop();
            setLoading(false);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && canSend) send();
    }

    if (!mounted) return null;

    return (
        <>
            <TranscriptModal
                state={modal}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />

            <div
                className="chat-widget-wrapper"
                style={{
                    position: "fixed",
                    right: 20,
                    bottom: 20,
                    zIndex: 999999,
                    pointerEvents: "none",
                }}
            >
                <div
                    className="chat-panel"
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 64,
                        width: 380,
                        maxWidth: "92vw",
                        opacity: open ? 1 : 0,
                        transform: open ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 180ms ease, transform 180ms ease",
                        pointerEvents: open ? "auto" : "none",
                    }}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(15, 15, 18, 0.72)",
                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",
                            boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 14px",
                                borderBottom: "1px solid rgba(255,255,255,0.10)",
                            }}
                        >
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.90)" }}>
                                    Chat with Eliachar
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "rgba(255,255,255,0.60)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    iOS • Flutter • Full-stack • AI • Projects
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                                className="chat-close-btn"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    background: "rgba(255,255,255,0.06)",
                                    color: "rgba(255,255,255,0.75)",
                                    borderRadius: 12,
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            ref={listRef}
                            style={{
                                height: 380,
                                overflow: "auto",
                                padding: 14,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {messages.map((m, i) => {
                                const isUser = m.role === "user";
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            justifyContent: isUser ? "flex-end" : "flex-start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: "85%",
                                                padding: "9px 11px",
                                                borderRadius: 16,
                                                fontSize: 13,
                                                lineHeight: 1.45,
                                                color: "rgba(255,255,255,0.88)",
                                                background: isUser ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
                                                border: "1px solid rgba(255,255,255,0.10)",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                );
                            })}

                            {loading && (
                                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                    <div
                                        style={{
                                            padding: "9px 11px",
                                            borderRadius: 16,
                                            fontSize: 13,
                                            color: "rgba(255,255,255,0.70)",
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.10)",
                                        }}
                                    >
                                        Eliachar is typing…
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                padding: 12,
                                borderTop: "1px solid rgba(255,255,255,0.10)",
                                display: "flex",
                                gap: 10,
                                alignItems: "center",
                            }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Type your message…"
                                className="chat-input"
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 14,
                                    outline: "none",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    background: "rgba(255,255,255,0.08)",
                                    color: "rgba(255,255,255,0.90)",
                                    fontSize: 13,
                                }}
                            />
                            <button
                                type="button"
                                onClick={send}
                                disabled={!canSend}
                                className="chat-send-btn"
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 14,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    background: "rgba(255,255,255,0.14)",
                                    color: "rgba(255,255,255,0.92)",
                                    cursor: canSend ? "pointer" : "not-allowed",
                                    opacity: canSend ? 1 : 0.5,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle chat"
                    className="chat-toggle-btn"
                    style={{
                        height: 48,
                        padding: "0 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(15, 15, 18, 0.78)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        color: "rgba(255,255,255,0.90)",
                        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        pointerEvents: "auto",
                        transition: "all 0.3s ease",
                    }}
                >
                    <span
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            display: "grid",
                            placeItems: "center",
                            background: "rgba(255,255,255,0.12)",
                        }}
                    >
                        💬
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{open ? "Close" : "Chat With Me"}</span>
                </button>
            </div>
        </>
    );
}




/* ----------------------------------------- */
/* Modal */
/* ----------------------------------------- */
function TranscriptModal({
    state,
    onClose,
}: {
    state: ModalState;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!state.open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [state.open, onClose]);

    if (!state.open) return null;

    const safeHtml = state.html ? DOMPurify.sanitize(state.html) : "";

    const darkWrapHtml = safeHtml
        ? `
        <style>
          .io-transcript * { box-sizing: border-box; }
          .io-transcript { color: rgba(255,255,255,0.86); }
          .io-transcript h1, .io-transcript h2, .io-transcript h3, .io-transcript strong { color: rgba(255,255,255,0.92) !important; }
          .io-transcript a { color: rgba(110,231,255,0.95); }
          .io-transcript div, .io-transcript span, .io-transcript p { color: rgba(255,255,255,0.82) !important; }
          .io-transcript [style*="background:#fafafa"], .io-transcript [style*="background: #fafafa"], .io-transcript [style*="background:#fff"], .io-transcript [style*="background: #fff"], .io-transcript [style*="background:white"], .io-transcript [style*="background: white"] {
            background: rgba(255,255,255,0.06) !important;
          }
          .io-transcript [style*="border:1px solid #e5e7eb"], .io-transcript [style*="border: 1px solid #e5e7eb"] {
            border-color: rgba(255,255,255,0.10) !important;
          }
          .io-transcript [style*="color:#111"], .io-transcript [style*="color: #111"] {
            color: rgba(255,255,255,0.82) !important;
          }
        </style>
        <div class="io-transcript">${safeHtml}</div>
      `
        : "";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.72)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                }}
            />

            <div
                style={{
                    position: "relative",
                    width: "min(860px, 94vw)",
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(15, 15, 18, 0.82)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    boxShadow: "0 24px 90px rgba(0,0,0,0.65)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.10)",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>
                            {state.title || (state.kind === "error" ? "Send failed" : "Conversation sent")}
                        </div>
                        {state.message ? (
                            <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                                {state.message}
                            </div>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.78)",
                            borderRadius: 12,
                            padding: "7px 10px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Close ✕
                    </button>
                </div>

                <div
                    style={{
                        maxHeight: "72vh",
                        overflow: "auto",
                        padding: 16,
                    }}
                >
                    {state.html ? (
                        <div
                            style={{
                                borderRadius: 14,
                                border: "1px solid rgba(255,255,255,0.10)",
                                background: "rgba(255,255,255,0.06)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                padding: 14,
                            }}
                            dangerouslySetInnerHTML={{ __html: darkWrapHtml }}
                        />
                    ) : (
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
                            {state.kind === "error" ? "Could not render transcript." : "No transcript available."}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        padding: 12,
                        borderTop: "1px solid rgba(255,255,255,0.10)",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.10)",
                            color: "rgba(255,255,255,0.90)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 800,
                        }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}