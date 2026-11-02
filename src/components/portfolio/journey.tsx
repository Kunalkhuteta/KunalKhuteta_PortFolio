import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { journeyHeading, journeyLabel, journeyPhases, journeySubtext } from "@/data/journey";
import type { JourneyPhase, JourneyVisual } from "@/data/journey";
import { useInView } from "@/hooks/use-in-view";
import { SectionHeader } from "./section-header";

/* ------------------------------------------------------------------ */
/* Mini live visuals — each runs a lightweight interval while active   */
/* and fully stops when inactive or off-screen.                        */
/* ------------------------------------------------------------------ */

function SortingVisual({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const N = 16;
    let arr = Array.from({ length: N }, () => 18 + Math.random() * 80);
    let i = 0;
    let j = 0;
    let hi = -1;
    let hj = -1;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const bw = W / N;
      arr.forEach((v, k) => {
        ctx.fillStyle =
          k === hi || k === hj ? "oklch(0.92 0.23 128)" : "oklch(0.75 0.1 128 / 0.55)";
        ctx.fillRect(k * bw + 1.5, H - v, bw - 3, v);
      });
    };

    const id = window.setInterval(() => {
      if (i >= N - 1) {
        arr = Array.from({ length: N }, () => 18 + Math.random() * 80);
        i = 0;
        j = 0;
        return;
      }
      if (j >= N - 1 - i) {
        i += 1;
        j = 0;
        return;
      }
      hi = j;
      hj = j + 1;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
      j += 1;
      draw();
    }, 110);

    draw();
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <canvas
      ref={ref}
      width={560}
      height={170}
      aria-hidden="true"
      className="h-32 w-full sm:h-40"
    />
  );
}

