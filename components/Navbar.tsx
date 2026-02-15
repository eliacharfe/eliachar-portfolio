// components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    const registeredRef = useRef(false);

    useEffect(() => {
        if (!registeredRef.current) {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            registeredRef.current = true;
        }

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setProgress(scrollPercent);
            setScrolled(scrollTop > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function closeBootstrapCollapseIfOpen() {
        const nav = document.getElementById("navbarNav");
        if (!nav) return;

        if (nav.classList.contains("show")) {
            nav.classList.remove("show");
        }
    }

    function scrollToVertical(hash: string, offsetY: number) {
        if (hash === "#" || hash === "" || hash === "top") {
            gsap.to(window, {
                scrollTo: { y: 0 },
                duration: 0.9,
                ease: "power2.inOut",
                overwrite: "auto",
            });
            return;
        }

        gsap.to(window, {
            scrollTo: { y: hash, offsetY },
            duration: 0.9,
            ease: "power2.inOut",
            overwrite: "auto",
        });
    }


    function scrollToHorizontalPanel(panelHash: string) {
        const st = ScrollTrigger.getById("horizontal-panels");
        if (!st) {
            scrollToVertical(panelHash, 80);
            return;
        }

        st.refresh();

        const panels = gsap.utils.toArray<HTMLElement>("#horizontal-wrapper .panel");
        const panelEl = document.querySelector<HTMLElement>(
            `#horizontal-wrapper ${panelHash}`
        );
        if (!panelEl) return;

        const index = panels.indexOf(panelEl);
        if (index < 0) return;

        const last = panels.length - 1;
        let progress = last === 0 ? 0 : index / last;

        const epsilon = 0.001;
        if (index < last) progress = Math.min(progress + epsilon, 1);
        else progress = Math.max(progress - epsilon, 0);

        const y = st.start + (st.end - st.start) * progress;

        (window as any).__isNavScrolling = true;

        gsap.to(window, {
            scrollTo: y,
            duration: 0.9,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => {
                window.setTimeout(() => {
                    (window as any).__isNavScrolling = false;
                }, 150);
            },
        });
    }

    function onNavClick(
        e: React.MouseEvent,
        hash: string,
        opts?: { offsetY?: number; horizontal?: boolean }
    ) {
        e.preventDefault();

        closeBootstrapCollapseIfOpen();

        if (opts?.horizontal) {
            scrollToHorizontalPanel(hash);
        } else {
            scrollToVertical(hash, opts?.offsetY ?? 80);
        }
    }

    useEffect(() => {
        const handler = (e: Event) => {
            const ce = e as CustomEvent<{
                hash: string;
                offsetY?: number;
                horizontal?: boolean;
            }>;

            const hash = ce?.detail?.hash;
            if (!hash) return;

            const offsetY = ce.detail.offsetY ?? 80;
            const horizontal = ce.detail.horizontal ?? false;

            closeBootstrapCollapseIfOpen();

            if (horizontal) {
                scrollToHorizontalPanel(hash);
            } else {
                scrollToVertical(hash, offsetY);
            }
        };

        window.addEventListener("nav:go", handler as EventListener);
        return () => window.removeEventListener("nav:go", handler as EventListener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <>
            {/* Scroll Progress Bar */}
            <div className="scroll-progress" style={{ width: `${progress}%` }} />

            <nav
                className={`navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? "scrolled" : ""
                    }`}
            >
                <div className="container">

                    <Link
                        className="navbar-brand fw-bold"
                        href="#"
                        onClick={(e) => onNavClick(e, "top", { offsetY: 0 })}
                    >
                        ELIACHAR<span style={{ color: "var(--accent)" }}>.FEIG</span>
                    </Link>


                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">

                                <Link
                                    className="nav-link nav-home"
                                    href="#"
                                    onClick={(e) => onNavClick(e, "top", { offsetY: 0 })}
                                >
                                    <i className="fas fa-home" />
                                </Link>

                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    href="#about"
                                    onClick={(e) => onNavClick(e, "#about", { offsetY: 70 })}
                                >
                                    About
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    href="#work"
                                    onClick={(e) => onNavClick(e, "#work", { offsetY: 60 })}
                                >
                                    Experience
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    href="#projects"
                                    onClick={(e) => onNavClick(e, "#projects", { offsetY: 30 })}
                                >
                                    Projects
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    href="#skills"
                                    onClick={(e) =>
                                        onNavClick(e, "#skills", { horizontal: true })
                                    }
                                >
                                    Skills
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    href="#learning"
                                    onClick={(e) =>
                                        onNavClick(e, "#learning", { horizontal: true })
                                    }
                                >
                                    Learning
                                </Link>
                            </li>

                            {/* Contact Dropdown */}
                            <li className="nav-item dropdown ms-lg-4">
                                <a
                                    className="nav-link btn btn-outline-info px-4 rounded-pill text-info"
                                    href="#contact-slide"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={(e) =>
                                        onNavClick(e, "#contact-slide", { horizontal: true })
                                    }
                                >
                                    Contact Me
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end mt-3 border-secondary bg-dark shadow-lg">
                                    <li>
                                        <a
                                            className="dropdown-item text-light py-2"
                                            href="mailto:eliacharfeig@gmail.com"
                                        >
                                            <i className="fas fa-envelope me-2 text-info" />
                                            Email Me
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item text-light py-2"
                                            href="tel:058-7272372"
                                        >
                                            <i className="fas fa-phone me-2 text-info" />
                                            Call Me
                                        </a>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider bg-secondary" />
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item text-light py-2"
                                            href="https://www.linkedin.com/in/eliachar-feig/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fab fa-linkedin me-2 text-info" />
                                            LinkedIn Profile
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
