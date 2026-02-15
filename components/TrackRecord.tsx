// components/TrackRecord.tsx

"use client";

import { useEffect, useRef } from "react";

type Stat = { label: string; value: number; suffix: string };

const STATS: Stat[] = [
    { label: "Software Engineering", value: 6, suffix: "+" },
    { label: "Active App Users", value: 50, suffix: "k+" },
    { label: "Project Ownership", value: 100, suffix: "%" },
];

export default function TrackRecord() {
    const hostRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const observerOptions: IntersectionObserverInit = {
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const target = entry.target as HTMLElement;

                const endValueRaw = target.getAttribute("data-count");
                const endValue = endValueRaw ? parseInt(endValueRaw, 10) : NaN;

                const suffix = target.getAttribute("data-suffix") || "+";

                if (Number.isNaN(endValue) || endValue <= 0) {
                    observer.unobserve(target);
                    return;
                }

                let startValue = 0;
                const duration = 2000; // ms
                const stepTime = Math.max(10, Math.floor(duration / endValue));

                const counter = window.setInterval(() => {
                    startValue += 1;
                    target.innerText = `${startValue}${suffix}`;

                    if (startValue >= endValue) {
                        target.innerText = `${endValue}${suffix}`;
                        window.clearInterval(counter);
                    }
                }, stepTime);

                observer.unobserve(target); // run once
            });
        }, observerOptions);

        const els = Array.from(host.querySelectorAll<HTMLElement>(".impact-card h3"));
        els.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={(n) => {
                hostRef.current = n;
            }}
            className="panel image-panel reveal-host"
        >

            <img src="/assets/images/c3.jpg" alt="Creative collaboration" />

            <div className="reveal-overlay">
                <div className="reveal-card">
                    <div className="container">
                        <div className="row g-4 text-center">
                            <div className="col-12 mb-4">
                                <h6 className="tag">Track Record</h6>
                                <h2 className="display-6 fw-bold">Impact in Numbers</h2>
                            </div>

                            {STATS.map((s) => (
                                <div className="col-md-4" key={s.label}>
                                    <div className="impact-card">
                                        <h3
                                            className="display-4 fw-bold text-info mb-2"
                                            data-count={s.value}
                                            data-suffix={s.suffix}
                                        >
                                            0{s.suffix}
                                        </h3>
                                        <p className="text-uppercase small tracking-widest text-secondary">
                                            {s.label}
                                        </p>
                                        <div className="impact-bar" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
