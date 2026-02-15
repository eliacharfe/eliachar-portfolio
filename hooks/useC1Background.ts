
// hooks/useC1Background.ts
"use client";

import { useEffect, RefObject } from "react";

export function useC1Background(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    document.documentElement.setAttribute("data-bg-c1", "on");
                } else {
                    const otherActiveSections = Array.from(
                        document.querySelectorAll(".c1-section")
                    ).some((section) => {
                        if (section === el) return false;
                        const rect = section.getBoundingClientRect();
                        return rect.top < window.innerHeight && rect.bottom > 0;
                    });

                    if (!otherActiveSections) {
                        document.documentElement.removeAttribute("data-bg-c1");
                    }
                }
            },
            {
                root: null,
                threshold: 0,
                rootMargin: "-1px 0px -1px 0px",
            }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            if (document.querySelectorAll(".c1-section").length <= 1) {
                document.documentElement.removeAttribute("data-bg-c1");
            }
        };
    }, [ref]);
}