function BrowserVisual({ active }: { active: boolean }) {
  const ref = useRef<SVGPolylineElement>(null);
  const [bars, setBars] = useState([30, 55, 40, 70]);

  useEffect(() => {
    if (!active) return;
    let points = 2;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const total = 10;
      points = points >= total ? 2 : points + 1;
      const pts = Array.from({ length: points }, (_, k) => {
        const x = 20 + (k * 260) / (total - 1);
        const y = 78 - (18 + Math.sin(k * 1.1) * 14 + k * 4);
        return `${x},${y}`;
      }).join(" ");
      if (ref.current) ref.current.setAttribute("points", pts);
      if (frame % 3 === 0) {
        setBars([b => b, [30, 55, 40, 70]].length ? Array.from({ length: 4 }, () => 24 + Math.random() * 66) : []);
      }
    }, 260);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-border bg-background/60">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-violet/60" />
        <span className="h-2 w-2 rounded-full bg-cyan/60" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-surface-raised" />
      </div>
      <div className="flex items-end gap-4 p-3">
        <div className="flex h-24 flex-1 items-end gap-1.5">
          {bars.map((b, k) => (
            <span
              key={k}
              className="w-full rounded-t bg-accent/70 transition-all duration-300"
              style={{ height: `${b}%`, transitionDelay: `${k * 40}ms` }}
            />
          ))}
        </div>
        <svg viewBox="0 0 300 90" className="h-24 w-1/2" fill="none">
          <polyline
            ref={ref}
            points="20,78 280,30"
            stroke="oklch(0.795 0.125 211)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function DashboardVisual({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 12), 480);
    return () => window.clearInterval(id);
  }, [active]);

  const tiles = [0, 1, 2, 3, 4, 5];
  const rows = ["Accounts ledger", "Inventory sync", "Invoice #2231", "Payroll batch"];

  return (
    <div aria-hidden="true" className="flex gap-3">
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {tiles.map((t) => (
          <span
            key={t}
            className={`h-10 rounded-md border transition-all duration-300 sm:h-12 ${
              step % 6 === t
                ? "border-accent/70 bg-accent/15 shadow-[0_0_14px_-4px_oklch(0.92_0.23_128/0.7)]"
                : "border-border bg-surface-raised"
            }`}
          />
        ))}
        <span className="col-span-3 flex h-10 items-end gap-1 rounded-md border border-border bg-surface-raised px-2 pb-1.5 sm:h-12">
          {[40, 65, 50, 80, 60, 90, 72].map((h, k) => (
            <span
              key={k}
              className="w-full rounded-t bg-violet/60 transition-all duration-300"
              style={{ height: `${(h + (step % 4) * 4) % 100}%` }}
            />
          ))}
        </span>
      </div>
      <div className="w-24 shrink-0 rounded-[1.1rem] border border-border bg-background/80 p-1.5 sm:w-28">
        <span className="mx-auto mb-1.5 block h-1 w-8 rounded-full bg-surface-raised" />
        <ul className="space-y-1">
          {rows.map((r, k) => (
            <li
              key={r}
              className={`truncate rounded bg-surface-raised px-1.5 py-1 font-mono text-[7px] text-foreground/80 transition-all duration-300 ${
                k <= step % 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
              }`}
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PacketVisual({ active }: { active: boolean }) {
  const hops = ["Request", "Middleware", "Redis", "PostgreSQL"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setIdx((s) => (s + 1) % (hops.length + 1)), 640);
    return () => window.clearInterval(id);
  }, [active, hops.length]);

  return (
    <div aria-hidden="true" className="relative pt-6">
      <div className="absolute inset-x-6 top-[1.65rem] h-px bg-border" />
      <span
        className="absolute top-[1.35rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_2px_oklch(0.92_0.23_128/0.8)] transition-[left] duration-500 ease-in-out"
        style={{ left: `${8 + Math.min(idx, 3) * 28}%` }}
      />
      <div className="relative flex justify-between">
        {hops.map((h, k) => (
          <span
            key={h}
            className={`w-[26%] rounded-lg border px-2 py-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] transition-colors duration-300 sm:text-[10px] ${
              k <= idx ? "border-accent/60 bg-accent/10 text-accent" : "border-border bg-surface-raised text-muted-foreground"
            }`}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

function GraphVisual({ active }: { active: boolean }) {
  const nodes = [
    { id: "t", label: "Trigger", x: 40, y: 70 },
    { id: "l", label: "LLM", x: 150, y: 30 },
    { id: "c", label: "If/Else", x: 260, y: 70 },
    { id: "s", label: "Sheets", x: 380, y: 30 },
    { id: "o", label: "Output", x: 380, y: 110 },
  ];
  const order = ["t", "l", "c", "s", "o"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setIdx((s) => (s + 1) % (order.length + 1)), 560);
    return () => window.clearInterval(id);
  }, [active, order.length]);

  const lit = (id: string) => order.indexOf(id) < idx;

  return (
    <svg viewBox="0 0 440 150" aria-hidden="true" className="h-36 w-full sm:h-40" fill="none">
      {[
        ["t", "l"], ["l", "c"], ["c", "s"], ["c", "o"],
      ].map(([a, b]) => {
        const na = nodes.find((n) => n.id === a)!;
        const nb = nodes.find((n) => n.id === b)!;
        const on = lit(a) && lit(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x + 30}
            y1={na.y + 12}
            x2={nb.x - 6}
            y2={nb.y + 12}
            stroke={on ? "oklch(0.92 0.23 128 / 0.85)" : "oklch(1 0 0 / 0.12)"}
            strokeWidth={on ? 2 : 1.5}
            className="transition-all duration-300"
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} className="transition-all duration-300">
          <rect
            x={n.x - 6}
            y={n.y}
            width={36 * 2}
            height={24}
            rx={8}
            fill={lit(n.id) ? "oklch(0.92 0.23 128 / 0.16)" : "oklch(1 0 0 / 0.05)"}
            stroke={lit(n.id) ? "oklch(0.92 0.23 128 / 0.8)" : "oklch(1 0 0 / 0.14)"}
          />
          <text
            x={n.x + 30}
            y={n.y + 16}
            textAnchor="middle"
            className="font-mono"
            fontSize="9"
            fill={lit(n.id) ? "oklch(0.92 0.23 128)" : "oklch(1 0 0 / 0.5)"}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

const LOG_LINES = [
  "agent: eBPF events attached",
  "stream: 1.2M events/min",
  "query: p95 latency 41ms",
  "anomaly: spike detected on host-07",
  "alert: PagerDuty notified",
];

function LogsVisual({ active }: { active: boolean }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setShown((s) => (s + 1) % (LOG_LINES.length + 2)), 620);
    return () => window.clearInterval(id);
  }, [active]);

  const anomaly = shown >= 4;

  return (
    <div aria-hidden="true" className="relative flex gap-3">
      <div className="h-36 flex-1 overflow-hidden rounded-xl border border-border bg-background/70 p-3 font-mono text-[10px] leading-5 sm:text-[11px]">
        {LOG_LINES.slice(0, shown).map((l, k) => (
          <p key={l} className={l.startsWith("anomaly") ? "text-violet" : l.startsWith("alert") ? "text-accent" : "text-foreground/70"}>
            {l}
          </p>
        ))}
        {shown >= LOG_LINES.length + 1 ? (
          <p className="text-foreground/40">…streaming</p>
        ) : null}
      </div>
      <div className="w-24 sm:w-28">
        <svg viewBox="0 0 100 60" className="h-20 w-full" fill="none">
          <polyline
            points="0,40 15,38 30,42 45,36 60,39 70,12 80,44 100,38"
            stroke="oklch(0.795 0.125 211)"
            strokeWidth="2"
          />
          <circle cx="70" cy="12" r="3" fill={anomaly ? "oklch(0.92 0.23 128)" : "oklch(0.795 0.125 211)"} />
        </svg>
        <span
          className={`mt-2 inline-flex rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] transition-all duration-300 ${
            anomaly ? "border-accent/70 bg-accent/10 text-accent" : "border-border text-muted-foreground opacity-50"
          }`}
        >
          ⚠ alert
        </span>
      </div>
    </div>
  );
}

function NextVisual({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="flex h-36 items-center justify-center sm:h-40">
      <span className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 ${active ? "pulse-ring" : ""}`}>
        <span className="font-display text-sm font-bold text-accent">next →</span>
      </span>
    </div>
  );
}

function PhaseVisual({ kind, active }: { kind: JourneyVisual; active: boolean }) {
  switch (kind) {
    case "sorting":
      return <SortingVisual active={active} />;
    case "browser":
      return <BrowserVisual active={active} />;
    case "dashboard":
      return <DashboardVisual active={active} />;
    case "packet":
      return <PacketVisual active={active} />;
    case "graph":
      return <GraphVisual active={active} />;
    case "logs":
      return <LogsVisual active={active} />;
    case "next":
      return <NextVisual active={active} />;
  }
}

/* ------------------------------------------------------------------ */
/* Phase card                                                          */
/* ------------------------------------------------------------------ */

function PhaseCard({ phase, index, active }: { phase: JourneyPhase; index: number; active: boolean }) {
  return (
    <article
      className={`glass-card rounded-3xl p-6 transition-all duration-500 sm:p-8 ${
        active
          ? "border-accent/40 shadow-[0_0_60px_-30px_oklch(0.92_0.23_128/0.7)]"
          : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          {phase.tag}
        </p>
        <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(journeyPhases.length).padStart(2, "0")}
        </p>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{phase.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {phase.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {phase.chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-3 sm:p-4">
        <PhaseVisual kind={phase.visual} active={active} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Section: pinned scroll-driven timeline (desktop), stacked (mobile)  */
/* ------------------------------------------------------------------ */

export function Journey() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const { ref: sectionRef, inView } = useInView<HTMLElement>(0, false);

  useEffect(() => {
    const canPin =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 1024px)").matches;
    setPinned(canPin);
    if (!canPin) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const n = journeyPhases.length;
      setActive(Math.min(n - 1, Math.floor(p * n)));
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
      if (orbRef.current) orbRef.current.style.top = `${p * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`relative scroll-mt-24 ${inView ? "" : "anim-paused"}`}
    >
      {/* Desktop: pinned stage */}
      <div ref={wrapperRef} className={`hidden lg:block ${pinned ? "h-[700vh]" : ""}`}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 py-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                label={journeyLabel}
                normal={journeyHeading.normal}
                accent={journeyHeading.accent}
                subtext={journeySubtext}
              />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Phase{" "}
                <span className="text-accent">
                  {String(active + 1).padStart(2, "0")}
                </span>{" "}
                / {String(journeyPhases.length).padStart(2, "0")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-[auto_1fr] items-start gap-10">
              {/* Rail */}
              <div className="relative h-[52vh] w-6" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />
                <div
                  ref={lineRef}
                  className="absolute left-1/2 top-0 h-full w-[2.5px] origin-top -translate-x-1/2 bg-accent shadow-[0_0_12px_oklch(0.92_0.23_128/0.8)]"
                  style={{ transform: "scaleY(0)" }}
                />
                {journeyPhases.map((_, i) => (
                  <span
                    key={i}
                    className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-300 ${
                      i <= active ? "border-accent bg-accent" : "border-border bg-background"
                    }`}
                    style={{ top: `${(i / (journeyPhases.length - 1)) * 100}%` }}
                  />
                ))}
                <div
                  ref={orbRef}
                  className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_20px_4px_oklch(0.92_0.23_128/0.7)]"
                  style={{ top: "0%" }}
                />
              </div>

              {/* Active card */}
              <div className="relative min-h-[46vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={journeyPhases[active].id}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mx-auto max-w-3xl"
                  >
                    <PhaseCard
                      phase={journeyPhases[active]}
                      index={active}
                      active
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / reduced motion: stacked cards, self-activating */}
      <div className="px-4 py-24 sm:px-6 lg:hidden">
        <SectionHeader
          label={journeyLabel}
          normal={journeyHeading.normal}
          accent={journeyHeading.accent}
          subtext={journeySubtext}
        />
        <ol className="relative mt-14 space-y-10 border-l border-border pl-6">
          {journeyPhases.map((phase, i) => (
            <StackedPhase key={phase.id} phase={phase} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StackedPhase({ phase, index }: { phase: JourneyPhase; index: number }) {
  const { ref, inView: active } = useInView<HTMLLIElement>(0.4, false);
  return (
    <li ref={ref} className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-[1.9rem] top-6 h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
          active ? "border-accent bg-accent shadow-[0_0_12px_oklch(0.92_0.23_128/0.8)]" : "border-border bg-background"
        }`}
      />
      <PhaseCard phase={phase} index={index} active={active} />
    </li>
  );
}
