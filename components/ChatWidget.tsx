
//components/ChatWidget.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Msg[]>([
        {
            role: "assistant",
            content:
                "Hey — I’m Eliachar’s assistant. Ask me about iOS (Swift/SwiftUI), Flutter, AI, or any project on this site.",
        },
    ]);

    const listRef = useRef<HTMLDivElement | null>(null);
    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        requestAnimationFrame(() => {
            listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        });
    }, [open, messages]);

    async function send() {
        const text = input.trim();
        if (!text || loading) return;

        const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("API /api/chat error:", data);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `❌ API error: ${data?.error?.message ||
                            data?.error?.code ||
                            data?.error ||
                            "Unknown error"
                            }`,
                    },
                ]);
                return;
            }

            // normal success
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "…" }]);

        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && canSend) send();
    }

    if (!mounted) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                right: 20,
                bottom: 20,
                zIndex: 999999,
                pointerEvents: "auto",
            }}
        >
            {/* Modal (opens above-left of button) */}
            <div
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
                        background: "rgba(15, 15, 18, 0.72)", // dark material opacity
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
                    }}
                >
                    {/* Header */}
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
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                iOS • Flutter • Full-stack • AI • Projects
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            style={{
                                border: "1px solid rgba(255,255,255,0.10)",
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.75)",
                                borderRadius: 12,
                                padding: "6px 10px",
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
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
                                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
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
                                    Typing…
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
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
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 14,
                                outline: "none",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.90)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={send}
                            disabled={!canSend}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 14,
                                border: "1px solid rgba(255,255,255,0.16)",
                                background: "rgba(255,255,255,0.14)",
                                color: "rgba(255,255,255,0.92)",
                                cursor: canSend ? "pointer" : "not-allowed",
                                opacity: canSend ? 1 : 0.5,
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating button — ALWAYS bottom-right */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle chat"
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
                <span style={{ fontSize: 13, fontWeight: 700 }}>{open ? "Close" : "Chat"}</span>
            </button>
        </div>,
        document.body
    );
}
