/**
 * Site-wide constants. Edit names, links and copy here.
 * NOTE: email link is intentional; no phone number is shown anywhere by design.
 */
export const site = {
  name: "Kunal Khuteta",
  initials: "KK",
  role: "Full-Stack Software & Mobile Application Developer",
  location: "Jaipur, India",
  locationChip: "Jaipur, India / Remote",
  availability: "Available for select work",
  email: "kunalkhandelwal.dev@gmail.com",
  github: "https://github.com/Kunalkhuteta",
  linkedin: "https://linkedin.com/in/kunal-khandelwal",
  builtWith: "Built with React · GSAP · Framer Motion",
  copyright: "© 2026",
} as const;

export const navLinks = [
  { label: "Journey", href: "#journey" },
  { label: "Work", href: "#projects" },
  { label: "Systems", href: "#systems" },
  { label: "Lab", href: "#lab" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  smallWords: ["Engineering", "Creativity", "Performance"],
  headingLine1: "FULLSTACK",
  headingLine2: "AI DEVELOPER",
  ticker: [
    "Full-stack web",
    "Flutter mobile apps",
    "GenAI & agentic workflows",
    "Distributed systems & observability",
  ],
  subtext:
    "Full-stack software and mobile application developer building scalable applications, AI-powered automation tools and developer infrastructure — from the UI to the event stream.",
  primaryCta: "Explore work",
  primaryCtaHref: "#projects",
  secondaryCta: "Download résumé",
  secondaryCtaHref: "/resume.pdf",
  bottomLeft: "© 2026 / Portfolio",
  bottomRight: "Selected work below",
} as const;
