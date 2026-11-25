export const aiLabLabel = "04 — Agents at work";
export const aiLabHeading = {
  normal: "Prompts become",
  accent: "pipelines.",
};
export const aiLabSubtext =
  "Test a live autonomous agent workflow: enter your email below to package my resume, trigger an instant direct browser download, and dispatch an email delivery to your inbox in real time.";
export const aiLabDemoNote = "Live agent workflow · Download & email dispatch";

export type WorkflowNode = {
  id: string;
  label: string;
  kind: "trigger" | "llm" | "condition" | "action" | "loop" | "output";
  /** Column (x) and row (y) hints for layout. */
  x: number;
  y: number;
};

export const workflowNodes: WorkflowNode[] = [
  { id: "trigger", label: "Trigger (User Email)", kind: "trigger", x: 0, y: 1 },
  { id: "planner", label: "Agent (Validate & Plan)", kind: "llm", x: 1, y: 1 },
  { id: "package", label: "Package Asset (PDF)", kind: "condition", x: 2, y: 1 },
  { id: "download", label: "Browser Download", kind: "action", x: 3, y: 0 },
  { id: "email", label: "Email Dispatch (SMTP/API)", kind: "action", x: 3, y: 1 },
  { id: "whatsapp", label: "WhatsApp Gateway (Staged)", kind: "action", x: 3, y: 2 },
  { id: "audit", label: "Delivery Audit", kind: "output", x: 4, y: 1 },
];

export const workflowEdges: Array<{ source: string; target: string }> = [
  { source: "trigger", target: "planner" },
  { source: "planner", target: "package" },
  { source: "package", target: "download" },
  { source: "package", target: "email" },
  { source: "package", target: "whatsapp" },
  { source: "download", target: "audit" },
  { source: "email", target: "audit" },
  { source: "whatsapp", target: "audit" },
];

export type AgentStep = { id: string; label: string; detail: string };

export const agentSteps: AgentStep[] = [
  {
    id: "goal",
    label: "Goal Intake",
    detail:
      "Agent captures recipient email, evaluates delivery requirements, and checks channel flags.",
  },
  {
    id: "validate",
    label: "Input Validation",
    detail:
      "Performs syntax sanitization and MX domain verification on the supplied email address.",
  },
  {
    id: "package",
    label: "Asset Packaging",
    detail:
      "Retrieves Kunal's latest verified PDF resume and stamps unique delivery cryptographic metadata.",
  },
  {
    id: "download",
    label: "Browser Stream",
    detail: "Initiates immediate binary blob download directly to visitor's local filesystem.",
  },
  {
    id: "dispatch",
    label: "Email Transmission",
    detail: "Invokes secure server function to dispatch through Resend REST API or Gmail SMTP.",
  },
  {
    id: "audit",
    label: "Audit Trail",
    detail: "Emits verifiable execution receipt with delivery UUID and execution timestamps.",
  },
];
