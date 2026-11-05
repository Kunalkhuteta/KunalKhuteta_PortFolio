import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.83, 0, 0.17, 1] as const;

/** Masked reveal: label + heading slide up from behind an overflow mask. */
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
  const reduced = useReducedMotion();

  const reveal = (children: ReactNode, delay: number) =>
    reduced ? (
      <>{children}</>
    ) : (
      <motion.span
        className="block overflow-hidden pb-[0.08em]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-48px" }}
      >
        <motion.span
          className="block will-change-transform"
          variants={{
            hidden: { y: "112%" },
            show: { y: "0%" },
          }}
          transition={{ duration: 0.7, ease: EASE, delay }}
        >
          {children}
        </motion.span>
      </motion.span>
    );

  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {reveal(label, 0)}
      </p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
      >
        {reveal(
          <>
            {normal} <em className="font-display italic text-accent">{accent}</em>
          </>,
          0.08,
        )}
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
