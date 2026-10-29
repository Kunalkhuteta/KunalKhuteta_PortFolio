import { useEffect, useRef } from "react";

/**
 * Custom cursor dot that grows over links and buttons.
 * Skipped on touch devices and when reduced motion is preferred.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let tscale = 1;
    let scale = 1;
    let shown = false;
    let raf = 0;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      const target = e.target as HTMLElement | null;
      tscale = target?.closest("a, button, input, textarea, [data-cursor]") ? 3.2 : 1;
    };

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (tscale - scale) * 0.15;
      el.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[110] h-2.5 w-2.5 rounded-full bg-accent opacity-0 mix-blend-difference transition-opacity"
    />
  );
}
