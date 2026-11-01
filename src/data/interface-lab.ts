export const interfaceLabLabel = "06 — Interface lab";
export const interfaceLabHeading = {
  normal: "Design that",
  accent: "moves with intent.",
};
export const interfaceLabSubtext =
  "Interaction and motion details I build into real products.";

export type LabDemoId =
  | "tilt"
  | "magnetic"
  | "glass"
  | "scramble"
  | "counter"
  | "reorder"
  | "skeleton"
  | "bars"
  | "phone"
  | "theme";

export type LabDemo = {
  id: LabDemoId;
  title: string;
  technique: string;
  /** Bento span classes on lg. */
  span: string;
};

export const labDemos: LabDemo[] = [
  { id: "tilt", title: "3D tilt + glare", technique: "GSAP · pointer", span: "lg:col-span-2 lg:row-span-2" },
  { id: "magnetic", title: "Magnetic button", technique: "GSAP · quickTo", span: "" },
  { id: "glass", title: "Glass over moving gradient", technique: "CSS", span: "" },
  { id: "scramble", title: "Text scramble", technique: "JS interval", span: "" },
  { id: "counter", title: "Number counter", technique: "GSAP", span: "" },
  { id: "reorder", title: "Drag to reorder", technique: "Framer Motion", span: "lg:row-span-2" },
  { id: "skeleton", title: "Skeleton & shimmer", technique: "CSS", span: "" },
  { id: "bars", title: "Racing bars", technique: "CSS", span: "lg:col-span-2" },
  { id: "phone", title: "Flutter screen transition", technique: "Framer Motion", span: "" },
  { id: "theme", title: "Theme morph", technique: "Framer Motion", span: "" },
];
