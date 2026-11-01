export type Achievement = {
  counter: string;
  organiser?: string; // shown only where known
  title: string;
  description: string;
};

export const achievementsLabel = "08 — Achievement archive";
export const achievementsHeading = {
  normal: "Proof of progress.",
  accent: "Moments worth keeping.",
};
export const achievementsSubtext =
  "A growing record of awards, certifications, launches, and milestones.";
export const achievementsHint = "Scroll to explore →";

export const achievements: Achievement[] = [
  {
    counter: "01 / 02",
    title: "GDG 15-Hour Hackathon — Winner",
    description:
      "Won among 50+ teams by shipping a working product with 10K+ lines of code in 15 hours.",
  },
  {
    counter: "02 / 02",
    organiser: "IPS Business College",
    title: "IPS Business College Hackathon — Winner",
    description:
      "Recognised for performance in a DSA and web development competition.",
  },
];
