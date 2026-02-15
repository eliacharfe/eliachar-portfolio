


// components/Skills.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

declare global {
    interface Window {
        VanillaTilt: any;
    }
}

export default function Skills() {
    const [skillsVisible, setSkillsVisible] = useState(false);

    const sectionRef = useRef<HTMLElement | null>(null);

    // Re-trigger "visible" every time we enter the section
    useEffect(() => {
        const el = document.getElementById("skills");
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSkillsVisible(false);
                    requestAnimationFrame(() => setSkillsVisible(true));
                } else {
                    setSkillsVisible(false);
                }
            },
            {
                threshold: 0.25,
                rootMargin: "-80px 0px -20% 0px",
            }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // VanillaTilt init/destroy (only when visible)
    useEffect(() => {
        if (!skillsVisible) return;
        if (typeof window === "undefined") return;
        if (!window.VanillaTilt) return;

        const skillCards = Array.from(document.querySelectorAll(".skill-box")) as HTMLElement[];
        if (!skillCards.length) return;

        window.VanillaTilt.init(skillCards, {
            max: 5,
            speed: 300,
            glare: true,
            "max-glare": 0.1,
        });

        return () => {
            skillCards.forEach((card: any) => {
                if (card.vanillaTilt) card.vanillaTilt.destroy();
            });
        };
    }, [skillsVisible]);

    // GSAP appear animation (replays every time we enter)
    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;

        const header = root.querySelector(".skills-animate-header");
        const cards = Array.from(root.querySelectorAll(".skill-box"));
        const divider = root.querySelector(".skills-divider");
        const footer = root.querySelector(".skills-footer");

        // When we leave, reset styles so next entry can animate again
        if (!skillsVisible) {
            gsap.killTweensOf([header, ...cards, divider, footer]);

            gsap.set([header, ...cards, divider, footer], { clearProps: "all" });
            gsap.set([header, ...cards, divider, footer], { opacity: 0, y: 16 });

            if (divider) {
                gsap.set(divider, { opacity: 0, scaleX: 0.9, transformOrigin: "50% 50%" });
            }
            return;
        }

        const ctx = gsap.context(() => {
            gsap.set([header, ...cards, divider, footer], { opacity: 0, y: 16 });
            if (divider) {
                gsap.set(divider, { opacity: 0, scaleX: 0.9, transformOrigin: "50% 50%" });
            }

            // const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });


            if (header) {
                tl.to(header, { opacity: 1, y: 0, duration: 0.35 }, 0);
            }

            tl.to(
                cards,
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
                header ? 0.05 : 0
            );

            if (divider) {
                tl.to(divider, { opacity: 1, scaleX: 1, duration: 0.3 }, "-=0.2");
            }

            if (footer) {
                tl.to(footer, { opacity: 1, y: 0, duration: 0.35 }, "-=0.15");
            }

        }, root);

        return () => {
            ctx.revert();
        };
    }, [skillsVisible]);

    return (
        <section
            id="skills"
            ref={(node) => {
                sectionRef.current = node;
            }}
            className="panel pt-5 pb-0 mb-0"
        >
            <div className="container py-5">
                <div className="text-center mb-5 mt-lg-5 skills-animate-header">
                    <h6 className="tag">Expertise</h6>
                    <h2 className="display-6 fw-bold section-title">Technical Stack</h2>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="skill-box">
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-mobile-alt text-info fs-3 me-3"></i>
                                <h4 className="mb-0">Mobile Architecture</h4>
                            </div>
                            <p className="small text-secondary">
                                Expertise in iOS (Swift/SwiftUI/UIKit) and cross-platform Flutter/Dart. Focus on
                                modular, testable code and high-performance UI.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Swift
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    SwiftUI
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Flutter
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Dart
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="skill-box">
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-brain text-info fs-3 me-3"></i>
                                <h4 className="mb-0">Full-Stack &amp; AI</h4>
                            </div>
                            <p className="small text-secondary">
                                Developing LLM-based features and personalized AI insights. Designing APIs and
                                backend logic with Node.js and Spring Boot.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    LLM Integration
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Prompt Eng.
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Node.js
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    Python
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="skill-box">
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-layer-group text-info fs-3 me-3"></i>
                                <h4 className="mb-0">Product &amp; System Ownership</h4>
                            </div>
                            <p className="small text-secondary">
                                Owning features end-to-end — from product thinking and architecture decisions to
                                production delivery.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    System Design
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    API Design
                                </span>
                                <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                    End-to-End Delivery
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="skills-divider">
                <span className="skills-divider-line"></span>
                <span className="skills-divider-icon">
                    <i className="fas fa-layer-group"></i>
                </span>
                <span className="skills-divider-line"></span>
            </div>

            {/* Skills footer */}
            <div className="skills-footer mt-3 pt-3">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <p className="text-secondary mb-3">
                            I don’t treat these as isolated skills - I combine them to design, build, and ship{" "}
                            <strong className="text-light">reliable, scalable products</strong> from idea to
                            production.
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                            <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                Architecture-first
                            </span>
                            <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                Performance-aware
                            </span>
                            <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                Production-focused
                            </span>
                            <span className="badge rounded-pill bg-dark border border-secondary text-info">
                                User-centric
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}



