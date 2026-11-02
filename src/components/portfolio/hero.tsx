import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

/**
 * Rotating ticker under the Engineering · Creativity · Performance line.
 */
function Ticker() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.ticker.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div
      className="relative z-10 mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 backdrop-blur-sm"
      aria-live="polite"
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-accent"
        aria-hidden="true"
      />
      <span className="relative h-5 min-w-[16rem] overflow-hidden text-center sm:min-w-[20rem]">
        <AnimatePresence mode="wait">
          <motion.span
            key={hero.ticker[index]}
            initial={reduced ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -14, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/90 sm:text-xs"
          >
            {hero.ticker[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

/**
 * Live "neural network": a capped set of drifting nodes connected by
 * proximity edges, gently attracted to the cursor. Pauses off-screen and
 * when the tab is hidden; renders one static frame under reduced motion.
 */
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };

    type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let nodes: Node[] = [];

    const seed = () => {
      const count = Math.max(24, Math.min(70, Math.floor((W * H) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.7,
        hue: Math.random() < 0.78 ? 128 : Math.random() < 0.5 ? 285 : 211,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(false);
    };

    const draw = (advance: boolean) => {
      ctx.clearRect(0, 0, W, H);
      const LINK = 120;

      if (advance) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 160 && d > 0.001) {
            n.x += (dx / d) * 0.25;
            n.y += (dy / d) * 0.25;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.32;
            ctx.strokeStyle =
              a.hue === 128 && b.hue === 128
                ? `oklch(0.92 0.23 128 / ${alpha})`
                : `oklch(0.7 0.12 ${(a.hue + b.hue) / 2} / ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `oklch(0.85 0.18 ${n.hue} / 0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      draw(true);
      raf = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { threshold: 0.02 },
    );
    io.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      io.disconnect();
      stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.from(".hero-letter", {
        yPercent: 120,
        opacity: 0,
        duration: 0.9,
        stagger: 0.03,
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

    // Magnetic primary button: leans toward the cursor, springs back on leave.
    let xTo: gsap.QuickToFunc | undefined;
    let yTo: gsap.QuickToFunc | undefined;
    let leaveX: gsap.QuickToFunc | undefined;
    let leaveY: gsap.QuickToFunc | undefined;
    const onMove = (e: MouseEvent) => {
      const el = ctaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - dist / 200);
      xTo?.(dx * 0.32 * strength);
      yTo?.(dy * 0.32 * strength);
      if (strength === 0) {
        leaveX?.(0);
        leaveY?.(0);
      }
    };
    if (!reduced && ctaRef.current) {
      xTo = gsap.quickTo(ctaRef.current, "x", { duration: 0.5, ease: "power3.out" });
      yTo = gsap.quickTo(ctaRef.current, "y", { duration: 0.5, ease: "power3.out" });
      leaveX = gsap.quickTo(ctaRef.current, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
      leaveY = gsap.quickTo(ctaRef.current, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    // Soft cursor spotlight.
    let raf = 0;
    let mx = 50;
    let my = 40;
    const onSpot = (e: MouseEvent) => {
      const el = spotlightRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 100;
      my = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--mx", `${mx}%`);
          el.style.setProperty("--my", `${my}%`);
        });
      }
    };
    if (!reduced) window.addEventListener("mousemove", onSpot, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onSpot);
      if (raf) window.cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* Aurora gradient mesh */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-blob aurora-a left-[-10%] top-[-15%] h-[560px] w-[720px] bg-accent/14" />
        <div className="aurora-blob aurora-b right-[-14%] top-[8%] h-[520px] w-[620px] bg-violet/16" />
        <div className="aurora-blob aurora-c bottom-[-18%] left-[22%] h-[500px] w-[680px] bg-cyan/10" />
        <div className="absolute inset-0 bg-grid opacity-50" />
      </div>

      {/* Neural network canvas */}
      <NeuralCanvas />

      {/* Cursor spotlight */}
      <div ref={spotlightRef} aria-hidden="true" className="hero-spotlight pointer-events-none absolute inset-0" />

      {/* Top meta row */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-24 sm:px-6 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {hero.smallWords.join("  ·  ")}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {site.locationChip}
        </p>
      </div>

      <Ticker />

      {/* Headline with character */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <h1 className="relative w-full text-center font-display font-bold uppercase leading-[0.95] tracking-tight">
          <span className="sr-only">Full Stack AI Developer</span>

          <span className="relative block text-[13.5vw] sm:text-[12vw] lg:text-[10vw]">
            <SplitLine text={hero.headingLine1} />
          </span>
          <span className="text-outline relative -mt-[0.08em] block text-[13.5vw] sm:text-[12vw] lg:text-[10vw]">
            <SplitLine text={hero.headingLine2} />
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
            ref={ctaRef}
            href={hero.primaryCtaHref}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(hero.primaryCtaHref);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[0_0_36px_-8px_oklch(0.92_0.23_128/0.6)] transition-transform will-change-transform hover:scale-[1.03]"
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
