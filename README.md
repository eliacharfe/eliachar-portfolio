# Eliachar Feig — Portfolio Website (Next.js)

Modern, animated developer portfolio built with **Next.js** and a polished UI stack:

- **GSAP** (ScrollTrigger + ScrollToPlugin) for scroll animations & smooth navigation  
- **VanillaTilt** for interactive 3D card tilt  
- **Bootstrap** (utility + layout) + custom CSS for fast, responsive styling  
- **AI Chatbot** with streaming responses (Server-Sent Events)  
- Component-based architecture with a clean, production-ready structure  

Live: **https://www.eliacharfeig.com**

---

## ✨ Highlights

- Smooth scroll navigation (GSAP ScrollToPlugin)
- Scroll progress indicator + dynamic navbar state
- Scroll-triggered section animations (GSAP ScrollTrigger)
- Tilt / glare effects on project cards (VanillaTilt)
- Responsive layout with Bootstrap grid + custom theming
- Optimized Next.js build for Vercel deployment
- AI-powered streaming chatbot with real-time responses

---

## 🤖 AI Chatbot

The portfolio includes a fully integrated AI assistant that allows visitors to ask about:

- Professional experience
- Technical architecture decisions
- Projects & production systems
- Engineering philosophy
- Applied AI integrations

### 🚀 Features

- Server-Sent Events (SSE) streaming responses
- Smooth typewriter-style flush loop (controlled character batching)
- Smart auto-scroll behavior (sticks to bottom unless user scrolls up)
- HTML-safe rendering using DOMPurify
- Dark material UI with backdrop blur
- Success / error push events with animated modal
- Production-ready `/api/chat` endpoint

### ⚙️ Technical Implementation

- Streaming via `ReadableStream` + `TextDecoder`
- Custom delta buffering system
- Controlled render batching for performance
- Graceful error handling
- Fully client-safe HTML sanitization
- Modal system triggered by backend push events (`push_success`, `push_error`)
- Scroll stickiness logic that respects user intent (no scroll hijacking)

This chatbot demonstrates real-world applied AI integration inside a modern frontend architecture.

---

## 🧱 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **GSAP** (`ScrollTrigger`, `ScrollToPlugin`)
- **VanillaTilt**
- **Bootstrap**
- **OpenAI API (Streaming via SSE)**
- Custom CSS / utility styling

---

## ✅ Requirements

- **Node.js 18+**
- npm / pnpm / yarn

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install

```

### 2. Start development server

```bash
npm run dev
```

Open your browser at:
http://localhost:3000

---

## 🏗 Build for Production

```bash
npm run build
npm run start
```

This builds the optimized production version and starts a local production server.

---

## ⚙️ Deployment (Vercel)

This project is optimized for deployment on **Vercel**.

Recommended Vercel settings:
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Node Version: 18+

Deployment flow:
1. Push changes to the `main` branch.
2. Vercel automatically builds and deploys.
3. Production deployment is instantly available on your connected domain.

---

## 🧠 Architecture Notes

- GSAP plugins are registered once using a `useRef` guard to avoid duplicate registration in React strict mode.
- VanillaTilt instances are properly destroyed in cleanup to prevent memory leaks.
- IntersectionObserver is used for animated stat counters.
- `"use client"` is applied only where needed.
- Scroll-based animations are optimized to prevent layout thrashing.
- Code is structured in reusable, isolated components for maintainability.

---

## 💼 Focus Areas Highlighted

- Senior Mobile Engineering (iOS / Swift / SwiftUI / UIKit)
- Flutter / Dart
- Product-driven engineering
- Scalable architecture & state management
- Performance, stability & reliability
- Enterprise-grade production systems

---

## 📬 Contact

Email: eliacharfeig@gmail.com  
LinkedIn: https://www.linkedin.com/in/eliachar-feig/  
GitHub: https://github.com/eliacharfe  

---

## 📝 License

Personal portfolio project. All rights reserved.


