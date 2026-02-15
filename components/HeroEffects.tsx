
// components/HeroEffects.tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroEffects() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const isAtTop = window.scrollY < 100;

            if (isAtTop) {
                gsap.set(".hero-panel", { opacity: 0, y: 30, filter: "blur(14px)" });

                const tl = gsap.timeline();
                tl.to(".hero-panel", {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1.05,
                    ease: "power4.out",
                    delay: 0.15,
                })
                    .from(".hero-panel h1", {
                        opacity: 0, y: 18, duration: 0.7, ease: "power3.out"
                    }, "-=0.55")
                    .from(".hero-panel p, .hero-panel .hero-buttons, .hero-panel .marquee", {
                        opacity: 0, y: 16, duration: 0.65, stagger: 0.12, ease: "power3.out"
                    }, "-=0.45");
            }

            gsap.fromTo(".hero-panel",
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)"
                },
                {
                    scrollTrigger: {
                        trigger: "#hero",
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                    x: -200,
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(10px)",
                    ease: "none",
                    immediateRender: false
                }
            );
        });


        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            ctx.revert();
            clearTimeout(timer);
        };
    }, []);

    return null;
}
