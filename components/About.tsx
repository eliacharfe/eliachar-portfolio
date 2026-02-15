// components/About.tsx

import Image from "next/image";
import AboutEffects from "./AboutEffects";

export default function About() {
    return (
        <section id="about" className="about-section">
            <AboutEffects />

            <div className="container about-content">
                <div className="row align-items-center g-5">
                    {/* Left column */}
                    <div className="col-lg-6 about-left about-left-pad">
                        <h6 className="tag mb-2">My Background</h6>

                        <h2 className="display-5 fw-bold mb-4">
                            Bridging Engineering, Product, and{" "}
                            <span className="text-info">Applied AI</span>.
                        </h2>

                        <p className="text-secondary">
                            I am a Senior Mobile Engineer with a strong product mindset,
                            specialized in building scalable applications that bridge the gap
                            between user experience and complex backends.
                        </p>

                        <p className="text-secondary">
                            With 3+ years of experience in enterprise iOS & Flutter
                            environments, I’ve expanded into full-stack ownership designing
                            APIs and delivering features end-to-end. Recently, I’ve been
                            focused on Applied AI, shipping production-ready LLM integrations
                            that provide real-world value.
                        </p>

                        <div
                            className="mt-4 p-3 rounded-3"
                            style={{
                                background: "rgba(0, 210, 255, 0.05)",
                                borderLeft: "3px solid var(--accent)",
                            }}
                        >
                            <p className="small mb-0 text-light fst-italic">
                                <strong>Current Focus:</strong> Deepening LLM Engineering to
                                build systems where product, engineering, and AI intersect.
                            </p>
                        </div>

                        <a
                            href="/Resume - Eliachar Feig.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="cv-download-link btn btn-link text-info px-0 text-decoration-none fw-bold mt-4"
                        >
                            Download Full CV <i className="fas fa-arrow-right ms-2" />
                        </a>
                    </div>

                    {/* Right column */}
                    <div className="col-lg-5 offset-lg-1 about-right d-flex justify-content-center">
                        <div className="profile-img-container">
                            <Image
                                src="/assets/images/profile.JPG"
                                alt="Eliachar Feig"
                                width={700}
                                height={700}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


// export default function About() {
//     return (
//         <section id="about" className="about-section ">
//             <AboutEffects />

//             <div className="container ">
//                 <div className="row align-items-center h-100">
//                     {/* Left column */}
//                     <div className="col-lg-6 about-left about-left-pad">
//                         <h6 className="tag mb-2">My Background</h6>

//                         <h2 className="display-5 fw-bold mb-4">
//                             Bridging Engineering, Product, and{" "}
//                             <span className="text-info">Applied AI</span>.
//                         </h2>

//                         <p className="text-secondary">
//                             I am a Senior Mobile Engineer with a strong product mindset,
//                             specialized in building scalable applications that bridge the gap
//                             between user experience and complex backends.
//                         </p>

//                         <p className="text-secondary">
//                             With 3+ years of experience in enterprise iOS & Flutter
//                             environments, I’ve expanded into full-stack ownership designing
//                             APIs and delivering features end-to-end. Recently, I’ve been
//                             focused on Applied AI, shipping production-ready LLM integrations
//                             that provide real-world value.
//                         </p>

//                         <div
//                             className="mt-4 p-3 rounded-3"
//                             style={{
//                                 background: "rgba(0, 210, 255, 0.05)",
//                                 borderLeft: "3px solid var(--accent)",
//                             }}
//                         >
//                             <p className="small mb-0 text-light fst-italic">
//                                 <strong>Current Focus:</strong> Deepening LLM Engineering to
//                                 build systems where product, engineering, and AI intersect.
//                             </p>
//                         </div>

//                         <a
//                             href="/Resume - Eliachar Feig.pdf"
//                             target="_blank"
//                             rel="noreferrer"
//                             className="cv-download-link btn btn-link text-info px-0 text-decoration-none fw-bold mt-4"
//                         >
//                             Download Full CV <i className="fas fa-arrow-right ms-2" />
//                         </a>
//                     </div>

//                     {/* Right column */}
//                     <div className="col-lg-5 offset-lg-1 about-right d-flex justify-content-center">
//                         <div className="profile-img-container">
//                             <Image
//                                 src="/assets/images/profile.JPG"
//                                 alt="Eliachar Feig"
//                                 width={700}
//                                 height={700}
//                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }
