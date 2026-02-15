// components/Hero.tsx

import Link from "next/link";
import HeroEffects from "./HeroEffects";

export default function Hero() {
    return (
        <header id="hero" className="hero-section">
            <HeroEffects />

            <div className="container">
                <div className="hero-panel">
                    <h1 className="display-1">Eliachar Feig</h1>

                    <p className="hero-tagline">
                        From idea to production.
                    </p>

                    <p className="lead text-light opacity-75 mb-4">
                        Senior Mobile Engineer specializing in{" "}
                        <strong>iOS & Flutter</strong>
                        <br />
                        Building scalable, product-driven systems with{" "}
                        <span className="text-info">Applied AI</span>
                    </p>

                    <p className="text-light opacity-75 small mb-4">
                        Shipped production apps • AI-powered product on Google Play • Enterprise-scale systems
                    </p>

                    <div className="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
                        <Link href="#projects" className="btn-pro text-decoration-none">
                            Explore Projects
                        </Link>

                        <Link
                            href="#about"
                            className="btn btn-outline-light rounded-pill px-4 justify-content-cente"
                        >
                            About Me
                        </Link>

                        <a
                            href="https://www.linkedin.com/in/eliachar-feig/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-social"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>

                    <div className="marquee mt-4">
                        <div className="marquee-content">
                            <span>Full-stack</span> • <span>SwiftUI</span> • <span>Flutter</span> •
                            <span>Node.js</span> • <span>Firebase</span> • <span>Applied AI</span> •
                            <span>LLM Engineering</span> • <span>iOS/Android/Web</span> •
                            <span>Apps & Websites</span> •
                        </div>
                    </div>

                    <div className="text-center mt-4 opacity-50 small">
                        ↓ Scroll to see selected work
                    </div>
                </div>
            </div>
        </header>
    );
}
