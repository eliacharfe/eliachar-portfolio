// components/C1Spacer.tsx
"use client";

import React, { useRef } from "react";
import { useC1Background } from "@/hooks/useC1Background";

type Props = {
    id?: string;
    className?: string;
    height?: string; // default "100vh"
};

export default function C1Spacer({ id = "c1-spacer", className = "", height = "100vh" }: Props) {
    const sectionRef = useRef<HTMLElement | null>(null);
    useC1Background(sectionRef);

    return (
        <section
            id={id}
            ref={sectionRef}
            className={`panel ${className}`}
            style={{ minHeight: height, position: "relative" }}
            aria-hidden="true"
        >
            <div className="bg-c1-layer" aria-hidden="true" />

            {/* optional: subtle overlay so it doesn't look “blank black” */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35))",
                    pointerEvents: "none",
                }}
            />
        </section>
    );
}
