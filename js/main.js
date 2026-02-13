
if (typeof emailjs !== 'undefined') {
    emailjs.init("Bij16jxDtPVGqdApO");
}

if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== "undefined") gsap.registerPlugin(ScrollToPlugin);
}


document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("is-loading", "is-preload");
});
window.addEventListener("load", () => {
    document.body.classList.remove("is-loading", "is-preload");
});

function stopVideo() {
    const iframe = document.getElementById("videoIframe");
    if (iframe) iframe.src = "";
}

// ---------- Data ----------
const PROJECTS = {
    innerorbit: {
        title: "InnerOrbit",
        subtitle: "AI-Powered Personal Insight Platform",
        problem: "People struggle to turn abstract self-development concepts into actionable, personalized insights. I introduce it through some fun games, reading times or even with friends and family in multiplayer mode",
        solution: "Built a full-stack mobile app that turns user inputs into personalized insights using LLM-based analysis and scalable cloud infrastructure.",
        role: ["Product & UX direction", "Flutter architecture", "Firebase backend + cloud integration", "LLM integration & prompt design", "End-to-end shipping & iteration"],
        stack: ["Flutter", "Firebase", "Cloud Functions", "LLM APIs", "REST"],
        impact: ["Shipped as a real product", "Built for fast experimentation + iteration", "Scalable structure for future AI features"],
        github: null,
        videoId: "mvGmHXw_TGo"
    },
    assemble: {
        title: "Assemble Z' Army",
        subtitle: "Real-Time Multiplayer Strategy Game",
        problem: "Most strategy games in the genre (RTS) are highly complex and require long playtime to understand, making them accessible mainly to experienced players. There is a lack of real-time strategy games that develop long-term strategic thinking while remaining intuitive, approachable, and easy to learn for a broader audience.",
        solution: "Developed a Unity RTS with real-time networking and synchronized gameplay using the Mirror library.\nCoded in C#.",
        role: ["Gameplay systems implementation", "Networking integration", "Performance tuning for multiplayer", "Design a nice UI/UX"],
        stack: ["Unity", "C#", "Mirror"],
        impact: ["Stable multiplayer state sync", "Clear architecture for gameplay systems"],
        github: "https://github.com/eliacharfe/Assemble-Z-Army.git",
        videoId: "kyKP4AfDlYs"
    },
    bookstore: {
        title: "Spring Book Store",
        subtitle: "Secure E-Commerce Web Platform",
        problem: "Need a secure and maintainable e-commerce backend with authentication, authorization, and data integrity.",
        solution: "Implemented a full-stack bookstore with secure backend services, transactional flows, and database modeling.",
        role: ["Backend architecture", "Security & auth logic", "API design & database modeling"],
        stack: ["Spring Boot", "Java", "Spring Security", "MySQL", "JavaScript"],
        impact: ["Secure auth flows", "Structured backend suitable for expansion"],
        github: null,
        videoId: "QmwvMqvJRSU"
    },
    sonic: {
        title: "Sonic Remake",
        subtitle: "C++ Game Architecture with SFML",
        problem: "Recreating platformer mechanics while applying clean OOP principles and performance-aware design.",
        solution: "Built a modular C++ game using SFML with a clean game loop, entity abstractions, and reusable systems.",
        role: ["Engine architecture", "Game mechanics", "Performance optimization"],
        stack: ["C++", "SFML", "OOP"],
        impact: ["Cleaner modular codebase", "Optimized core loop + gameplay systems"],
        github: "https://github.com/eliacharfe/Sonic_GAME_OOP2_Project.git",
        videoId: "mfwwdH-bD9k"
    },
    houseye: {
        title: "HousEye",
        subtitle: "IoT Home Security with Raspberry Pi",
        problem: "Provide low-cost, real-time home monitoring with alerts and remote access.",
        solution: "Built an IoT system with Raspberry Pi camera input, OpenCV processing, and Firebase-based remote connectivity.",
        role: ["Backend + integrations", "Computer vision pipeline", "Cloud database + messaging"],
        stack: ["Python", "OpenCV", "Flask", "Firebase", "Raspberry Pi"],
        impact: ["Real-time monitoring pipeline", "Cloud-connected alerts and access"],
        github: "https://github.com/eliacharfe/HousEye.git",
        videoId: "vXjOUxHrgU0"
    },
    mobileye: {
        title: "Mobileye TFL",
        subtitle: "Traffic Light Detection & Distance Estimation",
        problem: "Detect traffic lights reliably and estimate distance from vehicle footage.",
        solution: "Implemented CV pipeline with detection + distance estimation techniques (including SFM concepts).",
        role: ["Image processing pipeline", "Model/logic integration", "Distance estimation"],
        stack: ["Python", "OpenCV", "Neural Nets", "SFM"],
        impact: ["Robust detection under varying scenes", "Efficient processing pipeline"],
        github: "https://github.com/eliacharfe/Mobileye-Traffic-Lights-Project.git",
        videoId: null
    },
    autocomplete: {
        title: "Google Autocomplete",
        subtitle: "Error-Tolerant Search Suggestions",
        problem: "Autocomplete must handle misspellings while staying fast under strict memory/runtime limits.",
        solution: "Built an optimized autocomplete engine with spell-tolerant matching and efficient lookup.",
        role: ["Algorithm design", "Optimization for memory/runtime", "Edge-case handling"],
        stack: ["Python", "Algorithms", "Data Structures"],
        impact: ["Fast suggestions", "Reliable tolerance to user typos"],
        github: "https://github.com/ExcellentTeam22/google-project-group-8",
        videoId: null
    }
};

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
    initVideoModal();
    initMagneticButtons();
    initSwiper();
    initNavbarScroll();
    initScrollProgress();
    initVanillaTilt();
    initAOS();
    initProjectsVisibleObserver();
    initProjectDetailsModal();
    initProjectModalShimmer();
    initImpactCounters();
});

