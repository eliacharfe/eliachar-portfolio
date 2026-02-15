
// components/AiSignature.tsx
"use client";

import Image from "next/image";

export default function AiSignature() {
    return (
        <section className="ai-signature">
            <Image
                src="/assets/images/ai-portrait-wide.png"
                alt="AI-generated portrait representing my work in mobile engineering and applied AI"
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover" }}
            />

            <div className="ai-signature-caption">
                AI-generated portrait reflecting my work at the intersection of{" "}
                <span className="accent">
                    mobile engineering, applied AI
                </span>
                , and human-centered products.
            </div>
        </section>
    );
}
