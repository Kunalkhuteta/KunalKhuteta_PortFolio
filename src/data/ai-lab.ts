export const aiLabLabel = "05 — Agents at work";
export const aiLabHeading = {
  normal: "Prompts become",
  accent: "pipelines.",
};
export const aiLabSubtext =
  "A look inside how I wire GenAI and agentic workflows together.";
export const aiLabDemoNote = "Illustrative demo — not a live integration";

export type WorkflowNode = {
  id: string;
  label: string;
  kind: "trigger" | "llm" | "condition" | "action" | "loop" | "output";
  /** Column (x) and row (y) hints for layout. */
  x: number;
  y: number;
};

export const workflowNodes: WorkflowNode[] = [
  { id: "trigger", label: "Trigger (Webhook)", kind: "trigger", x: 0, y: 1 },
  { id: "llm", label: "LLM (classify)", kind: "llm", x: 1, y: 1 },
  { id: "condition", label: "Condition", kind: "condition", x: 2, y: 1 },
  { id: "sheets", label: "Google Sheets", kind: "action", x: 3, y: 0 },
  { id: "slack", label: "Slack", kind: "action", x: 3, y: 1 },
  { id: "email", label: "Email", kind: "action", x: 3, y: 2 },
  { id: "loop", label: "Loop", kind: "loop", x: 4, y: 1 },
  { id: "output", label: "Output", kind: "output", x: 5, y: 1 },
];

export const workflowEdges: Array<{ source: string; target: string }> = [
  { source: "trigger", target: "llm" },
  { source: "llm", target: "condition" },
  { source: "condition", target: "sheets" },
  { source: "condition", target: "slack" },
  { source: "condition", target: "email" },
  { source: "sheets", target: "loop" },
  { source: "slack", target: "loop" },
  { source: "email", target: "loop" },
  { source: "loop", target: "output" },
];

export type LogLine = { text: string; delay: number; ok?: boolean };

export const runLogLines: LogLine[] = [
  { text: "▶ run #1284 — webhook received (source: billing)", delay: 0 },
  { text: "→ node: LLM classify", delay: 350 },
  { text: "✔ LLM classify — 412ms — priority=high", delay: 500, ok: true },
  { text: "→ branch: priority=high → Slack", delay: 400 },
  { text: "✔ Slack message sent — #finance-alerts", delay: 380, ok: true },
  { text: "→ node: Loop (3 items)", delay: 420 },
  { text: "✔ loop iteration 1/3 — Google Sheets row added", delay: 420, ok: true },
  { text: "✔ loop iteration 2/3 — Google Sheets row added", delay: 380, ok: true },
  { text: "✔ loop iteration 3/3 — Google Sheets row added", delay: 380, ok: true },
  { text: "→ node: Output", delay: 360 },
  { text: "✔ run finished in 3.1s — status: success", delay: 420, ok: true },
];

export type AgentStep = { id: string; label: string; detail: string };

export const agentSteps: AgentStep[] = [
  { id: "goal", label: "Goal", detail: "The agent receives an objective, not just a prompt." },
  { id: "plan", label: "Plan", detail: "It decomposes the goal into ordered, checkable steps." },
  { id: "tool", label: "Choose tool", detail: "It picks from a registry of tools — APIs, search, code, data." },
  { id: "act", label: "Act", detail: "It calls the tool with real arguments and handles the response." },
  { id: "observe", label: "Observe", detail: "It reads the result and compares it against the plan." },
  { id: "reflect", label: "Reflect", detail: "It revises the plan when reality disagrees — then loops." },
];
