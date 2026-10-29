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
  builtWith: "Built with React + GSAP",
  copyright: "© 2026",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  smallWords: ["Engineering", "Creativity", "Performance"],
  headingLine1: "FULL STACK",
  headingLine2: "DEVELOPER",
  subtext:
    "I build scalable applications, automation tools and developer infrastructure where engineering, performance and interaction design meet.",
  primaryCta: "Explore work",
  primaryCtaHref: "#projects",
  secondaryCta: "Download résumé",
  secondaryCtaHref: "/resume.pdf",
  bottomLeft: "© 2026 / Portfolio",
  bottomRight: "Selected work below",
} as const;
