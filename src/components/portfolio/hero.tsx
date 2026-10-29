import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroCharacter from "@/assets/hero-character.png";
import { hero, site } from "@/data/site";
import { smoothScrollTo } from "./navbar";

function SplitLine({ text }: { text: string }) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {text.split("").map((ch, i) => (
        <span key={i} className="hero-letter inline-block will-change-transform">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.from(".hero-letter", {
        yPercent: 120,
        opacity: 0,
        duration: 0.9,
        stagger: 0.035,
        ease: "power4.out",
        delay: 0.15,
      });

      if (imgRef.current) {
        gsap.from(imgRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          delay: 0.5,
          ease: "power3.out",
        });
        gsap.to(imgRef.current, {
          y: 14,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });
      }
    }, rootRef);

    const onMove = (e: MouseEvent) => {
      if (reduced || !imgRef.current || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(imgRef.current, {
        rotateY: dx * 10,
        rotateX: -dy * 8,
        transformPerspective: 800,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      {/* Top meta row */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-24 sm:px-6 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {hero.smallWords.join("  ·  ")}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {site.locationChip}
        </p>
      </div>

      {/* Headline with character */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <h1 className="relative w-full text-center font-display font-bold uppercase leading-[0.95] tracking-tight">
          <span className="sr-only">Full Stack Developer</span>

          <span className="relative block text-[13.5vw] sm:text-[12vw] lg:text-[10vw]">
            <span className="relative z-10 flex items-center justify-center gap-[0.08em]">
              <SplitLine text="FULL" />
              <span className="inline-block w-[0.35em]" aria-hidden="true" />
              <SplitLine text="STACK" />
            </span>
          </span>
          <span className="text-outline relative -mt-[0.18em] block text-[13.5vw] sm:text-[12vw] lg:text-[10vw]">
            <SplitLine text="DEVELOPER" />
          </span>

          {/* Character stands between/over the letters */}
          <img
            ref={imgRef}
            src={heroCharacter}
            alt="Cartoon placeholder for Kunal's portrait — replace in src/assets"
            width={1024}
            height={1920}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[135%] w-auto -translate-x-1/2 -translate-y-[46%] object-contain [mask-image:linear-gradient(to_bottom,black_78%,transparent_98%)]"
          />
        </h1>

        <p className="mt-10 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
          {hero.subtext}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={hero.primaryCtaHref}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(hero.primaryCtaHref);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.03]"
          >
            {hero.primaryCta}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={hero.secondaryCtaHref}
            download
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            {hero.secondaryCta}
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pb-6 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {hero.bottomLeft}
        </p>
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {hero.bottomRight}
          <ArrowDown className="h-3.5 w-3.5 animate-bounce-soft text-accent" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
