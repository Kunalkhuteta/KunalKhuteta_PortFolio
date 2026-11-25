# Agent Guide & Repository Architecture

Welcome to the **Kunal Khuteta — Full Stack AI Developer Portfolio** codebase. This file serves as a reference manual and operational guide for AI agents and developers working on this project.

---

## 1. Project Overview & Positioning

- **Owner**: Kunal Khuteta ([kunalkhandelwal.dev@gmail.com](mailto:kunalkhandelwal.dev@gmail.com))
- **Role**: Full Stack AI Developer & Software/Mobile Engineer
- **Design Philosophy**: Dark, award-style portfolio featuring generative canvas effects, micro-interactions, interactive labs, and smooth motion.
- **Repository Integration**: Connected to [Lovable](https://lovable.dev).

---

## 2. Technology Stack

| Layer                           | Technologies                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Meta-Framework & SSR**        | [TanStack Start](https://tanstack.com/start) (`@tanstack/react-start`) with [Nitro](https://nitro.build) SSR |
| **Routing & Query**             | `@tanstack/react-router`, `@tanstack/react-query`                                                            |
| **UI Library**                  | React 19 (`react`, `react-dom`)                                                                              |
| **Build & Tooling**             | Vite 8, `@lovable.dev/vite-tanstack-config`, TypeScript 5.8                                                  |
| **Styling & Design System**     | Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, OKLCH dark palette                                  |
| **Component Primitives**        | Radix UI (`@radix-ui/react-*`), Lucide React icons, Sonner toast notifications                               |
| **Animation & Motion**          | Framer Motion v14, GSAP 3, Lenis (smooth scrolling)                                                          |
| **Interactive Canvases & Labs** | `@xyflow/react` (AI workflow node graph)                                                                     |
| **Form Handling & Validation**  | React Hook Form, Zod schema validation                                                                       |
| **Testing & Quality**           | Vitest, `@testing-library/react`, ESLint 9, Prettier                                                         |

---

## 3. Directory Layout & Responsibilities

```
├── .lovable/                 # Lovable platform integration settings
├── public/                  # Static assets (favicons, resume.pdf, manifest)
├── src/
│   ├── assets/              # Static raster graphics (hero-character, about-visual)
│   ├── components/
│   │   ├── portfolio/       # Section components (Hero, Journey, AI Lab, etc.)
│   │   └── ui/              # Radix UI primitives & design system controls
│   ├── data/                # SOURCE OF TRUTH: all site copy, projects, & timeline data
│   │   ├── about.ts         # Bio copy, highlight stats
│   │   ├── achievements.ts  # Hackathons, recognitions, trophies
│   │   ├── ai-lab.ts        # AI workflow nodes, agent steps, execution logs
│   │   ├── contact.ts       # Contact methods & form config
│   │   ├── experience.ts    # Work history and roles
│   │   ├── journey.ts       # 7-phase interactive career evolution timeline
│   │   ├── projects.ts      # Featured projects, tech tags, metrics, repository links
│   │   ├── site.ts          # Global site metadata, navigation, hero copy
│   │   └── tools.ts         # Categorized toolchain and tech stack
│   ├── hooks/               # Custom hooks (e.g. use-in-view, use-mobile)
│   ├── lib/                 # Utility helpers, SSR error boundaries, resume dispatch action
│   │   ├── dispatch-resume.ts # Autonomous resume delivery server function (Resend / SMTP)
│   ├── routes/              # TanStack file-based routes (__root.tsx, index.tsx)
│   ├── router.tsx           # Router factory and QueryClient binding
│   ├── server.ts            # Nitro SSR entry point with catastrophic error fallback
│   ├── start.ts             # TanStack Start entry point
│   ├── styles.css           # Tailwind v4 configuration, OKLCH design tokens, keyframes
│   └── test/                # Vitest test suite and routing test cases
├── AGENTS.md                # Lovable & AI Agent sync configuration
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Lovable Vite/TanStack configuration
```

---

## 4. Core Invariants & Rules for AI Agents

> [!IMPORTANT]
> **1. Lovable Sync Invariant**
> Avoid rewriting published git history (`git push --force`, rebase, or amend/squash commits already pushed). Commits pushed to `main` sync back to Lovable. Always keep the branch in a working, compilable state.

> [!IMPORTANT]
> **2. Content Separation Rule**
> Portfolio section text and copy strictly live in `src/data/*.ts`. The components in `src/components/portfolio/` read directly from that data. When updating project descriptions, metrics, timeline phases, or links, **edit `src/data/` rather than modifying the UI components**.

> [!NOTE]
> **3. Framer Motion Mask Reveal Invariant**
> Section headers use a Framer Motion mask reveal where `whileInView` observes the un-transformed mask wrapper element (`overflow-hidden`) and variants drive the inner text. Observing translated child text directly never fires its in-view check.

> [!NOTE]
> **4. Accessibility & Reduced Motion**
> Interactive animations (GSAP ticker, NeuralCanvas in Hero, and Journey visualizers) must check `useReducedMotion()` or `prefers-reduced-motion` media queries and provide a clean static fallback. Canvases must pause execution when scrolled out of view or when the document tab is inactive.

> [!NOTE]
> **5. Design System & Palette**
> Site uses Tailwind CSS v4 with OKLCH color definitions in `src/styles.css`:
>
> - Background: `oklch(0.11 0 0)` (`#070707`)
> - Surface: `oklch(0.155 0 0)` (`#0f0f0f`)
> - Surface Raised: `oklch(0.19 0 0)`
> - Accent: Acid Lime `oklch(0.92 0.23 128)` (`#C6FF3D`)
> - Glow Accents: Violet `oklch(0.585 0.21 285)` (`#7C5CFF`) & Cyan `oklch(0.795 0.125 211)` (`#22D3EE`)

---

## 5. Development & Verification Commands

| Command             | Action                                                    |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Starts Vite dev server (runs on `http://localhost:8080/`) |
| `npm run build`     | Builds full client and SSR bundle via Nitro               |
| `npm run build:dev` | Runs Vite build with development mode flags               |
| `npm run preview`   | Previews the production build locally                     |
| `npm run test`      | Runs Vitest unit and routing test suites                  |
| `npm run lint`      | Runs ESLint 9 checks                                      |
| `npm run format`    | Formats all files using Prettier                          |

---

## 6. How to Run & Launch on Browser

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server**:
   ```bash
   npm run dev
   ```
3. **Open browser**:
   ```powershell
   Start-Process "http://localhost:8080/"
   ```
   _(or visit `http://localhost:8080/` in Chrome/Edge/Firefox)_
