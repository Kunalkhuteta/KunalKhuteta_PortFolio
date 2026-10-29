/**
 * Replace `live: null` with the real demo URL when available.
 * `github` currently points at the public profile — swap in per-project repos.
 */
export type Project = {
  id: string;
  code: string;
  counter: string;
  year: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  live: string | null;
  github: string | null;
  badge?: string;
  tint: number; // hue used for the generated card visual
};

export const projectsLabel = "02 — Selected work";
export const projectsHeading = {
  normal: "Built to solve.",
  accent: "Designed to stay.",
};
export const projectsSubtext =
  "Four systems. Four different problems. One consistent obsession with useful, fast and deliberate engineering.";

export const projects: Project[] = [
  {
    id: "automation",
    code: "AUT / 01",
    counter: "01 / 04",
    year: "2026",
    category: "Full-stack / Automation",
    title: "AI Workflow Automation Platform",
    tagline: "Automate the busywork.",
    description:
      "A Zapier/n8n-style platform with a drag-and-drop visual builder to create, manage and run multi-step workflows, with JWT authentication and file storage.",
    highlights: [
      "FastAPI execution engine supporting 19+ tools (LLM and vision AI, HTTP APIs, Google Sheets, databases, email, Slack, SMS, PDF/image processing, custom code)",
      "Real-time execution tracking",
      "Conditional logic, loops and data transformations",
    ],
    tech: ["React Flow", "React", "Node.js", "Express.js", "FastAPI", "MongoDB", "JWT"],
    live: null, // TODO: add live demo URL
    github: "https://github.com/Kunalkhuteta",
    tint: 128,
  },
  {
    id: "observability",
    code: "OBS / 02",
    counter: "02 / 04",
    year: "2026",
    category: "Developer infrastructure",
    title: "Observability Platform (Mini Datadog)",
    tagline: "See what your systems are really doing.",
    description:
      "A platform for real-time stream processing, unified querying and centralized debugging of distributed systems, designed for millions of events.",
    highlights: [
      "Python + eBPF monitoring agent",
      "React 18 live dashboard with log streaming",
      "Rule-based alerting engine with Slack and webhook integrations",
      "ML-based anomaly detection, distributed tracing, RBAC, multi-tenancy, query caching, and Slack/Email/PagerDuty plugins",
    ],
    tech: ["Python", "eBPF", "React 18", "Redis Streams", "InfluxDB", "PostgreSQL", "Docker", "Kubernetes"],
    live: null,
    github: "https://github.com/Kunalkhuteta",
    tint: 200,
  },
  {
    id: "extension",
    code: "EXT / 03",
    counter: "03 / 04",
    year: "2025",
    category: "Chrome extension",
    title: "Focus & Habit Tracker Extension",
    tagline: "Stay on task, see the proof.",
    description:
      "A Chrome extension whose service worker tracks active-tab domains in real time for per-site analytics, with focus timers and distraction blocking.",
    highlights: [
      "declarativeNetRequest-based blocking",
      "OTP email verification and password reset via Nodemailer",
      "Google OAuth 2.0",
      "Chart.js productivity dashboard; backend deployed on Render",
    ],
    tech: ["Manifest V3", "Node.js", "Nodemailer", "Google OAuth 2.0", "Chart.js", "Service Worker"],
    live: null,
    github: "https://github.com/Kunalkhuteta",
    tint: 38,
  },
  {
    id: "erp",
    code: "ERP / 04",
    counter: "04 / 04",
    year: "2026",
    category: "Enterprise / Mobile",
    title: "SoftTrade ERP Ecosystem",
    tagline: "Production software for real businesses.",
    description:
      "Frontend, mobile and backend work across a production ERP: Angular UI modules for the Accounts system and a Flutter mobile app, backed by ASP.NET Core APIs.",
    highlights: [
      "50+ Angular UI modules (40% faster load times, 30% fewer clicks)",
      "A production Flutter mobile ERP app built from scratch, covering RBAC, OAuth, WebSockets, real-time analytics and accounting workflows",
      "Redis caching; event-driven sync across accounting, inventory and operations",
    ],
    tech: ["Angular", "Flutter", "C#", "ASP.NET Core", "Redis", "PostgreSQL"],
    live: null,
    github: null,
    badge: "Private / client work",
    tint: 265,
  },
];
