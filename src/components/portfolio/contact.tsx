import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import {
  contactError,
  contactHeading,
  contactLabel,
  contactPrivacy,
  contactStatus,
  contactSubtext,
  contactSuccess,
  contactTerminalTitle,
  contactTypewriter,
} from "@/data/contact";
import { contactSchema, type ContactValues } from "@/data/contact-schema";
import { site } from "@/data/site";
import { submitContact } from "@/lib/submit-contact";
import { Section, SectionHeader } from "./section-header";

type Status = "idle" | "sending" | "success" | "error";

function useTypewriter(text: string, start: boolean) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [text, start]);
  return out;
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [inView, setInView] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const typed = useTypewriter(contactTypewriter, inView);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const set = (key: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactValues | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStatus("sending");
    try {
      await submitContact(parsed.data);
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-accent/60 focus:outline-none";

  return (
    <Section id="contact">
      <SectionHeader
        label={contactLabel}
        normal={contactHeading.normal}
        accent={contactHeading.accent}
        subtext={contactSubtext}
      />

      <div
        ref={terminalRef}
        className="mt-14 overflow-hidden rounded-3xl border border-border bg-surface"
      >
        {/* Terminal chrome */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-accent/40" />
            <span className="h-3 w-3 rounded-full bg-accent" />
          </div>
          <p className="font-mono text-xs text-muted-foreground">{contactTerminalTitle}</p>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
            {contactStatus}
          </p>
        </div>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-2">
          {/* Typewriter + direct line */}
          <div className="flex flex-col">
            <p className="font-mono text-sm text-foreground/90">
              {typed}
              <span className="terminal-caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent" aria-hidden="true" />
            </p>

            <div className="mt-10 space-y-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Direct line
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 inline-block break-all font-display text-lg font-bold text-foreground transition-colors hover:text-accent sm:text-xl"
                >
                  {site.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Elsewhere
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    GitHub
                  </a>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">{contactPrivacy}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={set("name")}
                placeholder="Your name"
                className={`mt-2 ${inputClass}`}
              />
              {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={set("email")}
                placeholder="you@company.com"
                className={`mt-2 ${inputClass}`}
              />
              {errors.email && <p className="mt-2 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="contact-message" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={values.message}
                onChange={set("message")}
                placeholder="The idea, the ambition, the constraints…"
                className={`mt-2 resize-none ${inputClass}`}
              />
              {errors.message && <p className="mt-2 text-xs text-destructive">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
            >
              {status === "sending" ? "Transmitting…" : "Send message"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="font-mono text-xs" aria-live="polite">
              {status === "success" && <span className="text-accent">{contactSuccess}</span>}
              {status === "error" && <span className="text-destructive">{contactError}</span>}
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}