// "use client";

// import { useEffect, useState } from "react";

// declare global {
//     interface Window {
//         VanillaTilt: any;
//     }
// }

// export default function Skills() {
//     const [skillsVisible, setSkillsVisible] = useState(false);

//     useEffect(() => {
//         const el = document.getElementById("skills");
//         if (!el) return;

//         const obs = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setSkillsVisible(false);
//                     requestAnimationFrame(() => setSkillsVisible(true));
//                 } else {
//                     setSkillsVisible(false);
//                 }
//             },
//             {
//                 threshold: 0.25,
//                 rootMargin: "-80px 0px -20% 0px",
//             }
//         );

//         obs.observe(el);
//         return () => obs.disconnect();
//     }, []);

//     useEffect(() => {
//         if (!skillsVisible) return;
//         if (typeof window === "undefined") return;
//         if (!window.VanillaTilt) return;

//         const skillCards = document.querySelectorAll(".skill-box");

//         window.VanillaTilt.init(skillCards, {
//             max: 5,
//             speed: 300,
//             glare: true,
//             "max-glare": 0.1,
//         });

//         return () => {
//             skillCards.forEach((card: any) => {
//                 if (card.vanillaTilt) {
//                     card.vanillaTilt.destroy();
//                 }
//             });
//         };
//     }, [skillsVisible]);

//     return (
//         <section id="skills" className="panel pt-5 pb-0 mb-0">
//             <div className="container py-5">
//                 <div className="text-center mb-5 mt-lg-5">
//                     <h6 className="tag">Expertise</h6>
//                     <h2 className="display-6 fw-bold section-title">
//                         Technical Stack
//                     </h2>
//                 </div>

//                 <div className="row g-4">
//                     <div className="col-md-4">
//                         <div className="skill-box">
//                             <div className="d-flex align-items-center mb-3">
//                                 <i className="fas fa-mobile-alt text-info fs-3 me-3"></i>
//                                 <h4 className="mb-0">Mobile Architecture</h4>
//                             </div>
//                             <p className="small text-secondary">
//                                 Expertise in iOS (Swift/SwiftUI/UIKit) and cross-platform Flutter/Dart.
//                                 Focus on modular, testable code and high-performance UI.
//                             </p>
//                             <div className="d-flex flex-wrap gap-2">
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Swift</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">SwiftUI</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Flutter</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Dart</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-md-4">
//                         <div className="skill-box">
//                             <div className="d-flex align-items-center mb-3">
//                                 <i className="fas fa-brain text-info fs-3 me-3"></i>
//                                 <h4 className="mb-0">Full-Stack & AI</h4>
//                             </div>
//                             <p className="small text-secondary">
//                                 Developing LLM-based features and personalized AI insights.
//                                 Designing APIs and backend logic with Node.js and Spring Boot.
//                             </p>
//                             <div className="d-flex flex-wrap gap-2">
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">LLM Integration</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Prompt Eng.</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Node.js</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">Python</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-md-4">
//                         <div className="skill-box">
//                             <div className="d-flex align-items-center mb-3">
//                                 <i className="fas fa-layer-group text-info fs-3 me-3"></i>
//                                 <h4 className="mb-0">Product & System Ownership</h4>
//                             </div>
//                             <p className="small text-secondary">
//                                 Owning features end-to-end — from product thinking and architecture
//                                 decisions to production delivery.
//                             </p>
//                             <div className="d-flex flex-wrap gap-2">
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">System Design</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">API Design</span>
//                                 <span className="badge rounded-pill bg-dark border border-secondary text-info">End-to-End Delivery</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//             <div className="skills-divider">
//                 <span className="skills-divider-line"></span>
//                 <span className="skills-divider-icon">
//                     <i className="fas fa-layer-group"></i>
//                 </span>
//                 <span className="skills-divider-line"></span>
//             </div>

//             {/* Skills footer (missing part) */}
//             <div className="skills-footer mt-3 pt-3">
//                 <div className="row justify-content-center">
//                     <div className="col-lg-10 text-center">
//                         <p className="text-secondary mb-3">
//                             I don’t treat these as isolated skills - I combine them to design, build,
//                             and ship{" "}
//                             <strong className="text-light">reliable, scalable products</strong>{" "}
//                             from idea to production.
//                         </p>

//                         <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
//                             <span className="badge rounded-pill bg-dark border border-secondary text-info">
//                                 Architecture-first
//                             </span>
//                             <span className="badge rounded-pill bg-dark border border-secondary text-info">
//                                 Performance-aware
//                             </span>
//                             <span className="badge rounded-pill bg-dark border border-secondary text-info">
//                                 Production-focused
//                             </span>
//                             <span className="badge rounded-pill bg-dark border border-secondary text-info">
//                                 User-centric
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>

//     );
// }
