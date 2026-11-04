import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Reorder } from "framer-motion";
import {
  interfaceLabHeading,
  interfaceLabLabel,
  interfaceLabSubtext,
  labDemos,
} from "@/data/interface-lab";
import type { LabDemo } from "@/data/interface-lab";
import { useInView } from "@/hooks/use-in-view";
import { SectionHeader } from "./section-header";

const SCRAMBLE_TARGET = "AGENTIC PIPELINE";

/* --------------------------- individual demos --------------------------- */

function TiltDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={active ? onMove : undefined}
      onMouseLeave={reset}
      onFocus={reset}
      tabIndex={0}
      role="img"
      aria-label="3D tilt card demo — move the pointer over it"
      className="relative flex h-full min-h-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-violet/25 via-surface to-cyan/15 transition-transform duration-150 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(220px at var(--gx, 50%) var(--gy, 50%), oklch(1 0 0 / 0.16), transparent 65%)",
        }}
      />
      <span className="font-display text-lg font-bold">TILT</span>
    </div>
  );
}

function MagneticDemo({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fns = useRef<{ x?: gsap.QuickToFunc; y?: gsap.QuickToFunc }>({});

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !active) return;
    fns.current.x = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
    fns.current.y = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
  }, [active]);

  const onMove = (e: React.MouseEvent) => {
    const wrap = wrapRef.current;
    const btn = btnRef.current;
    if (!wrap || !btn) return;
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 160);
    fns.current.x?.(dx * 0.4 * strength);
    fns.current.y?.(dy * 0.4 * strength);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={active ? onMove : undefined}
      onMouseLeave={() => {
        fns.current.x?.(0);
        fns.current.y?.(0);
      }}
      className="flex h-full min-h-32 items-center justify-center"
    >
      <button
        ref={btnRef}
        type="button"
        className="rounded-full bg-accent px-6 py-3 font-display text-sm font-bold text-accent-foreground will-change-transform"
      >
        Pull me
      </button>
    </div>
  );
}

function GlassDemo({ active }: { active: boolean }) {
  return (
    <div className={`relative h-full min-h-32 overflow-hidden rounded-xl ${active ? "" : "anim-paused"}`}>
      <div aria-hidden="true" className="absolute inset-0">
        <div className="aurora-blob aurora-a left-[-20%] top-[-30%] h-40 w-56 bg-violet/40" />
        <div className="aurora-blob aurora-b right-[-15%] top-[10%] h-36 w-48 bg-cyan/30" />
        <div className="aurora-blob aurora-c bottom-[-40%] left-[10%] h-40 w-52 bg-accent/30" />
      </div>
      <div className="glass-card absolute inset-4 flex items-center justify-center rounded-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/90">
          glassmorphism
        </span>
      </div>
    </div>
  );
}

function ScrambleDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [out, setOut] = useState(SCRAMBLE_TARGET);

  useEffect(() => {
    if (!active || reduced) return;
    let frame = 0;
    const chars = "ABCDEFGHKMNPQRSTUV123456789#/*+";
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2);
      setOut(
        SCRAMBLE_TARGET.split("")
          .map((c, i) =>
            c === " " || i < settled ? c : chars[Math.floor(Math.random() * chars.length)],
          )
          .join(""),
      );
      if (settled > SCRAMBLE_TARGET.length) {
        frame = 0;
        window.setTimeout(() => setOut(SCRAMBLE_TARGET), 0);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="flex h-full min-h-32 items-center justify-center px-4">
      <span className="text-center font-mono text-sm tracking-[0.2em] text-accent" aria-live="off">
        {out}
      </span>
    </div>
  );
}

function CounterDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [n, setN] = useState(reduced ? 1284 : 0);

  useEffect(() => {
    if (!active || reduced) return;
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= 1284) {
          window.clearInterval(id);
          return 1284;
        }
        return Math.min(1284, v + 37);
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center">
      <span className="font-display text-5xl font-bold tabular-nums text-accent">{n}</span>
      <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        deploys shipped
      </span>
    </div>
  );
}

const REORDER_ITEMS = ["research", "plan", "execute", "review"];

