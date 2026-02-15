

"use client";

import { useEffect } from "react";
import gsap from "gsap";

function isFinePointer() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
}

export default function CursorFX() {
    useEffect(() => {
        if (!isFinePointer()) return;

        const dot = document.querySelector<HTMLElement>(".cursor-dot");
        const outline = document.querySelector<HTMLElement>(".cursor-outline");
        if (!dot || !outline) return;

        const onMove = (e: MouseEvent) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(outline, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", onMove, { passive: true });

        const selector = "a, button, .project-card, .btn-social, .nav-link";
        const bindInteractives = () => {
            const interactives = Array.from(document.querySelectorAll<HTMLElement>(selector));

            const onEnter = () => {
                dot.classList.add("cursor-active");
                outline.classList.add("cursor-active", "cursor-hover-state");
            };

            const onLeave = () => {
                dot.classList.remove("cursor-active");
                outline.classList.remove("cursor-active", "cursor-hover-state");
            };

            interactives.forEach((el) => {
                el.addEventListener("mouseenter", onEnter);
                el.addEventListener("mouseleave", onLeave);
            });

            return () => {
                interactives.forEach((el) => {
                    el.removeEventListener("mouseenter", onEnter);
                    el.removeEventListener("mouseleave", onLeave);
                });
            };
        };

        let unbind = bindInteractives();

        const mo = new MutationObserver(() => {
            unbind?.();
            unbind = bindInteractives();
        });

        mo.observe(document.body, { childList: true, subtree: true });

        const onFirstMove = () => {
            dot.classList.add("cursor-active");
            outline.classList.add("cursor-active");
            window.removeEventListener("mousemove", onFirstMove);
        };
        window.addEventListener("mousemove", onFirstMove, { passive: true });

        return () => {
            mo.disconnect();
            unbind?.();
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mousemove", onFirstMove);
        };
    }, []);

    return null;
}
