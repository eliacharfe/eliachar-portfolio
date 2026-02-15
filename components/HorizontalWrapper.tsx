
// components/HorizontalWrapper.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
    id?: string;
    className?: string;
    children: React.ReactNode;
};

export default function HorizontalWrapper({ id, className = "", children }: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const panels = useMemo(() => React.Children.toArray(children), [children]);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 992px)", () => {
                const panelEls = gsap.utils.toArray<HTMLElement>("#horizontal-wrapper .panel");
                if (!panelEls.length) return;

                (window as any).__isNavScrolling ??= false;

                const horizontalTween = gsap.to(panelEls, {
                    xPercent: -100 * (panelEls.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        id: "horizontal-panels",
                        trigger: wrapper,
                        pin: true,
                        scrub: 1,
                        snap:
                            panelEls.length > 1
                                ? {
                                    snapTo: (value: number) => {
                                        if ((window as any).__isNavScrolling) return value;
                                        return gsap.utils.snap(1 / (panelEls.length - 1), value);
                                    },
                                    duration: 0.35,
                                    delay: 0,
                                    ease: "power2.out",
                                }
                                : 1,
                        end: () => "+=" + (wrapper.scrollWidth - window.innerWidth) * 0.5,

                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });

                requestAnimationFrame(() => ScrollTrigger.refresh());

                return () => {
                    horizontalTween.scrollTrigger?.kill();
                    horizontalTween.kill();
                };
            });

            mm.add("(max-width: 991.98px)", () => {
                gsap.utils
                    .toArray<HTMLElement>("#horizontal-wrapper .panel")
                    .forEach((p) => gsap.set(p, { clearProps: "transform" }));

                ScrollTrigger.getById("horizontal-panels")?.kill();
                requestAnimationFrame(() => ScrollTrigger.refresh());

                return () => { };
            });

            return () => mm.revert();
        }, wrapper);

        return () => ctx.revert();
    }, [panels.length]);

    return (
        <section id={id} className={className}>
            <div
                id="horizontal-wrapper"
                ref={(n) => {
                    wrapperRef.current = n;
                }}
            >
                {panels.map((child, i) => (
                    <React.Fragment key={i}>{child}</React.Fragment>
                ))}
            </div>
        </section>
    );
}
