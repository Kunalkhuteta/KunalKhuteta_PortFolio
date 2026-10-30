import { useEffect, useRef, useState } from "react";
import {
  toolCategories,
  toolChips,
  toolsHeading,
  toolsHint,
  toolsLabel,
  toolsSubtext,
} from "@/data/tools";
import { Section, SectionHeader } from "./section-header";

/**
 * Physics playground: tool chips are matter-js bodies you can drag, throw
 * and collide. matter-js is browser-only, so it is dynamically imported
 * inside the effect (never at module scope — the SSR build would crash).
 */
export function Tools() {
  const areaRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | undefined;

    (async () => {
      const Matter = await import("matter-js");
      const area = areaRef.current;
      if (disposed || !area) return;

      const { Bodies, Composite, Engine, Mouse, MouseConstraint } = Matter;
      const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const world = engine.world;

      const chipEls = chipRefs.current.filter(Boolean) as HTMLButtonElement[];

      const pairs = chipEls.map((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const x = 48 + ((i * 137) % Math.max(1, area.clientWidth - 2 * w - 96)) + w / 2;
        const y = -80 - Math.random() * 420;
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.55,
          friction: 0.35,
          frictionAir: 0.02,
          chamfer: { radius: h / 2 },
        });
        return { el, body };
      });
      const bodies = pairs.map((p) => p.body);

      const makeWalls = () => {
        const W = area.clientWidth;
        const H = area.clientHeight;
        return [
          Bodies.rectangle(W / 2, H + 40, W + 240, 80, { isStatic: true }),
          Bodies.rectangle(-40, H / 2, 80, H * 3, { isStatic: true }),
          Bodies.rectangle(W + 40, H / 2, 80, H * 3, { isStatic: true }),
        ];
      };

      let walls = makeWalls();
      Composite.add(world, [...walls, ...bodies]);

      // Drag & throw
      const mouse = Mouse.create(area);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Composite.add(world, mc);

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          Composite.remove(world, walls);
          walls = makeWalls();
          Composite.add(world, walls);
          const W = area.clientWidth;
          bodies.forEach((b) => {
            if (b.position.x < 0 || b.position.x > W) {
              Matter.Body.setPosition(b, { x: W / 2, y: 40 });
            }
          });
        }, 250);
      };
      window.addEventListener("resize", onResize);

      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(now - last, 32);
        last = now;
        Engine.update(engine, dt);
        pairs.forEach(({ el, body }) => {
          el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${
            body.position.y - el.offsetHeight / 2
          }px) rotate(${body.angle}rad)`;
        });
        raf = requestAnimationFrame(tick);
      };

      setReady(true);
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        Composite.clear(world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <Section id="tools">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          label={toolsLabel}
          normal={toolsHeading.normal}
          accent={toolsHeading.accent}
          subtext={toolsSubtext}
        />
      </div>

      {reduced ? (
        /* Reduced motion: calm wrapped list instead of the simulation */
        <div className="mt-12 flex flex-wrap gap-2.5">
          {toolChips.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div
          ref={areaRef}
          className="relative mt-12 h-[380px] touch-none select-none overflow-hidden rounded-3xl border border-border bg-surface sm:h-[440px]"
          aria-label="Interactive tool chips — drag them around"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
          {toolChips.map((t, i) => (
            <button
              key={t}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              type="button"
              tabIndex={-1}
              className={`absolute left-0 top-0 cursor-grab rounded-full border border-border bg-surface-raised px-4 py-2 font-mono text-sm text-foreground shadow-lg active:cursor-grabbing ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              style={{ transition: "opacity 300ms" }}
            >
              {t}
            </button>
          ))}
          <p className="pointer-events-none absolute bottom-4 right-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {toolsHint}
          </p>
        </div>
      )}

      {/* Ordered categories for scanners / search */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {toolCategories.map((cat) => (
          <div key={cat.name}>
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {cat.name}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
