
// components/Projects.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import VanillaTilt from "vanilla-tilt";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ProjectKey =
    | "innerorbit"
    | "multillm"
    | "assemble"
    | "bookstore"
    | "sonic"
    | "houseye"
    | "mobileye"
    | "autocomplete";

type ProjectDetails = {
    subtitle: string;
    problem: string;
    solution: string;
    role: string[];
    stack: string[];
    impact: string[];
};

type Project = {
    key: ProjectKey;
    tag: string;
    title: string;
    description: string;
    iconClass: string;
    videoId?: string;
    githubUrl?: string | null;
    googlePlayUrl?: string;
    liveUrl?: string;
    details: ProjectDetails;
};

const PROJECTS: Project[] = [
    {
        key: "innerorbit",
        tag: "AI & Flutter",
        title: "InnerOrbit",
        description:
            "InnerOrbit is a full-stack, AI-powered mobile app designed to provide personalized self-development insights through intelligent data analysis.",
        iconClass: "fas fa-mobile-screen-button",
        videoId: "mvGmHXw_TGo",
        githubUrl: null,
        googlePlayUrl:
            "https://play.google.com/store/apps/details?id=com.eliachar.feig.innerorbit",
        details: {
            subtitle: "AI-Powered Personal Insight Platform",
            problem:
                "People struggle to turn abstract self-development concepts into actionable, personalized insights. I introduce it through some fun games, reading times or even with friends and family in multiplayer mode",
            solution:
                "Built a full-stack mobile app that turns user inputs into personalized insights using LLM-based analysis and scalable cloud infrastructure.",
            role: [
                "Product & UX direction",
                "Flutter architecture",
                "Firebase backend + cloud integration",
                "LLM integration & prompt design",
                "End-to-end shipping & iteration",
            ],
            stack: ["Flutter", "Firebase", "Cloud Functions", "LLM APIs", "REST"],
            impact: [
                "Shipped as a real product",
                "Built for fast experimentation + iteration",
                "Scalable structure for future AI features",
            ],
        },
    },

    {
        key: "multillm",
        tag: "Full Stack & LLMs",
        title: "Multi-LLM Chat Platform",
        description:
            "A production-style, multi-provider AI chat app with per-user authentication, isolated chat history, streaming responses, and PostgreSQL persistence — built with a Next.js frontend and a Dockerized FastAPI backend.",
        iconClass: "fas fa-robot",
        liveUrl: "https://multillm.net/",
        githubUrl: "https://github.com/eliacharfe/multi-llm-platform-chat",
        videoId: undefined,
        details: {
            subtitle: "Multi-Provider AI Chat with Streaming + Per-User Persistence",
            problem:
                "Most chat demos are single-provider and stateless. I wanted a real production-style architecture with user authentication, isolated chat sessions per user, multi-provider routing, and token-by-token streaming — not just a basic chatbot UI.",
            solution:
                "Built a full-stack platform with a premium Next.js UI and a Dockerized FastAPI backend that verifies Firebase ID tokens server-side, persists chats/messages in PostgreSQL scoped to user_id, and streams responses via SSE while dynamically routing requests to multiple LLM providers.",
            role: [
                "System architecture (frontend + backend)",
                "Streaming (SSE) integration end-to-end",
                "Firebase Auth integration + server-side token verification",
                "PostgreSQL schema + per-user chat isolation",
                "Provider/model routing + SDK normalization",
                "UI/UX for multi-chat management (sidebar, previews, delete, copy, markdown)",
            ],
            stack: [
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "FastAPI",
                "Python",
                "PostgreSQL",
                "SQLAlchemy (Async)",
                "Firebase Auth",
                "Docker",
                "SSE Streaming",
                "OpenAI / Anthropic / Groq / OpenRouter / Gemini",
            ],
            impact: [
                "Production-style full-stack architecture (not a demo chatbot)",
                "Per-user isolated chat history persisted in PostgreSQL",
                "Real-time streaming UX with provider-agnostic routing",
                "Scalable foundation for multimodal + RAG + cost tracking",
            ],
        },
    },

    {
        key: "assemble",
        tag: "Unity & C#",
        title: "Assemble Z' Army",
        description: "Real-time multiplayer RTS with synchronized state.",
        iconClass: "fas fa-gamepad",
        videoId: "kyKP4AfDlYs",
        githubUrl: "https://github.com/eliacharfe/Assemble-Z-Army.git",
        details: {
            subtitle: "Real-Time Multiplayer Strategy Game",
            problem:
                "Most strategy games in the genre (RTS) are highly complex and require long playtime to understand, making them accessible mainly to experienced players. There is a lack of real-time strategy games that develop long-term strategic thinking while remaining intuitive, approachable, and easy to learn for a broader audience.",
            solution:
                "Developed a Unity RTS with real-time networking and synchronized gameplay using the Mirror library.\nCoded in C#.",
            role: [
                "Gameplay systems implementation",
                "Networking integration",
                "Performance tuning for multiplayer",
                "Design a nice UI/UX",
            ],
            stack: ["Unity", "C#", "Mirror"],
            impact: [
                "Stable multiplayer state sync",
                "Clear architecture for gameplay systems",
            ],
        },
    },

    {
        key: "bookstore",
        tag: "Full Stack",
        title: "Spring Book Store",
        description: "Secure e-commerce backend with auth + transactions.",
        iconClass: "fas fa-store",
        videoId: "QmwvMqvJRSU",
        githubUrl: null,
        details: {
            subtitle: "Secure E-Commerce Web Platform",
            problem:
                "Need a secure and maintainable e-commerce backend with authentication, authorization, and data integrity.",
            solution:
                "Implemented a full-stack bookstore with secure backend services, transactional flows, and database modeling.",
            role: [
                "Backend architecture",
                "Security & auth logic",
                "API design & database modeling",
            ],
            stack: ["Spring Boot", "Java", "Spring Security", "MySQL", "JavaScript"],
            impact: ["Secure auth flows", "Structured backend suitable for expansion"],
        },
    },

    {
        key: "sonic",
        tag: "C++ & SFML",
        title: "Sonic Remake",
        description: "OOP game architecture with performance focus.",
        iconClass: "fas fa-bolt",
        videoId: "mfwwdH-bD9k",
        githubUrl: "https://github.com/eliacharfe/Sonic_GAME_OOP2_Project.git",
        details: {
            subtitle: "C++ Game Architecture with SFML",
            problem:
                "Recreating platformer mechanics while applying clean OOP principles and performance-aware design.",
            solution:
                "Built a modular C++ game using SFML with a clean game loop, entity abstractions, and reusable systems.",
            role: ["Engine architecture", "Game mechanics", "Performance optimization"],
            stack: ["C++", "SFML", "OOP"],
            impact: ["Cleaner modular codebase", "Optimized core loop + gameplay systems"],
        },
    },

    {
        key: "houseye",
        tag: "IoT & Python",
        title: "HousEye",
        description: "Raspberry Pi security with OpenCV + Firebase.",
        iconClass: "fas fa-microchip",
        videoId: "vXjOUxHrgU0",
        githubUrl: "https://github.com/eliacharfe/HousEye.git",
        details: {
            subtitle: "IoT Home Security with Raspberry Pi",
            problem: "Provide low-cost, real-time home monitoring with alerts and remote access.",
            solution:
                "Built an IoT system with Raspberry Pi camera input, OpenCV processing, and Firebase-based remote connectivity.",
            role: [
                "Backend + integrations",
                "Computer vision pipeline",
                "Cloud database + messaging",
            ],
            stack: ["Python", "OpenCV", "Flask", "Firebase", "Raspberry Pi"],
            impact: ["Real-time monitoring pipeline", "Cloud-connected alerts and access"],
        },
    },

    {
        key: "mobileye",
        tag: "Computer Vision",
        title: "Mobileye TFL",
        description: "Traffic light detection + distance estimation.",
        iconClass: "fas fa-eye",
        githubUrl: "https://github.com/eliacharfe/Mobileye-Traffic-Lights-Project.git",
        videoId: undefined,
        details: {
            subtitle: "Traffic Light Detection & Distance Estimation",
            problem: "Detect traffic lights reliably and estimate distance from vehicle footage.",
            solution:
                "Implemented CV pipeline with detection + distance estimation techniques (including SFM concepts).",
            role: ["Image processing pipeline", "Model/logic integration", "Distance estimation"],
            stack: ["Python", "OpenCV", "Neural Nets", "SFM"],
            impact: ["Robust detection under varying scenes", "Efficient processing pipeline"],
        },
    },

    {
        key: "autocomplete",
        tag: "Algorithms & Python",
        title: "Google Autocomplete",
        description: "Error-tolerant autocomplete under strict constraints.",
        iconClass: "fas fa-magnifying-glass",
        githubUrl: "https://github.com/ExcellentTeam22/google-project-group-8",
        videoId: undefined,
        details: {
            subtitle: "Error-Tolerant Search Suggestions",
            problem:
                "Autocomplete must handle misspellings while staying fast under strict memory/runtime limits.",
            solution:
                "Built an optimized autocomplete engine with spell-tolerant matching and efficient lookup.",
            role: ["Algorithm design", "Optimization for memory/runtime", "Edge-case handling"],
            stack: ["Python", "Algorithms", "Data Structures"],
            impact: ["Fast suggestions", "Reliable tolerance to user typos"],
        },
    },
];

function YoutubeModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
    return (
        <div className="project-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                <button className="project-modal-close" onClick={onClose} aria-label="Close video">
                    ✕
                </button>

                <div className="project-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="Project video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}

function DetailsModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const d = project.details;
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        const el = modalRef.current;
        if (!el) return;
        el.classList.add("shimmer");
        const t = window.setTimeout(() => el.classList.remove("shimmer"), 1100);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div className="project-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div
                ref={modalRef}
                className="project-modal glass-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="project-modal-close" onClick={onClose} aria-label="Close details">
                    ✕
                </button>

                <div className="project-modal-content">
                    <div className="project-modal-header">
                        <div className="tag">{project.tag}</div>
                        <h2 className="project-modal-title">{project.title}</h2>
                        <div className="project-modal-subtitle">{d.subtitle}</div>
                    </div>

                    <div className="project-case-grid">
                        <div className="case-block">
                            <div className="case-title">PROBLEM</div>
                            <div className="text-secondary" style={{ whiteSpace: "pre-line" }}>
                                {d.problem}
                            </div>
                        </div>

                        <div className="case-block">
                            <div className="case-title">SOLUTION</div>
                            <div className="text-secondary" style={{ whiteSpace: "pre-line" }}>
                                {d.solution}
                            </div>
                        </div>

                        <div className="case-block">
                            <div className="case-title">MY ROLE</div>
                            <ul className="mb-0 text-secondary">
                                {d.role.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="case-block">
                            <div className="case-title">TECH STACK</div>
                            <div className="d-flex flex-wrap gap-2">
                                {d.stack.map((t) => (
                                    <span key={t} className="stack-pill">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="case-block">
                            <div className="case-title">IMPACT</div>
                            <ul className="mb-0 text-secondary">
                                {d.impact.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="project-modal-actions">
                        {project.videoId && (
                            <button
                                className="btn btn-sm btn-info rounded-pill px-3"
                                onClick={() => window.open(`https://youtu.be/${project.videoId}`, "_blank")}
                            >
                                <i className="fas fa-eye me-1" /> Watch
                            </button>
                        )}

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-warning rounded-pill px-3"
                            >
                                <i className="fas fa-arrow-up-right-from-square me-1" /> Live
                            </a>
                        )}

                        {project.googlePlayUrl && (
                            <a
                                href={project.googlePlayUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-success rounded-pill px-3"
                            >
                                <i className="fab fa-google-play me-1" /> Google Play
                            </a>
                        )}

                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light rounded-pill px-3"
                            >
                                <i className="fab fa-github me-1" /> Github
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Projects() {
    const [videoId, setVideoId] = useState<string | null>(null);
    const [detailsKey, setDetailsKey] = useState<ProjectKey | null>(null);

    const [projectsVisible, setProjectsVisible] = useState(false);

    const selectedProject = useMemo(
        () => PROJECTS.find((p) => p.key === detailsKey) ?? null,
        [detailsKey]
    );



    useEffect(() => {
        const el = document.getElementById("projects");
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setProjectsVisible(false);
                    requestAnimationFrame(() => setProjectsVisible(true));
                } else {
                    setProjectsVisible(false);
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


    useEffect(() => {

        const cards = Array.from(document.querySelectorAll(".project-card")) as HTMLElement[];

        if (!cards.length) return;

        VanillaTilt.init(cards, {
            max: 10,
            speed: 500,
            glare: true,
            "max-glare": 0.2,
            scale: 1.03,
            easing: "cubic-bezier(.03,.98,.52,.99)",
        });


        return () => {
            cards.forEach((card: any) => {
                if (card.vanillaTilt) {
                    card.vanillaTilt.destroy();
                }
            });
        };
    }, []);

    return (
        <section id="projects" className={`py-1 ${projectsVisible ? "projects-visible" : ""}`}>
            <div className="container mt-4 py-5">
                <div className="text-center mb-5">
                    <h6 className="tag">Portfolio</h6>
                    <h2 className="display-6 fw-bold section-title">Recent Projects</h2>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    className="projectSwiper"
                    spaceBetween={18}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1100: { slidesPerView: 3 },
                    }}
                >
                    {PROJECTS.map((p) => {
                        const hasVideo = !!p.videoId;
                        const hasLive = !!p.liveUrl;
                        const isClickable = hasVideo || hasLive;

                        return (
                            <SwiperSlide key={p.key}>
                                <div className="project-card">
                                    <div
                                        className={`project-hero ${isClickable ? "" : "no-video"}`}
                                        role={isClickable ? "button" : undefined}
                                        tabIndex={isClickable ? 0 : -1}
                                        onClick={() => {
                                            if (hasVideo) {
                                                setVideoId(p.videoId!);
                                            } else if (hasLive) {
                                                window.open(p.liveUrl!, "_blank", "noopener,noreferrer");
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (!isClickable) return;
                                            if (e.key === "Enter" || e.key === " ") {
                                                if (hasVideo) {
                                                    setVideoId(p.videoId!);
                                                } else if (hasLive) {
                                                    window.open(p.liveUrl!, "_blank", "noopener,noreferrer");
                                                }
                                            }
                                        }}
                                    >
                                        <i className={`${p.iconClass} project-hero-icon`} />

                                        {hasVideo && <div className="project-hero-label">Play Video</div>}

                                        {hasLive && !hasVideo && (
                                            <div className="project-hero-label">Visit Website</div>
                                        )}

                                        {hasVideo && (
                                            <div className="video-overlay" aria-hidden="true">
                                                <i className="fas fa-play-circle fa-3x" />
                                            </div>
                                        )}
                                    </div>
                                    {/* <div
                                        className={`project-hero ${hasVideo ? "" : "no-video"}`}
                                        role={hasVideo ? "button" : undefined}
                                        tabIndex={hasVideo ? 0 : -1}
                                        onClick={() => hasVideo && setVideoId(p.videoId!)}
                                        onKeyDown={(e) => {
                                            if (!hasVideo) return;
                                            if (e.key === "Enter" || e.key === " ") setVideoId(p.videoId!);
                                        }}
                                    >
                                        <i className={`${p.iconClass} project-hero-icon`} />
                                        {hasVideo && <div className="project-hero-label">Play Video</div>}
                                        {hasVideo && (
                                            <div className="video-overlay" aria-hidden="true">
                                                <i className="fas fa-play-circle fa-3x" />
                                            </div>
                                        )}
                                    </div> */}

                                    <div className="project-content">
                                        <span className="tag">{p.tag}</span>
                                        <h3 className="mt-2">{p.title}</h3>

                                        <p className="small text-secondary mb-3" style={{ whiteSpace: "pre-line" }}>
                                            {p.description}
                                        </p>

                                        <div className="d-flex gap-2 flex-wrap">
                                            {p.videoId && (
                                                <button
                                                    className="btn btn-sm btn-info rounded-pill px-3"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setVideoId(p.videoId!);
                                                    }}
                                                >
                                                    <i className="fas fa-eye me-1" /> Watch
                                                </button>
                                            )}

                                            {p.liveUrl && (
                                                <a
                                                    href={p.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-warning rounded-pill px-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <i className="fas fa-arrow-up-right-from-square me-1" /> Live
                                                </a>
                                            )}

                                            {p.googlePlayUrl && (
                                                <a
                                                    href={p.googlePlayUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-success rounded-pill px-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <i className="fab fa-google-play me-1" /> Google Play
                                                </a>
                                            )}

                                            {p.githubUrl && (
                                                <a
                                                    href={p.githubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-light rounded-pill px-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <i className="fab fa-github me-1" /> Github
                                                </a>
                                            )}

                                            <button
                                                className="btn btn-sm btn-outline-light rounded-pill px-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDetailsKey(p.key);
                                                }}
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {videoId && <YoutubeModal videoId={videoId} onClose={() => setVideoId(null)} />}
            {selectedProject && <DetailsModal project={selectedProject} onClose={() => setDetailsKey(null)} />}
        </section>
    );
}

