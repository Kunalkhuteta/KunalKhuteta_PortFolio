export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
  chips: string[];
};

export const experienceLabel = "07 — Experience path";
export const experienceHeading = {
  normal: "Progress bends.",
  accent: "The craft compounds.",
};
export const experienceSubtext =
  "A curved path through the products, teams, and real-world problems that shaped how I engineer today.";
export const experienceBadge = "Intern → full-time";

export const experience: ExperienceItem[] = [
  {
    period: "Apr 2026 — Present",
    role: "Software Developer",
    company: "SoftTrade InfoTech",
    location: "Jaipur (On-site)",
    bullets: [
      "Architected and deployed production REST APIs in C# ASP.NET Core with middleware pipelines, structured error handling and API versioning across the ERP ecosystem.",
      "Implemented Redis caching for session management and high-frequency reads, reducing database load.",
      "Built event-driven workflows for real-time sync across accounting, inventory and operations modules.",
    ],
    chips: ["C#", "ASP.NET Core", "Redis", "PostgreSQL", "Event-Driven Design"],
  },
  {
    period: "Jan 2026 — Mar 2026 · 3 months",
    role: "Angular and Flutter Developer Intern",
    company: "SoftTrade InfoTech",
    location: "Jaipur",
    bullets: [
      "Engineered 50+ Angular UI modules for an Accounts ERP system, cutting load times by 40% and reducing user clicks by 30%.",
      "Learned Flutter in under 24 hours and delivered a production-ready mobile ERP app from scratch (RBAC, OAuth, secure API integration, WebSockets, real-time analytics, accounting workflows).",
    ],
    chips: ["Angular", "Flutter", "Dart", "WebSockets", "OAuth"],
  },
];