document.addEventListener('DOMContentLoaded', () => {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        gsap.to(dot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0
        });

        gsap.to(outline, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    const interactives = document.querySelectorAll('a, button, .project-card, .btn-social, .nav-link');

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-active');
            outline.classList.add('cursor-active');
            outline.classList.add('cursor-hover-state');
        });

        el.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-active');
            outline.classList.remove('cursor-active');
            outline.classList.remove('cursor-hover-state');
        });
    });

    ScrollTrigger.refresh();
});

document.addEventListener('DOMContentLoaded', () => {
    gsap.set(".hero-panel", {
        opacity: 0,
        y: 30,
        filter: "blur(20px)",
        x: 0
    });

    const tl = gsap.timeline({
        onComplete: () => {
            ScrollTrigger.refresh();
        }
    });

    tl.to(".hero-panel", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    })
        .from(".hero-panel h1", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6")
        .from(".hero-panel p, .hero-panel .d-flex", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.4");

    gsap.to(".hero-panel", {
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        },
        x: -200,
        opacity: 0,
        scale: 0.9,
        filter: "blur(10px)",
        ease: "none",
        immediateRender: false
    });
});


function initAboutAnimation() {
    const aboutTextCol = document.querySelector("#about .col-lg-6");
    const aboutImg = document.querySelector(".profile-img-container");

    if (!aboutTextCol || !aboutImg) return;

    gsap.fromTo(aboutTextCol,
        { x: -100, opacity: 0, filter: "blur(10px)" },
        {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: "#about",
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "restart reverse restart reverse"
            }
        }
    );

    gsap.fromTo(aboutImg,
        { x: 100, opacity: 0, scale: 0.8, filter: "blur(10px)" },
        {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: "#about",
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "restart reverse restart reverse"
            }
        }
    );
}

// ---------- Modules ----------
function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
        duration: 1000,
        once: false,
        mirror: false,
        anchorPlacement: "top-bottom",
        disableMutationObserver: true
    });

    // Mark that AOS is ready (so CSS fallback doesn't interfere)
    document.documentElement.classList.add("aos-ready");
}

function initVideoModal() {
    const videoModal = document.getElementById("videoModal");
    const videoIframe = document.getElementById("videoIframe");
    if (!videoModal || !videoIframe) return;

    videoModal.addEventListener("show.bs.modal", (event) => {
        const trigger = event.relatedTarget;
        const videoId = trigger?.getAttribute("data-video-id");
        if (!videoId) return;
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    });

    videoModal.addEventListener("hide.bs.modal", () => {
        videoIframe.src = "";
    });
}

function initSwiper() {
    if (typeof Swiper === "undefined") return;

    new Swiper(".projectSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

function initNavbarScroll() {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    });
}

