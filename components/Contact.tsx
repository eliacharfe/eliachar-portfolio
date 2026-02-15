
// components/Contact.tsx
"use client";

import React, { useState, useRef } from "react";
import { useC1Background } from "@/hooks/useC1Background";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log("Contact form submitted:", form);

        setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    }

    const sectionRef = useRef<HTMLElement | null>(null);

    useC1Background(sectionRef);

    return (
        <section id="contact-slide" className="py-5 panel" ref={sectionRef}>


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
                                            className="btn btn-pro w-100"
                                            style={{ padding: "16px 0", borderRadius: "50px" }}
                                        >
                                            <span>Send Message</span>
                                            <i className="fas fa-paper-plane ms-2" />
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
