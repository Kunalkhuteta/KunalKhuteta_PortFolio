import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  systemChips,
  systemTabs,
  systemsDiagramNote,
  systemsHeading,
  systemsLabel,
  systemsSubtext,
} from "@/data/systems";
import type { SystemNode } from "@/data/systems";
import { useInView } from "@/hooks/use-in-view";
import { SectionHeader } from "./section-header";

const VIEW_W = 860;
const VIEW_H = 470;

function edgePath(a: SystemNode, b: SystemNode) {
  const x1 = a.x + a.w;
  const y1 = a.y + a.h / 2;
  const x2 = b.x;
  const y2 = b.y + b.h / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function Diagram({
  tabIndex,
  reduced,
}: {
  tabIndex: number;
  reduced: boolean;
}) {
  const tab = systemTabs[tabIndex];
  const [selected, setSelected] = useState(tab.nodes[0].id);
  const node = tab.nodes.find((n) => n.id === selected) ?? tab.nodes[0];

  const activate = (id: string) => setSelected(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="relative">
        <p className="absolute left-3 top-2 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {systemsDiagramNote}
        </p>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="group"
          aria-label={`${tab.name} architecture diagram — use Tab and Enter to inspect nodes`}
          className="w-full rounded-2xl border border-border bg-surface/50"
        >
          {/* Edges */}
          {tab.edges.map((e, i) => {
            const a = tab.nodes.find((n) => n.id === e.from)!;
            const b = tab.nodes.find((n) => n.id === e.to)!;
            const d = edgePath(a, b);
            const hot = selected === e.from || selected === e.to;
            return (
              <g key={`${e.from}-${e.to}-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={hot ? "oklch(0.92 0.23 128 / 0.8)" : "oklch(1 0 0 / 0.14)"}
                  strokeWidth={hot ? 2 : 1.5}
                  className="transition-[stroke] duration-300"
                />
                {e.label ? (
                  <text
                    x={(a.x + a.w + b.x) / 2}
                    y={(a.y + a.h / 2 + b.y + b.h / 2) / 2 - 6}
                    textAnchor="middle"
                    fontSize="10"
                    className="font-mono"
                    fill="oklch(1 0 0 / 0.45)"
                  >
                    {e.label}
                  </text>
                ) : null}
                {!reduced ? (
                  <circle r="3.5" fill="oklch(0.92 0.23 128 / 0.9)">
                    <animateMotion
                      dur={`${2.6 + (i % 4) * 0.45}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                ) : null}
              </g>
            );
          })}

          {/* Nodes */}
          {tab.nodes.map((n) => {
            const isSel = n.id === selected;
            return (
              <g
                key={n.id}
                tabIndex={0}
                role="button"
                aria-label={`${n.label} — what it does, why it's here, trade-off`}
                aria-pressed={isSel}
                onClick={() => activate(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    activate(n.id);
                  }
                }}
                onMouseEnter={() => activate(n.id)}
                className="cursor-pointer outline-none focus-visible:[clip-path:inset(-4px_round_12px)] [&:focus-visible_rectangle]:stroke-accent"
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx={12}
                  fill={isSel ? "oklch(0.92 0.23 128 / 0.12)" : "oklch(1 0 0 / 0.045)"}
                  stroke={isSel ? "oklch(0.92 0.23 128 / 0.85)" : "oklch(1 0 0 / 0.16)"}
                  strokeWidth={isSel ? 2 : 1.25}
                  className="transition-all duration-200"
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.sub ? n.y + n.h / 2 - 4 : n.y + n.h / 2 + 4}
                  textAnchor="middle"
                  fontSize={n.w > 300 ? 15 : 13}
                  fontWeight="600"
                  fill={isSel ? "oklch(0.92 0.23 128)" : "oklch(0.97 0 0 / 0.9)"}
                  className="font-display"
                >
                  {n.label.length > 30 ? n.label.slice(0, 28) + "…" : n.label}
                </text>
                {n.sub ? (
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + n.h / 2 + 16}
                    textAnchor="middle"
                    fontSize="10"
                    className="font-mono"
                    fill="oklch(1 0 0 / 0.45)"
                  >
                    {n.sub.length > 42 ? n.sub.slice(0, 40) + "…" : n.sub}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Hover, tap or Tab a node — details on the right.
        </p>
      </div>

      {/* Side panel */}
      <aside
        aria-live="polite"
        className="glass-card h-fit rounded-2xl p-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          {node.label}
        </p>
        <div className="mt-4 space-y-4">
          {[
            ["What it does", node.what],
            ["Why it's here", node.why],
            ["Trade-off", node.tradeoff],
          ].map(([head, body]) => (
            <div key={head}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {head}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{body}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function Systems() {
  const [tabIndex, setTabIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.2, false);

  // Reading reduced motion once on mount keeps Diagram props stable.
  useState(() => {
    if (typeof window !== "undefined") {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  });

  const tab = systemTabs[tabIndex];

  return (
    <section id="systems" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div ref={ref} className={`mx-auto w-full max-w-7xl ${inView ? "" : "anim-paused"}`}>
        <SectionHeader
          label={systemsLabel}
          normal={systemsHeading.normal}
          accent={systemsHeading.accent}
          subtext={systemsSubtext}
        />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="System diagrams"
          className="mt-10 flex flex-wrap gap-2"
        >
          {systemTabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === tabIndex}
              onClick={() => setTabIndex(i)}
              className={`rounded-full border px-5 py-2.5 font-display text-sm font-bold transition-colors ${
                i === tabIndex
                  ? "border-accent/70 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{tab.blurb}</p>

        <motion.div
          key={tab.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-8"
        >
          <Diagram tabIndex={tabIndex} reduced={reduced} />
        </motion.div>

        {/* Concept chips glow in sequence */}
        <div className="mt-12 flex flex-wrap gap-2.5" aria-label="Core systems concepts">
          {systemChips.map((c, i) => (
            <span
              key={c}
              className="chip-seq rounded-full border border-border px-4 py-2 font-mono text-xs text-muted-foreground"
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
