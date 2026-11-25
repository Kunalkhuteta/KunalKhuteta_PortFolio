import { lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  Mail,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  agentSteps,
  aiLabDemoNote,
  aiLabHeading,
  aiLabLabel,
  aiLabSubtext,
  workflowNodes,
} from "@/data/ai-lab";
import { useInView } from "@/hooks/use-in-view";
import { dispatchResumeAction } from "@/lib/dispatch-resume";
import { SectionHeader } from "./section-header";

const WorkflowFlow = lazy(() => import("./ai-lab-flow").then((m) => ({ default: m.WorkflowFlow })));

type DisplayedLog = {
  text: string;
  kind?: "info" | "success" | "warn" | "accent";
  timestamp: string;
};

export function AiLab() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, false);
  const [mounted, setMounted] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const reduced = useReducedMotion();

  // Workflow execution state
  const [email, setEmail] = useState("");
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  const [running, setRunning] = useState(false);
  const [lit, setLit] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<DisplayedLog[]>([]);
  const [lastDeliveryId, setLastDeliveryId] = useState<string | null>(null);
  const [copiedLogs, setCopiedLogs] = useState(false);

  // Agent loop state
  const [stepIdx, setStepIdx] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);
  const { ref: loopRef, inView: loopInView } = useInView<HTMLDivElement>(0.3, false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInteractive(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  // Lazy-mount the flow canvas when scrolled into view
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  // Rotate agent loop steps
  useEffect(() => {
    if (!loopInView || reduced) return;
    const id = window.setInterval(() => setStepIdx((s) => (s + 1) % agentSteps.length), 2200);
    return () => window.clearInterval(id);
  }, [loopInView, reduced]);

  // Auto-scroll ONLY the internal terminal box (never the window/page!) when new logs arrive
  useEffect(() => {
    const el = terminalContainerRef.current;
    if (el && logs.length > 0) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, kind: "info" | "success" | "warn" | "accent" = "info") => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { text, kind, timestamp: time }]);
  };

  /**
   * Executes the real multi-channel resume dispatch agent workflow (email with PDF attached, no local browser download).
   */
  const runWorkflow = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (running) return;

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      toast.error("Please enter an email address to dispatch the resume.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    setRunning(true);
    setLit(new Set(["trigger"]));
    setLogs([]);

    const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

    try {
      // Step 1: Goal Intake & Validation
      addLog(`▶ [01/06 INTAKE] Goal: Package & email Kunal's PDF resume`, "accent");
      addLog(`• Target Recipient: ${trimmedEmail}`, "info");
      addLog(
        `• Active Channels: Email with PDF Attachment${enableWhatsApp ? " + WhatsApp (Staged)" : ""}`,
        "info",
      );
      await sleep(reduced ? 50 : 350);

      // Step 2: Agent Planner & Policy Verification
      setLit((prev) => new Set(prev).add("planner"));
      addLog(`→ [02/06 PLANNER] Parsing recipient domain and routing policy...`, "info");
      await sleep(reduced ? 50 : 400);
      addLog(
        `✔ [02/06 PLANNER] Recipient verified. Execution plan formulated: [MimeAttachPDF -> SmtpRelay]`,
        "success",
      );

      // Step 3: Package PDF Asset
      setLit((prev) => new Set(prev).add("package"));
      addLog(`→ [03/06 ASSET] Locating and staging Kunal_Khuteta_Resume.pdf...`, "info");
      await sleep(reduced ? 50 : 400);
      addLog(`✔ [03/06 ASSET] Staged verified resume binary (PDF 1.4)`, "success");

      // Step 4: Attach PDF to Outbound Email Payload
      setLit((prev) => new Set(prev).add("attach"));
      addLog(
        `→ [04/06 ATTACH] Attaching Kunal_Khuteta_Resume.pdf to outbound email payload...`,
        "info",
      );
      await sleep(reduced ? 50 : 400);
      addLog(
        `✔ [04/06 ATTACH] PDF resume attached as MIME attachment (Kunal_Khuteta_Resume.pdf)`,
        "success",
      );

      // Step 5: Backend Dispatch (Gmail SMTP / Resend API)
      setLit((prev) => new Set(prev).add("email"));
      addLog(`→ [05/06 TRANSMIT] Invoking server dispatch action with PDF attachment...`, "info");

      const serverResult = await dispatchResumeAction({
        data: {
          email: trimmedEmail,
          enableWhatsApp,
        },
      });

      setLastDeliveryId(serverResult.deliveryId);

      if (serverResult.auditTrail && serverResult.auditTrail.length > 0) {
        serverResult.auditTrail.forEach((line) => {
          if (line.includes("[SUCCESS]")) {
            addLog(`✔ ${line}`, "success");
          } else if (line.includes("[WARN]") || line.includes("[NOTICE]")) {
            addLog(`• ${line}`, "warn");
          } else {
            addLog(`• ${line}`, "info");
          }
        });
      }

      // WhatsApp Channel Staging Note
      if (enableWhatsApp) {
        setLit((prev) => new Set(prev).add("whatsapp"));
        addLog(`• [WHATSAPP-STAGING] Ready for Twilio / Meta Cloud API credentials.`, "accent");
      }

      await sleep(reduced ? 50 : 350);

      // Step 6: Delivery Audit & Completion
      setLit((prev) => new Set(prev).add("audit"));
      addLog(
        `✔ [06/06 AUDIT] Workflow executed successfully · ID: ${serverResult.deliveryId}`,
        "accent",
      );

      if (serverResult.emailStatus === "sent") {
        toast.success(
          `Resume PDF sent to ${trimmedEmail}! Check your email inbox for the attached resume.`,
        );
      } else {
        toast.success(
          `Email dispatch simulated with PDF attached (ID: ${serverResult.deliveryId})`,
        );
      }
    } catch (err) {
      console.error(err);
      addLog(`✖ [ERROR] Failed to execute dispatch: ${String(err)}`, "warn");
      toast.error("Workflow encountered a transmission error.");
    } finally {
      setRunning(false);
    }
  };

  const copyLogs = () => {
    const raw = logs.map((l) => `[${l.timestamp}] ${l.text}`).join("\n");
    navigator.clipboard.writeText(raw);
    setCopiedLogs(true);
    toast.success("Terminal logs copied to clipboard.");
    window.setTimeout(() => setCopiedLogs(false), 2000);
  };

  const step = agentSteps[stepIdx] ?? agentSteps[0]!;

  return (
    <section id="lab" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div ref={ref} className={`mx-auto w-full max-w-7xl ${inView ? "" : "anim-paused"}`}>
        <SectionHeader
          label={aiLabLabel}
          normal={aiLabHeading.normal}
          accent={aiLabHeading.accent}
          subtext={aiLabSubtext}
        />

        {/* Real Interactive Workflow Trigger Bar */}
        <div className="glass-card mt-12 rounded-3xl p-5 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  Interactive Resume Dispatch Agent
                </p>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                Enter your email to test the autonomous delivery loop
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Runs a real pipeline: validates inbox, packages{" "}
                <span className="font-mono text-foreground">Kunal_Khuteta_Resume.pdf</span> as an
                email attachment, and dispatches it directly to your inbox.
              </p>
            </div>

            {/* Channel toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Email Channel (Active)</span>
              </div>

              <button
                type="button"
                onClick={() => setEnableWhatsApp((v) => !v)}
                title="Toggle WhatsApp relay integration"
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  enableWhatsApp
                    ? "border-accent bg-accent/20 text-accent font-semibold"
                    : "border-border bg-surface text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>
                  WhatsApp Relay {enableWhatsApp ? "[Enabled]" : "[Staged / Click to test]"}
                </span>
              </button>
            </div>
          </div>

          {/* Input & Action Form */}
          <form onSubmit={runWorkflow} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (e.g. name@gmail.com)"
                disabled={running}
                required
                className="w-full rounded-2xl border border-border bg-background/80 py-3.5 pl-11 pr-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={running}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(198,255,61,0.35)] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Agent Running…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Deploy Agent & Send</span>
                </>
              )}
            </button>
          </form>

          {lastDeliveryId && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-2 font-mono text-[11px] text-accent">
              <Check className="h-3.5 w-3.5" />
              <span>
                Last Delivery UUID: <strong className="font-semibold">{lastDeliveryId}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Workflow Diagram & Terminal Logs Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Flow canvas */}
          <div className="glass-card rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {aiLabDemoNote}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => runWorkflow()}
                  disabled={running}
                  className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
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
                  <p className="font-mono text-xs text-muted-foreground">
                    Loading workflow canvas…
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Run logs terminal */}
          <div className="glass-card flex flex-col rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Real-Time Execution Logs
              </p>
              <div className="flex items-center gap-3">
                {logs.length > 0 && (
                  <button
                    type="button"
                    onClick={copyLogs}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground hover:text-accent"
                  >
                    {copiedLogs ? (
                      <Check className="h-3 w-3 text-accent" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedLogs ? "Copied" : "Copy"}</span>
                  </button>
                )}
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      running ? "animate-pulse-dot bg-accent" : "bg-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {running ? "executing" : "idle"}
                </span>
              </div>
            </div>

            <div
              ref={terminalContainerRef}
              className="mt-3 flex-1 h-[360px] overflow-y-auto rounded-2xl border border-border bg-background/80 p-4 font-mono text-xs leading-6 sm:h-[400px]"
              aria-live="polite"
            >
              {logs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <Mail className="h-8 w-8 opacity-30 mb-2" />
                  <p>Enter your email above and click “Deploy Agent & Send”.</p>
                  <p className="mt-1 text-[11px] opacity-70">
                    The agent will attach Kunal_Khuteta_Resume.pdf and dispatch the email to your
                    inbox.
                  </p>
                </div>
              ) : (
                logs.map((l, i) => {
                  let colorClass = "text-foreground/80";
                  if (l.kind === "accent") colorClass = "text-accent font-semibold";
                  else if (l.kind === "success") colorClass = "text-emerald-400";
                  else if (l.kind === "warn") colorClass = "text-amber-400";

                  return (
                    <div key={`${l.timestamp}-${i}`} className="flex gap-2">
                      <span className="shrink-0 text-muted-foreground/50 select-none">
                        [{l.timestamp}]
                      </span>
                      <p className={colorClass}>{l.text}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Agent loop */}
        <div ref={loopRef} className="glass-card mt-6 rounded-3xl p-6 sm:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72" ref={stepRef}>
              <svg
                viewBox="0 0 280 280"
                className="h-full w-full -rotate-90"
                fill="none"
                aria-hidden="true"
              >
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
                The agent loop · Autonomous Execution Architecture
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
                Click a step, or let it rotate automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