function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = progress + "%";
    });
}

function initVanillaTilt() {
    if (typeof VanillaTilt === "undefined") return;

    VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02
    });

    VanillaTilt.init(document.querySelectorAll(".skill-box"), {
        max: 5,
        speed: 300,
        glare: true,
        "max-glare": 0.1
    });
}

function initProjectsVisibleObserver() {
    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("projects-visible", entry.isIntersecting);
            });
        },
        { threshold: 0.2, rootMargin: "-50px 0px" }
    );

    obs.observe(projectsSection);
}

function initProjectDetailsModal() {
    const projectModal = document.getElementById("projectModal");
    if (!projectModal) return;

    const titleEl = document.getElementById("projectModalTitle");
    const subtitleEl = document.getElementById("projectModalSubtitle");
    const problemEl = document.getElementById("projectModalProblem");
    const solutionEl = document.getElementById("projectModalSolution");
    const roleEl = document.getElementById("projectModalRole");
    const stackEl = document.getElementById("projectModalStack");
    const impactEl = document.getElementById("projectModalImpact");
    const githubBtn = document.getElementById("projectModalGithub");
    const watchBtn = document.getElementById("projectModalWatch");

    if (!titleEl || !subtitleEl || !problemEl || !solutionEl || !roleEl || !stackEl || !impactEl || !githubBtn || !watchBtn) return;

    projectModal.addEventListener("show.bs.modal", (event) => {
        const trigger = event.relatedTarget?.closest?.("[data-project]");
        const key = trigger?.getAttribute("data-project");
        const p = PROJECTS[key];
        if (!p) return;

        titleEl.textContent = p.title;
        subtitleEl.textContent = p.subtitle;
        problemEl.textContent = p.problem;
        solutionEl.textContent = p.solution;

        roleEl.innerHTML = p.role.map((x) => `<li>${x}</li>`).join("");
        stackEl.innerHTML = p.stack.map((x) => `<span class="stack-pill">${x}</span>`).join("");
        impactEl.innerHTML = p.impact.map((x) => `<li>${x}</li>`).join("");

        if (p.github) {
            githubBtn.href = p.github;
            githubBtn.classList.remove("d-none");
        } else {
            githubBtn.classList.add("d-none");
        }

        if (p.videoId) {
            watchBtn.classList.remove("d-none");
            watchBtn.setAttribute("data-video-id", p.videoId);
        } else {
            watchBtn.classList.add("d-none");
            watchBtn.removeAttribute("data-video-id");
        }
    });

    watchBtn.addEventListener("click", () => {
        const id = watchBtn.getAttribute("data-video-id");
        if (!id) return;

        const videoModalEl = document.getElementById("videoModal");
        if (!videoModalEl) return;

        const modal = bootstrap.Modal.getOrCreateInstance(videoModalEl);
        modal.show(watchBtn);

        const detailsModal = bootstrap.Modal.getInstance(projectModal);
        detailsModal?.hide();
    });
}

function initProjectModalShimmer() {
    const projectModalEl = document.getElementById("projectModal");
    if (!projectModalEl) return;

    projectModalEl.addEventListener("show.bs.modal", () => {
        const modalContent = projectModalEl.querySelector(".project-modal");
        if (!modalContent) return;
        modalContent.classList.remove("shimmer");
        void modalContent.offsetWidth;
        modalContent.classList.add("shimmer");
    });
}

function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-pro, .btn-social, .btn-outline-info, .btn-outline-light, button[type="submit"]');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            const strength = btn.type === 'submit' ? 0.15 : 0.3;

            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = this.querySelector('button');
    const btnText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin ms-2"></i>';

    const templateParams = {
        from_name: this.querySelector('input[placeholder="John Doe"]').value,
        reply_to: this.querySelector('input[placeholder="name@company.com"]').value,
        subject: this.querySelector('input[placeholder="How can I help?"]').value,
        message: this.querySelector('textarea').value
    };
    
    emailjs.send('service_vpz5cw9', 'template_khdk0gm', templateParams)
        .then(function() {
            // Replace your alert or simple text change with this:
            const toastEl = document.querySelector('.toast');
            const toast = new bootstrap.Toast(toastEl);
            toast.show();

            btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check ms-2"></i>';
            btn.classList.replace('btn-pro', 'btn-success');
            document.getElementById('contact-form').reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = btnText;
                btn.classList.replace('btn-success', 'btn-pro');
            }, 5000);
        }, function(error) {
            // Error State
            console.log('FAILED...', error);
            btn.disabled = false;
            btn.innerHTML = '<span>Error! Try again</span>';
        });
});

