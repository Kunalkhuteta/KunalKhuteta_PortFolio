import type { Testimonial } from "@/data/testimonials";
import { testimonialsLabel, testimonialsRowOne, testimonialsRowTwo } from "@/data/testimonials";
import { SectionHeader } from "./section-header";

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[22rem] shrink-0 rounded-3xl border border-border bg-surface p-7 sm:w-[26rem]">
      <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
        “
      </span>
      <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6">
        <p className="font-display text-base font-bold">{t.name}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {t.role}
        </p>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  // Duplicate the row so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-6 pr-6 ${reverse ? "marquee-reverse" : ""}`}
      >
        {loop.map((t, i) => (
          <QuoteCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative px-0 py-24 md:py-32">
      <div className="mx-auto mb-14 w-full max-w-7xl px-4 sm:px-6">
        <SectionHeader
          label={testimonialsLabel}
          normal="Words from people"
          accent="I've built with."
          align="center"
        />
      </div>
      <div className="space-y-6">
        <MarqueeRow items={testimonialsRowOne} />
        <MarqueeRow items={testimonialsRowTwo} reverse />
      </div>
      <p className="mx-auto mt-10 w-full max-w-7xl px-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground sm:px-6">
        Hover to pause · rows drift in opposite directions
      </p>
    </section>
  );
}
