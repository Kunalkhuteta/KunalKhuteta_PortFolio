import type { ReactNode } from "react";

/** Shared section header: mono label + display heading with accent phrase. */
export function SectionHeader({
  id,
  label,
  normal,
  accent,
  subtext,
  align = "left",
}: {
  id?: string;
  label: string;
  normal: string;
  accent: string;
  subtext?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
      >
        {normal}{" "}
        <em className="font-display italic text-accent">{accent}</em>
      </h2>
      {subtext ? (
        <p
          className={`mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtext}
        </p>
      ) : null}
    </div>
  );
}

/** Consistent page section wrapper. */
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
