
// components/Work.tsx
"use client";

import React, { useEffect, useRef } from "react";

const CORE_STRENGTHS = [
    "iOS (Swift / UIKit / SwiftUI)",
    "Flutter / Dart",
    "Product-driven Engineering",
    "Architecture & State",
    "Performance & Stability",
    "Security & Reliability",
];

const BULLETS = [
    <>
        Shipped and maintained <strong className="text-light">enterprise-scale mobile apps</strong>{" "}
        for global luxury brands such Cartier, Chanel and Macys&apos;s.
    </>,
    <>
        Designed <strong className="text-light">complex user flows</strong> and scalable{" "}
        <strong className="text-light">state management</strong>.
    </>,
    <>
        Owned features <strong className="text-light">end-to-end</strong>, collaborating across product,
        backend, and design.
    </>,
    <>
        Improved <strong className="text-light">performance, stability, and security</strong> across
        multiple production releases.
    </>,
];

export default function Work() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        let ctx: any;

        (async () => {
            const gsapModule = await import("gsap");
            const stModule = await import("gsap/ScrollTrigger");

            const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
            const ScrollTrigger =
                (stModule as any).ScrollTrigger || (stModule as any).default;

            gsap.registerPlugin(ScrollTrigger);

            const el = sectionRef.current;
            if (!el) return;

            const q = gsap.utils.selector(el);

            // elements
            const left = q(".work-left");
            const right = q(".work-card");
            const title = q(".section-title");
            const tag = q(".tag");
            const focus = q(".work-focus");
            const badges = q(".work-badge-item");
            const points = q(".work-point");
            const cardTop = q(".work-card > .d-flex");
            const divider = q(".work-divider");
            const cardBadge = q(".work-badge");

            ctx = gsap.context(() => {
                gsap.set([left, right], { opacity: 0, y: 28 });
                gsap.set([tag, title, focus], { opacity: 0, y: 18 });
                gsap.set(badges, { opacity: 0, y: 10, scale: 0.98 });
                gsap.set([cardTop, divider, cardBadge], { opacity: 0, y: 16 });
                gsap.set(points, { opacity: 0, y: 14 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "top 75%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                    defaults: { ease: "power2.out" },
                });

                // Section intro
                tl.to(left, { opacity: 1, y: 0, duration: 0.7 }, 0)
                    .to(
                        [tag, title],
                        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
                        0.05
                    )
                    .to(focus, { opacity: 1, y: 0, duration: 0.55 }, 0.25)
                    .to(
                        badges,
                        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 },
                        0.35
                    );

                // Card
                tl.to(right, { opacity: 1, y: 0, duration: 0.75 }, 0.1)
                    .to(
                        [cardTop, cardBadge],
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
                        0.25
                    )
                    .to(divider, { opacity: 1, y: 0, duration: 0.35 }, 0.35)
                    .to(points, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 0.45);

                const badgeEls = (badges as Element[]) || [];
                badgeEls.forEach((b) => {
                    b.addEventListener("mouseenter", () => {
                        gsap.to(b, { y: -2, duration: 0.18, overwrite: true });
                    });
                    b.addEventListener("mouseleave", () => {
                        gsap.to(b, { y: 0, duration: 0.18, overwrite: true });
                    });
                });
            }, el);
        })();

        return () => {
            if (ctx) ctx.revert();
        };
    }, []);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const bg = el.querySelector(".work-bg-c1") as HTMLElement | null;
        if (!bg) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                bg.style.opacity = entry.isIntersecting ? "1" : "0";
            },
            {
                root: null,
                rootMargin: "-25% 0px -25% 0px",
                threshold: 0.01,
            }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);


    return (
        <section id="work" className="work-section" ref={sectionRef as any}>
            {/* Scoped Background Layer */}
            <div className="work-bg-c1" aria-hidden="true" />

            {/* Foreground Content */}
            <div className="container  work-content">
                <div className="row align-items-center g-5">

                    {/* Left Intro */}
                    <div className="col-lg-5 work-left">
                        <h6 className="tag mb-2">Experience</h6>

                        <h2 className="display-5 fw-bold mb-4 section-title">
                            Experience in <span className="text-info">Industry</span>.
                        </h2>

                        <p className="text-secondary mb-4">
                            Building production-grade mobile products for enterprise clients where quality,
                            security, performance, and maintainability are non-negotiable.
                            <br />
                            <br />
                            Operating in high-scale, regulated environments that demand long-term ownership and
                            reliability.
                        </p>

                        <div className="mt-4 p-3 rounded-3 work-highlight work-focus">
                            <p className="small mb-0 text-light">
                                <strong>Focus:</strong> Product-driven engineering, scalable architecture,
                                end-to-end delivery, and stability across releases.
                            </p>
                        </div>

                        {/* Core strengths */}
                        <div className="mt-4 mb-4 work-strengths">
                            <div className="small text-secondary mb-2">Core strengths</div>

                            <div className="d-flex flex-wrap gap-2">
                                {CORE_STRENGTHS.map((label) => (
                                    <span
                                        key={label}
                                        className="badge rounded-pill bg-dark border border-secondary text-info work-badge-item"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="col-lg-7">
                        <div className="work-card">
                            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                                <div>
                                    <h3 className="mb-1 fw-bold">
                                        Senior Mobile &amp; Product Engineer
                                    </h3>

                                    <div className="text-secondary">
                                        <span className="text-info fw-semibold">Balink LTD</span>
                                        <span className="opacity-50 mx-2">•</span>
                                        <span>2022 – Present</span>
                                    </div>
                                </div>

                                <div className="work-badge">
                                    <i className="fas fa-briefcase me-2" />
                                    Enterprise Mobile
                                </div>
                            </div>

                            <hr className="work-divider my-4" />

                            <div className="work-points">
                                {BULLETS.map((node, idx) => (
                                    <div className="work-point" key={idx}>
                                        <div className="work-point-icon">
                                            <i className="fas fa-check" />
                                        </div>
                                        <p className="mb-0 text-secondary">{node}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );

}
