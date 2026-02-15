

// components/Learning.tsx
"use client";

import React, { useRef } from "react";
import { useC1Background } from "@/hooks/useC1Background";

type LearningItem = {
    iconClass: string;
    title: string;
    desc: string;
    tags: { text: string; size?: "x-small" | "small" }[];
};

const ITEMS: LearningItem[] = [
    {
        iconClass: "fas fa-brain",
        title: "LLM & RAG",
        desc: "Building robust retrieval systems to ground LLMs in private data.",
        tags: [
            { text: "Vector DBs", size: "x-small" },
            { text: "LangChain", size: "x-small" },
        ],
    },
    {
        iconClass: "fas fa-sliders-h",
        title: "Fine-tuning & LoRA",
        desc: "Optimizing performance using PEFT and Low-Rank Adaptation.",
        tags: [
            { text: "PyTorch", size: "x-small" },
            { text: "HuggingFace", size: "small" },
        ],
    },
    {
        iconClass: "fas fa-robot",
        title: "AI Agents",
        desc: "Designing autonomous systems capable of planning and tool-use.",
        tags: [
            { text: "AutoGPT", size: "x-small" },
            { text: "Function Calling", size: "small" },
        ],
    },
    {
        iconClass: "fas fa-network-wired",
        title: "Deep Learning",
        desc: "Mastering neural architectures and attention mechanisms.",
        tags: [
            { text: "PyTorch", size: "x-small" },
            { text: "Transformers", size: "x-small" },
            { text: "Neural Nets", size: "x-small" },
        ],
    },
    {
        iconClass: "fas fa-magic",
        title: "Generative AI",
        desc: "Exploring diffusion models and transformer architectures.",
        tags: [
            { text: "Diffusion", size: "x-small" },
            { text: "GANs", size: "x-small" },
            { text: "Multi-modal", size: "x-small" },
        ],
    },
];

export default function Learning() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useC1Background(sectionRef);

    return (
        <section id="learning" className="panel py-4 ml-0" ref={sectionRef}>
            <div className="bg-c1-layer" aria-hidden="true" />

            <div className="container d-flex align-items-center" style={{ minHeight: "100vh" }}>
                <div className="w-100">
                    <div className="text-center mb-4" data-aos="fade-up">
                        <h6 className="tag">Continuous Growth</h6>
                        <h2 className="display-6 fw-bold section-title mb-2">What I&apos;m Learning Now</h2>
                        <p className="text-secondary mt-2 small">
                            Deepening my expertise in the frontier of Artificial Intelligence.
                        </p>
                    </div>

                    <div className="row g-3 learning-grid justify-content-center mt-5">
                        {ITEMS.map((item) => (
                            <div key={item.title} className="col-lg-4 col-md-6 learning-card-wrapper">
                                <div className="learning-card">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="learning-icon me-3">
                                            <i className={item.iconClass} />
                                        </div>
                                        <h4 className="mb-0">{item.title}</h4>
                                    </div>

                                    <p className="small text-secondary mb-3">{item.desc}</p>

                                    <div className="d-flex flex-wrap gap-2">
                                        {item.tags.map((t) => (
                                            <span
                                                key={`${item.title}-${t.text}`}
                                                className={[
                                                    "badge rounded-pill bg-dark border border-secondary text-info",
                                                    t.size ?? "x-small",
                                                ].join(" ")}
                                            >
                                                {t.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}
