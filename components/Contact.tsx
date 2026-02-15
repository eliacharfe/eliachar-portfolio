// components/Contact.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useC1Background } from "@/hooks/useC1Background";
import emailjs from "@emailjs/browser";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    type SendState = "idle" | "sending" | "sent" | "error";

    const [sendState, setSendState] = useState<SendState>("idle");
    const [toastOpen, setToastOpen] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.groupCollapsed("%c[Contact] SUBMIT", "color:#22c55e;font-weight:700");
        console.log("✅ onSubmit fired");
        console.log("form:", form);

        if (sendState === "sending") {
            console.log("⛔ Already sending, skipping.");
            console.groupEnd();
            return;
        }

        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

        console.log("env:", {
            hasPublicKey: !!publicKey,
            hasServiceId: !!serviceId,
            hasTemplateId: !!templateId,
            publicKeyPreview: publicKey ? publicKey.slice(0, 5) + "…" : null,
            serviceId,
            templateId,
        });

        if (!publicKey || !serviceId || !templateId) {
            console.error("❌ Missing EmailJS env vars (.env.local). Restart dev server.");
            setSendState("error");
            alert("Missing EmailJS env vars. Check console + restart dev server.");
            console.groupEnd();
            return;
        }

        setSendState("sending");
        console.log("➡️ setSendState('sending')");

        const templateParams = {
            from_name: form.name,
            reply_to: form.email,
            subject: form.subject,
            message: form.message,
        };

        console.log("templateParams:", templateParams);
        console.log("🚀 calling emailjs.send(...)");

        try {
            const res = await emailjs.send(serviceId, templateId, templateParams, {
                publicKey,
            });

            console.log("✅ EmailJS success:", res);

            setSendState("sent");
            setToastOpen(true);

            setForm({ name: "", email: "", subject: "", message: "" });
            console.log("🧹 cleared form");

            window.setTimeout(() => setSendState("idle"), 2500);
            console.groupEnd();
        } catch (err) {
            console.error("❌ EmailJS failed:", err);
            setSendState("error");
            alert("Email failed to send. Open console for details.");
            window.setTimeout(() => setSendState("idle"), 2500);
            console.groupEnd();
        }
    }

    useEffect(() => {
        if (!toastOpen) return;
        const t = window.setTimeout(() => setToastOpen(false), 4500);
        return () => window.clearTimeout(t);
    }, [toastOpen]);


    const sectionRef = useRef<HTMLElement | null>(null);

    useC1Background(sectionRef);

    return (
        <section id="contact-slide" className="py-5 panel" ref={sectionRef}>

            {/* Success popup / toast */}
            <div
                className="position-fixed bottom-0 end-0 p-3"
                style={{ zIndex: 9999 }}
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    className={`toast align-items-center text-white bg-success border-0 ${toastOpen ? "show" : "hide"
                        }`}
                    role="alert"
                >
                    <div className="d-flex">
                        <div className="toast-body">
                            <i className="fas fa-check-circle me-2" />
                            Mail sent successfully! I&apos;ll get back to you soon.
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            aria-label="Close"
                            onClick={() => setToastOpen(false)}
                        />
                    </div>
                </div>
            </div>



            <div className="container d-flex align-items-center" style={{ minHeight: "100vh" }}>
                <div className="row w-100 g-5 align-items-center">
                    {/* Left Info Column */}
                    <div className="col-lg-5">
                        <h6 className="tag">Contact</h6>
                        <h2 className="display-5 fw-bold mb-4">
                            Let&apos;s build something{" "}
                            <span className="text-info">extraordinary</span>.
                        </h2>
                        <p className="text-secondary mb-4">
                            Whether it&apos;s a senior role, an AI-driven project, or just a
                            technical deep-dive, my inbox is always open.
                        </p>

                        <div className="contact-info-item d-flex align-items-center mb-3">
                            <div className="icon-box me-3">
                                <i className="fas fa-envelope text-info" />
                            </div>
                            <span>eliacharfeig@gmail.com</span>
                        </div>

                        <div className="contact-info-item d-flex align-items-center">
                            <div className="icon-box me-3">
                                <i className="fab fa-linkedin-in text-info" />
                            </div>
                            <span>linkedin.com/in/eliachar-feig</span>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="col-lg-7">
                        <div className="contact-form-card">
                            <form id="contact-form" onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="small text-secondary mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="form-control custom-input"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="small text-secondary mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="form-control custom-input"
                                                placeholder="name@company.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="small text-secondary mb-2">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                className="form-control custom-input"
                                                placeholder="How can I help?"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="small text-secondary mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                rows={4}
                                                value={form.message}
                                                onChange={handleChange}
                                                className="form-control custom-input"
                                                placeholder="Tell me about your project..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            disabled={sendState === "sending"}
                                            className="btn btn-pro w-100"
                                            style={{ padding: "16px 0", borderRadius: "50px", opacity: sendState === "sending" ? 0.85 : 1 }}
                                        >
                                            {sendState === "sending" ? (
                                                <>
                                                    <span>Sending...</span>
                                                    <i className="fas fa-spinner fa-spin ms-2" />
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <i className="fas fa-paper-plane ms-2" />
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* End Form Column */}
                </div>
            </div>
        </section>


    );
}
