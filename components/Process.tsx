
// components/Process.tsx
"use client";

import React, { useRef } from "react";
import { useC1Background } from "@/hooks/useC1Background";


const PRINCIPLES = [
    "Architecture-first",
    "Performance-aware",
    "Ownership mindset",
    "User-centric",
    "Production discipline",
];

export default function Process() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useC1Background(sectionRef);

    return (
        <section id="process" className="panel py-5 c1-section" ref={sectionRef}>

            {/* The background is now handled globally, no local div needed here */}
            <div className="container d-flex align-items-center" style={{ minHeight: "100vh" }}>

                {/* <div className="container d-flex align-items-center" style={{ minHeight: "100vh" }}> */}
                <div className="w-100">
                    <div className="text-center mb-5">
                        <h6 className="tag">How I Work</h6>
                        <h2 className="display-6 fw-bold section-title">
                            From <span className="text-info">clarity</span> to production.
                        </h2>
                        <p className="text-secondary mt-3 mb-0">
                            A lightweight, product-driven workflow that keeps quality high and cycles fast.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="process-card process-step">
                                <div className="process-icon">
                                    <i className="fas fa-compass" />
                                </div>
                                <h5 className="mb-2">Discover</h5>
                                <p className="small text-secondary mb-0">
                                    Understand the user, scope, constraints, and success metrics.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="process-card process-step">
                                <div className="process-icon">
                                    <i className="fas fa-sitemap" />
                                </div>
                                <h5 className="mb-2">Design</h5>
                                <p className="small text-secondary mb-0">
                                    Architecture + UX decisions that scale and stay maintainable.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="process-card process-step">
                                <div className="process-icon">
                                    <i className="fas fa-code" />
                                </div>
                                <h5 className="mb-2">Build</h5>
                                <p className="small text-secondary mb-0">
                                    Ship incrementally with strong state management and clean boundaries.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="process-card process-step">
                                <div className="process-icon">
                                    <i className="fas fa-rocket" />
                                </div>
                                <h5 className="mb-2">Ship</h5>
                                <p className="small text-secondary mb-0">
                                    Performance, stability, and release readiness - no surprises.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="process-values mt-5">
                        <div className="process-values-inner">
                            <div className="small text-secondary mb-2 text-center">Working principles</div>

                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {PRINCIPLES.map((p) => (
                                    <span
                                        key={p}
                                        className="badge rounded-pill bg-dark border border-secondary text-info"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="process-cta mt-4 d-flex justify-content-center">
                            {/* Navbar will intercept this with GSAP and scroll to the contact panel */}
                            <a
                                href="#contact-slide"
                                className="btn btn-outline-info rounded-pill px-4"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.dispatchEvent(
                                        new CustomEvent("nav:go", {
                                            detail: { hash: "#contact-slide", horizontal: true },
                                        })
                                    );
                                }}
                            >
                                Let’s talk <i className="fas fa-arrow-right ms-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
