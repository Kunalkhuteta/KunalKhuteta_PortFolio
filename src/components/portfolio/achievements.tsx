import { Trophy } from "lucide-react";
import {
  achievements,
  achievementsHeading,
  achievementsLabel,
  achievementsSubtext,
} from "@/data/achievements";
import { Section, SectionHeader } from "./section-header";

/** Animated trophy card standing in for real photos (user will upload later). */
function TrophyVisual() {
  return (
    <div
      aria-hidden="true"
      className="trophy-sheen relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-accent/25"
      style={{
        background:
          "radial-gradient(80% 90% at 25% 15%, oklch(0.92 0.23 128 / 0.3) 0%, oklch(0.22 0.05 128) 48%, oklch(0.12 0 0) 100%)",
      }}
    >
      <Trophy className="h-14 w-14 animate-float-y text-accent drop-shadow-[0_0_20px_oklch(0.92_0.23_128/0.75)]" />
    </div>
  );
}

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader
        label={achievementsLabel}
        normal={achievementsHeading.normal}
        accent={achievementsHeading.accent}
        subtext={achievementsSubtext}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {achievements.map((a) => (
          <article
            key={a.title}
            className="rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-accent/40 sm:p-6"
          >
            <TrophyVisual />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                {a.counter}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <Trophy className="h-3 w-3" aria-hidden="true" /> Winner
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold">{a.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            {a.organiser ? (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                {a.organiser}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
