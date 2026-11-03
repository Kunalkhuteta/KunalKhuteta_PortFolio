import { lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  agentSteps,
  aiLabDemoNote,
  aiLabHeading,
  aiLabLabel,
  aiLabSubtext,
  runLogLines,
  workflowNodes,
} from "@/data/ai-lab";
import { useInView } from "@/hooks/use-in-view";
import { SectionHeader } from "./section-header";

const WorkflowFlow = lazy(() =>
  import("./ai-lab-flow").then((m) => ({ default: m.WorkflowFlow })),
);

const NODE_SCHEDULE: Array<[string, number]> = [
  ["trigger", 250],
  ["llm", 900],
  ["condition", 1300],
  ["sheets", 1700],
  ["slack", 1950],
  ["email", 2200],
  ["loop", 2700],
  ["output", 3200],
];

type DisplayedLog = { text: string; ok?: boolean; start: boolean };

export function AiLab() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, false);
  const [mounted, setMounted] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [reduced, setReduced] = useState(false);

  const [lit, setLit] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<DisplayedLog[]>([]);
  const [running, setRunning] = useState(false);
  const timeouts = useRef<number[]>([]);

  // Agent loop state
  const [stepIdx, setStepIdx] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);
  const { ref: loopRef, inView: loopInView } = useInView<HTMLDivElement>(0.3, false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setInteractive(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  // Lazy-mount the flow canvas the first time it scrolls into view.
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  const clearTimers = () => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
  };

  const run = () => {
    if (running) return;
    clearTimers();
    setRunning(true);
    setLit(new Set());
    setLogs([]);
    if (reduced) {
      setLit(new Set(workflowNodes.map((n) => n.id)));
      setLogs(runLogLines.map((l) => ({ text: l.text, ok: l.ok })));
      setRunning(false);
      return;
    }
    NODE_SCHEDULE.forEach(([id, t]) => {
      timeouts.current.push(
        window.setTimeout(() => setLit((prev) => new Set(prev).add(id)), t),
      );
    });
    let acc = 0;
    runLogLines.forEach((l) => {
      acc += l.delay;
      timeouts.current.push(
        window.setTimeout(() => setLogs((prev) => [...prev, { text: l.text, ok: l.ok }]), acc + 250),
      );
    });
    timeouts.current.push(window.setTimeout(() => setRunning(false), acc + 700));
  };

  // First run when the section enters the viewport.
  const startedRef = useRef(false);
  useEffect(() => {
    if (inView && !startedRef.current) {
      startedRef.current = true;
      run();
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Agent loop rotation
  useEffect(() => {
    if (!loopInView || reduced) return;
    const id = window.setInterval(() => setStepIdx((s) => (s + 1) % agentSteps.length), 1800);
    return () => window.clearInterval(id);
  }, [loopInView, reduced]);

  const step = agentSteps[stepIdx];

  return (
    <section id="lab" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div ref={ref} className={`mx-auto w-full max-w-7xl ${inView ? "" : "anim-paused"}`}>
        <SectionHeader
          label={aiLabLabel}
          normal={aiLabHeading.normal}
          accent={aiLabHeading.accent}
          subtext={aiLabSubtext}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Flow canvas */}
          <div className="glass-card rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {aiLabDemoNote}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={run}
                  disabled={running}
                  className="rounded-full bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.04] disabled:cursor-wait disabled:opacity-60"
                >
                  {running ? "Running…" : "Run workflow"}
                </button>
                <button
                  type="button"
                  onClick={run}
                  disabled={running}
                  className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-50"
                >
                  ↺ Replay
                </button>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-background/50">
              {mounted ? (
                <WorkflowFlow lit={lit} interactive={interactive} />
              ) : (
                <div className="flex h-[360px] items-center justify-center sm:h-[400px]">
                  <p className="font-mono text-xs text-muted-foreground">Loading workflow canvas…</p>
                </div>
              )}
            </div>
          </div>

          {/* Run logs terminal */}
          <div className="glass-card rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Run logs
              </p>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
                {running ? "executing" : "idle"}
              </span>
            </div>
            <div
              className="mt-3 h-[360px] overflow-y-auto rounded-2xl border border-border bg-background/70 p-4 font-mono text-xs leading-6 sm:h-[400px]"
              aria-live="polite"
            >
              {logs.length === 0 ? (
                <p className="text-muted-foreground">Press “Run workflow” to execute…</p>
              ) : (
                logs.map((l, i) => (
                  <p
                    key={`${l.text}-${i}`}
                    className={
                      l.ok ? "text-accent" : l.text.startsWith("▶") ? "text-cyan" : "text-foreground/75"
                    }
                  >
                    {l.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Agent loop */}
        <div ref={loopRef} className="glass-card mt-6 rounded-3xl p-6 sm:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72" ref={stepRef}>
              <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90" fill="none" aria-hidden="true">
                <circle cx="140" cy="140" r="108" stroke="oklch(1 0 0 / 0.1)" strokeWidth="2" />
                <circle
                  cx="140"
                  cy="140"
                  r="108"
                  stroke="oklch(0.92 0.23 128 / 0.7)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 108}
                  strokeDashoffset={2 * Math.PI * 108 * (1 - (stepIdx + 1) / agentSteps.length)}
                  className="transition-all duration-700"
                />
              </svg>
              {/* Step nodes around the ring */}
              {agentSteps.map((s, i) => {
                const angle = (i / agentSteps.length) * Math.PI * 2 - Math.PI / 2;
                const cx = 140 + Math.cos(angle) * 108;
                const cy = 140 + Math.sin(angle) * 108;
                const is = i === stepIdx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStepIdx(i)}
                    aria-pressed={is}
                    aria-label={`Agent loop step: ${s.label}`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-300 ${
                      is
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ left: `${(cx / 280) * 100}%`, top: `${(cy / 280) * 100}%` }}
                  >
                    {s.label}
                  </button>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-5xl font-bold text-accent/80">
                  {String(stepIdx + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                The agent loop · {aiLabDemoNote}
              </p>
              <motion.p
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 font-display text-2xl font-bold text-accent sm:text-3xl"
              >
                {step.label}
              </motion.p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.detail}
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Click a step, or let it rotate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
