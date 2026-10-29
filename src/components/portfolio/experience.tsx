import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  experience,
  experienceBadge,
  experienceHeading,
  experienceLabel,
  experienceSubtext,
} from "@/data/experience";
import { Section, SectionHeader } from "./section-header";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      const path = rootRef.current?.querySelector<SVGPathElement>(".exp-path");
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 1,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <Section id="experience">
        <SectionHeader
          label={experienceLabel}
          normal={experienceHeading.normal}
          accent={experienceHeading.accent}
          subtext={experienceSubtext}
        />

        <div className="relative mt-20">
          {/* Curved path — draws as you scroll (desktop only) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              className="exp-path"
              d="M 50 0 C 50 12, 12 14, 12 26 C 12 38, 50 38, 50 50 C 50 62, 88 62, 88 74 C 88 86, 50 88, 50 100"
              stroke="oklch(0.92 0.23 128 / 0.55)"
              strokeWidth="0.35"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="relative space-y-16 md:space-y-24">
            {experience.map((item, i) => (
              <li
                key={item.period}
                className={`relative md:flex md:items-start md:gap-16 ${
                  i % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className="absolute left-[-5px] top-2 hidden h-3 w-3 rounded-full border-2 border-background bg-accent md:static md:block md:shrink-0"
                />
                <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-10" : "md:pl-10"}`}>
                  <div className="rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 sm:p-8">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                      {item.period}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold">{item.role}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{item.company}</span> ·{" "}
                      {item.location}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </li>
            ))}
          </ol>

          {/* Intern → full-time badge between the two nodes */}
          <div className="relative mx-auto mt-[-1.5rem] flex w-fit md:mt-[-4.5rem]">
            <span className="rounded-full border border-accent/50 bg-background px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {experienceBadge}
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}
