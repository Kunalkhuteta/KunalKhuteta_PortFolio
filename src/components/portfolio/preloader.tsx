import { useEffect, useState } from "react";

/**
 * Loading screen: counts 0 → 100, then the curtain lifts.
 * Renders nothing once the reveal finishes so the page is fully interactive.
 */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 250 : 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), reduced ? 100 : 400);
        window.setTimeout(() => setGone(true), reduced ? 400 : 1400);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[120] flex items-end justify-between bg-background p-6 transition-transform duration-[800ms] ease-[cubic-bezier(0.83,0,0.17,1)] sm:p-10 ${
        done ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <span className="relative font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Kunal Khuteta — Portfolio
      </span>
      <span className="relative font-display text-6xl font-bold tabular-nums text-accent sm:text-8xl">
        {count}
      </span>
    </div>
  );
}
