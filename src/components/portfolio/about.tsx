import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about } from "@/data/about";
import { Section, SectionHeader } from "./section-header";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;

      // Stat counters count up from 0 when scrolled into view.
      rootRef.current?.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset["value"] ?? "0");
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 1.6,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <Section id="about">
        <SectionHeader
          label={about.label}
          normal={about.headingNormal}
          accent={about.headingAccent}
        />

        <div className="mt-14 max-w-4xl">
          <p className="text-lg leading-relaxed text-foreground/90">
            {about.paragraph}
          </p>

          <dl className="mt-10 flex flex-wrap gap-10">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-2 font-display text-xl font-bold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {/* Stat counters */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="bg-surface p-6">
                <p className="font-display text-4xl font-bold text-accent sm:text-5xl">
                  <span className="stat-value tabular-nums" data-value={stat.value}>
                    {stat.value}
                  </span>
                  <span>{stat.suffix}</span>
                </p>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.education.map((edu) => (
              <div
                key={edu.degree}
                className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
              >
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {edu.period}
                </p>
                <p className="mt-3 font-display text-2xl font-bold">{edu.degree}</p>
                <p className="mt-1 text-sm text-muted-foreground">{edu.school}</p>
                {"detail" in edu && edu.detail ? (
                  <p className="mt-2 font-mono text-xs text-foreground/80">{edu.detail}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
