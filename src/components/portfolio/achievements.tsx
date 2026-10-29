import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImagePlus } from "lucide-react";
import {
  achievements,
  achievementsHeading,
  achievementsHint,
  achievementsLabel,
  achievementsSubtext,
} from "@/data/achievements";
import { SectionHeader } from "./section-header";

gsap.registerPlugin(ScrollTrigger);

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface"
      style={{
        background:
          "radial-gradient(80% 80% at 30% 20%, oklch(0.3 0.03 128) 0%, oklch(0.13 0 0) 70%)",
      }}
    >
      <ImagePlus className="h-8 w-8 text-accent/60" />
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
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
            {achievements.map((a, i) => (
              <article
                key={a.title}
                className="w-[82vw] shrink-0 snap-center rounded-3xl border border-border bg-surface p-5 sm:w-[26rem] md:w-[30rem]"
              >
                <PhotoPlaceholder label={`Photo ${i + 1} — add yours`} />
                <p className="mt-5 font-mono text-xs tracking-[0.3em] text-muted-foreground">
                  {a.counter}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  {a.date} · {a.organiser}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
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
