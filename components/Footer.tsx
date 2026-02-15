
// components/Footer.tsx
"use client";

export default function Footer() {
    return (
        <footer className="py-5 bg-black border-top border-secondary">
            <div className="container text-center">
                <h2 className="mb-4">Let's Connect</h2>

                <div className="d-flex justify-content-center gap-4 mb-4">
                    <a
                        href="mailto:eliacharfeig@gmail.com"
                        className="text-info fs-3"
                        aria-label="Email"
                    >
                        <i className="fas fa-envelope" />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/eliachar-feig/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info fs-3"
                        aria-label="LinkedIn"
                    >
                        <i className="fab fa-linkedin" />
                    </a>

                    <a
                        href="https://github.com/eliacharfe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info fs-3"
                        aria-label="GitHub"
                    >
                        <i className="fab fa-github" />
                    </a>
                </div>

                <p className="text-secondary small">
                    Copyright © {new Date().getFullYear()} Eliachar Feig.
                    <br />
                    Built with Passion & Code.
                </p>
            </div>
        </footer>
    );
}
