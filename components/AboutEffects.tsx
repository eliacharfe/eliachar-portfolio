// components/AboutEffects.tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutEffects() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            const makeAnim = () =>
                gsap
                    .timeline({ paused: true })
                    .set("#about .about-left", { opacity: 0, x: -60, y: 10, filter: "blur(10px)" })
                    .set("#about .about-right", { opacity: 0, x: 60, y: 10, filter: "blur(10px)" })
                    .to("#about .about-left", {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.85,
                        ease: "power3.out",
                    })
                    .to(
                        "#about .about-right",
                        {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 0.85,
                            ease: "power3.out",
                        },
                        "-=0.6"
                    );

            const tl = makeAnim();

            ScrollTrigger.create({
                trigger: "#about",
                start: "top 75%",
                end: "bottom 25%",
                onEnter: () => tl.restart(true),
                onEnterBack: () => tl.restart(true),
                onLeave: () => tl.pause(0),
                onLeaveBack: () => tl.pause(0),
            });
        });

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return null;
}