function ReorderDemo({ active }: { active: boolean }) {
  const [items, setItems] = useState(REORDER_ITEMS);

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="flex h-full min-h-32 flex-col justify-center gap-1.5 px-4 py-3">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-1.5"
        as="ul"
      >
        {items.map((item, i) => (
          <Reorder.Item
            key={item}
            value={item}
            as="li"
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-raised px-3 py-1.5 font-mono text-xs text-foreground/90"
          >
            <span>
              {i + 1}. {item}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                aria-label={`Move ${item} up`}
                onClick={() => move(i, -1)}
                className="rounded px-1 text-muted-foreground hover:text-accent"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move ${item} down`}
                onClick={() => move(i, 1)}
                className="rounded px-1 text-muted-foreground hover:text-accent"
              >
                ↓
              </button>
            </span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="flex h-full min-h-32 flex-col justify-center gap-2 px-4">
      <button
        type="button"
        onClick={() => setLoaded((v) => !v)}
        aria-pressed={loaded}
        className="w-fit rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:border-accent/60 hover:text-accent"
      >
        {loaded ? "Reset" : "Load"}
      </button>
      {loaded ? (
        <div className="space-y-1.5" aria-live="polite">
          <p className="h-3 w-4/5 rounded bg-accent/60" />
          <p className="h-3 w-3/5 rounded bg-accent/40" />
          <p className="h-3 w-2/5 rounded bg-accent/30" />
        </div>
      ) : (
        <div className="space-y-1.5" aria-hidden="true">
          <span className="block h-3 w-4/5 animate-pulse rounded bg-surface-raised" />
          <span className="block h-3 w-3/5 animate-pulse rounded bg-surface-raised" />
          <span className="block h-3 w-2/5 animate-pulse rounded bg-surface-raised" />
        </div>
      )}
    </div>
  );
}

function BarsDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [heights, setHeights] = useState([40, 65, 30, 80, 55, 70, 45]);

  useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(
      () => setHeights(Array.from({ length: 7 }, () => 20 + Math.random() * 80)),
      420,
    );
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="flex h-full min-h-32 items-end justify-center gap-2 px-6 pb-3 pt-4">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-full max-w-8 rounded-t transition-all duration-300"
          style={{
            height: `${h}%`,
            background: i % 3 === 0 ? "oklch(0.92 0.23 128 / 0.85)" : "oklch(0.585 0.21 285 / 0.55)",
          }}
        />
      ))}
    </div>
  );
}

const PHONE_SCREENS = ["Home", "Wallet", "Insights", "Profile"];

function PhoneDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(() => setScreen((s) => (s + 1) % PHONE_SCREENS.length), 2200);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="flex h-full min-h-32 items-center justify-center">
      <div className="relative h-36 w-20 overflow-hidden rounded-[1.2rem] border border-border bg-background/80 sm:h-40 sm:w-24">
        <span className="absolute left-1/2 top-1 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-surface-raised" />
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={reduced ? false : { y: "100%" }}
            animate={{ y: 0 }}
            {...(reduced ? {} : { exit: { y: "-100%" } })}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-accent/10"
          >
            <span className="font-display text-sm font-bold text-accent">
              {PHONE_SCREENS[screen] ?? ""}
            </span>
            <span className="h-1.5 w-10 rounded-full bg-accent/50" />
            <span className="h-1.5 w-6 rounded-full bg-accent/30" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ThemeDemo() {
  const [dark, setDark] = useState(true);
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3">
      <div
        className={`flex h-16 w-28 items-center justify-center rounded-xl border transition-colors duration-500 ${
          dark ? "border-border bg-background" : "border-accent/40 bg-accent/10"
        }`}
        aria-hidden="true"
      >
        <span className={`text-xl ${dark ? "text-accent" : "text-foreground/70"}`}>
          {dark ? "☾" : "☀"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDark((v) => !v)}
        aria-pressed={!dark}
        className="relative h-6 w-12 rounded-full border border-border bg-surface-raised"
        aria-label="Toggle demo theme"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full ${dark ? "left-0.5 bg-accent" : "left-6 bg-cyan"}`}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </div>
  );
}

/* ------------------------------ shell ------------------------------ */

const DEMOS: Record<
  LabDemo["id"],
  (p: { active: boolean; reduced: boolean }) => React.JSX.Element
> = {
  tilt: TiltDemo,
  magnetic: MagneticDemo,
  glass: GlassDemo,
  scramble: ScrambleDemo,
  counter: CounterDemo,
  reorder: ReorderDemo,
  skeleton: () => <SkeletonDemo />,
  bars: BarsDemo,
  phone: PhoneDemo,
  theme: () => <ThemeDemo />,
};

function LabCard({ demo, reduced }: { demo: LabDemo; reduced: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35, false);
  const [everSeen, setEverSeen] = useState(false);

  useEffect(() => {
    if (inView) setEverSeen(true);
  }, [inView]);

  const Demo = DEMOS[demo.id];

  return (
    <div
      ref={ref}
      className={`glass-card rounded-2xl p-4 ${demo.span}`}
      data-demo={demo.id}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-sm font-bold">{demo.title}</p>
        <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {demo.technique}
        </p>
      </div>
      <div className="mt-2">
        {everSeen ? (
          <Demo active={inView} reduced={reduced} />
        ) : (
          <div className="flex h-32 items-center justify-center" aria-hidden="true">
            <span className="h-8 w-8 animate-pulse rounded-full bg-surface-raised" />
          </div>
        )}
      </div>
    </div>
  );
}

export function InterfaceLab() {
  const [reduced, setReduced] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.1, false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section id="interface-lab" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div ref={ref} className={`mx-auto w-full max-w-7xl ${inView ? "" : "anim-paused"}`}>
        <SectionHeader
          label={interfaceLabLabel}
          normal={interfaceLabHeading.normal}
          accent={interfaceLabHeading.accent}
          subtext={interfaceLabSubtext}
        />
        <div className="mt-14 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {labDemos.map((d) => (
            <LabCard key={d.id} demo={d} reduced={reduced} />
          ))}
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Every demo ships in real products — and degrades gracefully to static under reduced motion.
        </p>
      </div>
    </section>
  );
}
