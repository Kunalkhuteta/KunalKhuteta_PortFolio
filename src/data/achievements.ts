export type Achievement = {
  counter: string;
  date: string; // TODO: replace placeholders with real dates
  organiser: string; // TODO: replace with real organiser / venue
  title: string;
  description: string;
};

export const achievementsLabel = "04 — Achievement archive";
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
    date: "[Date — replace me]",
    organiser: "[Organiser / Venue — replace me]",
    title: "GDG 15-Hour Hackathon — Winner",
    description:
      "Won among 50+ teams by shipping a working product with 10K+ lines of code in 15 hours.",
  },
  {
    counter: "02 / 02",
    date: "[Date — replace me]",
    organiser: "IPS Business College",
    title: "IPS Business College Hackathon — Winner",
    description:
      "Recognised for performance in a DSA and web development competition.",
  },
];
