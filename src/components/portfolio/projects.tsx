import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import {
  projects,
  projectsHeading,
  projectsLabel,
  projectsSubtext,
} from "@/data/projects";
import { site } from "@/data/site";
import { Section, SectionHeader } from "./section-header";

function ProjectVisual({ title, tint, code }: { title: string; tint: number; code: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border"
      style={{
        background: `
          radial-gradient(90% 90% at 15% 10%, oklch(0.75 0.14 ${tint} / 0.5) 0%, transparent 55%),
          radial-gradient(80% 80% at 85% 90%, oklch(0.7 0.12 ${(tint + 40) % 360} / 0.35) 0%, transparent 60%),
          oklch(0.16 0.01 ${tint})`,
      }}
    >
      <span className="font-display text-[9rem] font-bold leading-none text-white/10 sm:text-[11rem]">
        {initials}
      </span>
      <span className="absolute bottom-4 right-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
        {code}
      </span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <div className="sticky" style={{ top: `calc(6rem + ${index * 1.75}rem)` }}>
      <motion.article
        whileHover={{ rotate: 0.4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="rounded-3xl border border-border bg-surface p-6 shadow-[0_-20px_60px_-30px_oklch(0_0_0/0.8)] transition-colors hover:border-accent/40 sm:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                {project.counter}
                <span className="mx-2 text-border">|</span>
                {project.year}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                {project.category}
              </p>
            </div>

            <h3 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-2 font-display text-lg italic text-muted-foreground">
              {project.tagline}
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">{project.description}</p>

            <ul className="mt-6 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.03]"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live demo
                </a>
              ) : project.badge ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  ● {project.badge}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  ● Demo coming soon
                </span>
              )}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-display text-sm font-bold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <Github className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              ) : null}
            </div>
          </div>

          <ProjectVisual title={project.title} tint={project.tint} code={project.code} />
        </div>
      </motion.article>
    </div>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        label={projectsLabel}
        normal={projectsHeading.normal}
        accent={projectsHeading.accent}
        subtext={projectsSubtext}
      />
      <div className="mt-16 space-y-8 pb-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Profile: {site.github}
      </p>
    </Section>
  );
}
