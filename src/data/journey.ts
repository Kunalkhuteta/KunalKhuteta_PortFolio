export const journeyLabel = "02 — The journey";
export const journeyHeading = {
  normal: "From first line of code to",
  accent: "agentic systems.",
};
export const journeySubtext =
  "How I learn: pick the hardest useful thing, build it end to end, ship it.";

export type JourneyVisual =
  | "sorting"
  | "browser"
  | "dashboard"
  | "packet"
  | "graph"
  | "logs"
  | "next";

export type JourneyPhase = {
  id: string;
  tag: string;
  title: string;
  description: string;
  chips: string[];
  visual: JourneyVisual;
};

export const journeyPhases: JourneyPhase[] = [
  {
    id: "foundations",
    tag: "Aug 2023 · BCA, University of Rajasthan (CGPA 8.5)",
    title: "Foundations",
    description:
      "Data Structures & Algorithms in C, C++ and Java, with SQL — learning to think in complexity before frameworks.",
    chips: ["DSA", "C", "C++", "Java", "SQL"],
    visual: "sorting",
  },
  {
    id: "web",
    tag: "2024 – 2025 · MERN & MEAN",
    title: "Web & products",
    description:
      "Full-stack web with MongoDB, Express, React and Node — REST APIs, JWT auth. Shipped the Focus & Habit Tracker Chrome extension (Manifest V3, service worker, Google OAuth 2.0).",
    chips: ["MERN", "MEAN", "REST APIs", "JWT", "MongoDB", "Chrome Extension"],
    visual: "browser",
  },
  {
    id: "enterprise",
    tag: "Jan 2026 · SoftTrade InfoTech",
    title: "Enterprise web",
    description:
      "50+ Angular UI modules for an Accounts ERP — 40% faster loads, 30% fewer clicks. Learned Flutter in under 24 hours and shipped a production mobile ERP app.",
    chips: ["Angular", "Flutter", "Dart", "RBAC", "WebSockets"],
    visual: "dashboard",
  },
  {
    id: "backend",
    tag: "Apr 2026 · Software Developer",
    title: "Backend & systems",
    description:
      "C# ASP.NET Core APIs with middleware pipelines and versioning, Redis caching, and event-driven sync across accounting, inventory and operations.",
    chips: ["C#", "ASP.NET Core", "Redis", "PostgreSQL", "Event-driven"],
    visual: "packet",
  },
  {
    id: "genai",
    tag: "2026 · AI Workflow Automation Platform",
    title: "GenAI & agentic AI",
    description:
      "A Zapier/n8n-style builder with a FastAPI execution engine running 19+ tools — LLM and vision AI, HTTP, databases, email, Slack and more.",
    chips: ["Python", "FastAPI", "GenAI", "Agentic AI", "React Flow", "LLM"],
    visual: "graph",
  },
  {
    id: "infra",
    tag: "2026 · Observability Platform",
    title: "Developer infrastructure",
    description:
      "Mini-Datadog: a Python + eBPF agent streaming into Redis Streams, InfluxDB metrics, anomaly detection and alerting, on Kubernetes.",
    chips: ["eBPF", "Redis Streams", "InfluxDB", "Anomaly detection", "Kubernetes"],
    visual: "logs",
  },
  {
    id: "next",
    tag: "Aug 2026 · MCA, University of Rajasthan (2026 – 2028)",
    title: "What's next",
    description:
      "Going deeper on distributed systems, GenAI and agentic architectures — while shipping production software at SoftTrade InfoTech.",
    chips: ["Distributed systems", "GenAI", "Agentic AI"],
    visual: "next",
  },
];
