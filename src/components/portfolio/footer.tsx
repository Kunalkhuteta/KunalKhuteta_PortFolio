import { ArrowUp } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { smoothScrollTo } from "./navbar";

export function Footer() {
  return (
    <footer className="relative border-t border-border px-4 pb-10 pt-20 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Oversized wordmark */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <a
            href={`mailto:${site.email}`}
            className="break-all font-display text-3xl font-bold tracking-tight transition-colors hover:text-accent sm:text-5xl lg:text-6xl"
          >
            {site.email}
          </a>
          <button
            type="button"
            onClick={() => smoothScrollTo("#home")}
            aria-label="Back to top"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-accent/60 hover:text-accent"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
          <ul className="flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(link.href);
                  }}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <p>{site.copyright} {site.name}</p>
          <p>{site.location}</p>
          <p>{site.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