const contactBtn = document.getElementById('contactButton');

if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const dropdownElement = bootstrap.Dropdown.getOrCreateInstance(contactBtn);
        dropdownElement.toggle();

        const sections = gsap.utils.toArray(".panel");
        const targetSection = document.querySelector('#contact-slide');

        if (targetSection) {
            const index = sections.indexOf(targetSection);

            const horizontalST = ScrollTrigger.getAll().find(st => st.vars.pin === true);

            if (horizontalST) {
                const scrollPos = horizontalST.start + (index * (horizontalST.end - horizontalST.start) / (sections.length - 1));

                gsap.to(window, {
                    scrollTo: scrollPos,
                    duration: 1.5,
                    ease: "power4.inOut"
                });
            }
        }
    });
}

document.addEventListener('click', (e) => {
    const contactBtn = document.getElementById('contactButton');
    const contactMenu = document.getElementById('contactMenu');

    if (contactBtn && contactBtn.classList.contains('show')) {
        if (!contactBtn.contains(e.target) && !contactMenu.contains(e.target)) {
            const dropdown = bootstrap.Dropdown.getInstance(contactBtn);
            if (dropdown) {
                dropdown.hide();
            }
        }
    }
});

const initImpactCounters = () => {
    const observerOptions = {
        threshold: 0.5 // Start when 50% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-count'));
                const suffix = target.getAttribute('data-suffix') || "+"; // Handle % or +

                let startValue = 0;
                let duration = 2000; // Total time in ms
                let stepTime = Math.abs(Math.floor(duration / endValue));

                if (isNaN(endValue)) return;

                let counter = setInterval(() => {
                    startValue += 1;
                    target.innerText = startValue + suffix;

                    if (startValue >= endValue) {
                        target.innerText = endValue + suffix;
                        clearInterval(counter);
                    }
                }, stepTime);


                observer.unobserve(target);// Stop observing after animation runs once - remove it if want animation every time section is appear
            }
        });
    }, observerOptions);

    document.querySelectorAll('.impact-card h3').forEach(el => observer.observe(el));
};

function initWorkAnimation() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const work = document.querySelector("#work");
    if (!work) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const left   = work.querySelector(".work-left");
    const card   = work.querySelector(".work-card");
    const points = work.querySelectorAll(".work-point");
    const badges = work.querySelectorAll(".work-badge-item");
    const focus  = work.querySelector(".work-focus");

    if (!left || !card) return;

    gsap.set([left, card], { autoAlpha: 0 });
    gsap.set(left, { y: 24, filter: "blur(6px)" });
    gsap.set(card, { y: 30, scale: 0.98, filter: "blur(8px)" });

    if (focus) gsap.set(focus, { autoAlpha: 0, y: 14 });
    if (points.length) gsap.set(points, { autoAlpha: 0, y: 16 });
    if (badges.length) gsap.set(badges, { autoAlpha: 0, y: 10, scale: 0.98 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: work,
            start: "top 75%",
            toggleActions: "restart none restart none"
        }
    });

    tl.to(left, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out"
    });

    if (focus) {
        tl.to(focus, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out"
        }, "-=0.35");
    }

    if (badges.length) {
        tl.to(badges, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.06,
            ease: "power2.out"
        }, "-=0.25");
    }

    tl.to(card, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power3.out"
    }, "-=0.65");

    if (points.length) {
        tl.to(points, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out"
        }, "-=0.45");
    }

    tl.fromTo(card,
        { boxShadow: "0 18px 50px rgba(0,0,0,0.35)" },
        { boxShadow: "0 26px 70px rgba(0,210,255,0.12)", duration: 0.45, ease: "power1.out" },
        "-=0.55"
    );

    ScrollTrigger.refresh();
}

window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    if (typeof initWorkAnimation === "function") initWorkAnimation();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});

document.querySelectorAll(".project-hero").forEach((el) => {
    const hasVideo = !!el.dataset.videoId;

    if (!hasVideo) {
        el.classList.add("no-video");
        el.removeAttribute("data-bs-toggle");
        el.removeAttribute("data-bs-target");
    }
});
