// components/MagneticButtons.tsx
"use client";

import { useEffect } from "react";

const SELECTOR =
    '.btn-pro, .btn-social, .btn-outline-info, .btn-outline-light, button[type="submit"]';

export default function MagneticButtons() {
    useEffect(() => {
        const buttons = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
        if (!buttons.length) return;

        // Keep references so we can remove listeners on cleanup
        const cleanupFns: Array<() => void> = [];

        buttons.forEach((btn) => {
            const onMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const isSubmit = btn instanceof HTMLButtonElement && btn.type === "submit";
                const strength = isSubmit ? 0.15 : 0.3;

                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            };

            const onLeave = () => {
                btn.style.transform = "translate(0px, 0px)";
            };

            // Optional: smoother feel
            btn.style.willChange = "transform";

            btn.addEventListener("mousemove", onMove);
            btn.addEventListener("mouseleave", onLeave);

            cleanupFns.push(() => {
                btn.removeEventListener("mousemove", onMove);
                btn.removeEventListener("mouseleave", onLeave);
                btn.style.transform = "translate(0px, 0px)";
            });
        });

        return () => {
            cleanupFns.forEach((fn) => fn());
        };
    }, []);

    return null;
}
