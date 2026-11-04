import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy } from "lucide-react";
import {
  achievements,
  achievementsHeading,
  achievementsHint,
  achievementsLabel,
  achievementsSubtext,
} from "@/data/achievements";
import { SectionHeader } from "./section-header";

gsap.registerPlugin(ScrollTrigger);

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
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !isDesktop) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 md:min-h-screen md:flex md:flex-col md:justify-center">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHeader
            label={achievementsLabel}
            normal={achievementsHeading.normal}
            accent={achievementsHeading.accent}
            subtext={achievementsSubtext}
          />
        </div>

        {/* Horizontal gallery: pinned + scrubbed on desktop, native swipe elsewhere */}
        <div className="mt-14">
          <div
            ref={trackRef}
            className="flex snap-x gap-6 overflow-x-auto pb-4 md:overflow-visible md:px-[max(1.5rem,calc((100vw-80rem)/2))]"
          >
            {achievements.map((a) => (
              <article
                key={a.title}
                className="w-[82vw] shrink-0 snap-center rounded-3xl border border-border bg-surface p-5 sm:w-[26rem] md:w-[30rem]"
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
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
                {a.organiser ? (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                    {a.organiser}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <p className="mt-6 hidden text-right font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:block">
            {achievementsHint}
          </p>
        </div>
      </div>
    </div>
  );
}
