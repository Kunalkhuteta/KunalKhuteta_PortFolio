# Kunal Khuteta — Full Stack AI Developer Portfolio

An interactive, dark award-style engineering portfolio built with **TanStack Start**, **React 19**, **Nitro SSR**, **Tailwind CSS v4 (OKLCH)**, **GSAP**, **Framer Motion**, **React Flow**, and **Matter.js**.

---

## ✨ Key Features

- **Generative Hero & Neural Canvas**: Cursor-reactive proximity neural network canvas, aurora gradient mesh, magnetic primary CTA, and split-letter GSAP reveal.
- **Interactive Career Journey**: 7-phase pinned scroll-driven timeline on desktop (stacked on mobile) with live real-time mini visualizers (Sorting, Browser metrics, ERP Dashboard, Packet Hops, LLM Graph, eBPF Logs).
- **Selected Work Showcase**: Sticky-stacked project cards with dynamic OKLCH tint gradients and metric highlights.
- **Live Autonomous AI Agent Lab (`#lab`)**: Interactive React Flow node graph + real-time terminal execution logs + server action (`dispatchResumeAction`) that packages `public/resume.pdf`, triggers a direct browser download, and dispatches the PDF resume to the visitor's email inbox via **Resend API** or **Gmail / Custom SMTP**.
- **Interactive Physics Toolchain (`#tools`)**: 2D physics playground powered by `matter-js` where visitors can drag, throw, and collide tech stack chips.
- **Terminal Contact Channel (`#contact`)**: Typewriter terminal UI backed by Zod validation and a server function (`submitContactAction`) that delivers inquiries straight to your inbox.

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables (Optional for live email delivery)**:
   Copy `.env.example` to `.env` and fill in either `RESEND_API_KEY` or `GMAIL_USER` + `GMAIL_APP_PASSWORD`:

   ```bash
   cp .env.example .env
   ```

   _(If left empty, both the AI Lab resume dispatcher and the Contact form run in graceful live-simulation mode with direct browser download still active!)_

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🌐 Deploying Live to Vercel

This project includes a pre-configured [`vercel.json`](./vercel.json) and automatic Nitro preset detection in [`vite.config.ts`](./vite.config.ts).

1. Push your repository to **GitHub** (keep `.env` untracked — it is ignored in `.gitignore`).
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel will automatically read `vercel.json` (`NITRO_PRESET=vercel npm run build`), which outputs the Vercel Build Output API v3 bundle into `.vercel/output`.
4. Under **Environment Variables** in Vercel Project Settings, add:
   - `RESEND_API_KEY` (or `GMAIL_USER` & `GMAIL_APP_PASSWORD`)
   - `RESEND_FROM_EMAIL` (e.g. `Kunal Khuteta <onboarding@resend.dev>` or your verified domain)
5. Click **Deploy** — your SSR + Server Functions portfolio will be live immediately!

---

## 🌐 Deploying Live to Render

This project includes a pre-configured [`render.yaml`](./render.yaml) Blueprint and `npm run start` script for Render Web Services.

### Option A: Using Render Blueprint (`render.yaml`)

1. Push your repository to **GitHub**.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint** and select your repository.
3. Render will automatically configure the service using `render.yaml`.

### Option B: Manual Render Web Service Setup

1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service** and connect your GitHub repository.
2. Use the following settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
3. Under **Environment Variables**, add:
   - `NODE_VERSION`: `22.16.0`
   - `NITRO_PRESET`: `node-server`
   - `RESEND_API_KEY` (optional, for live emails)
   - `GMAIL_USER` & `GMAIL_APP_PASSWORD` (optional alternative to Resend)
4. Click **Deploy Web Service**. Render will build the Nitro Node server into `.output/server/index.mjs` and launch it on Render's assigned `$PORT`.

---

## 🛠️ Scripts & Quality Checks

| Script           | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `npm run dev`    | Starts Vite dev server on `http://localhost:8080`                 |
| `npm run build`  | Builds production client & Nitro SSR server bundle                |
| `npm run start`  | Runs the production Node server (`node .output/server/index.mjs`) |
| `npm run test`   | Runs Vitest unit and routing tests                                |
| `npm run lint`   | Runs ESLint 9 checks                                              |
| `npm run format` | Formats source code with Prettier                                 |
