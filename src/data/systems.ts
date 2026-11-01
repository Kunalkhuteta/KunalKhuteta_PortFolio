export const systemsLabel = "04 — How I think in systems";
export const systemsHeading = {
  normal: "Architecture, not just",
  accent: "screens.",
};
export const systemsSubtext =
  "Simplified views of systems I've designed and built, and the trade-offs behind them.";
export const systemsDiagramNote = "Simplified diagram";

export type SystemNode = {
  id: string;
  label: string;
  sub?: string;
  /** Position in the 860×470 diagram viewBox. */
  x: number;
  y: number;
  w: number;
  h: number;
  what: string;
  why: string;
  tradeoff: string;
};

export type SystemEdge = { from: string; to: string; label?: string };

export type SystemTab = {
  id: string;
  name: string;
  blurb: string;
  nodes: SystemNode[];
  edges: SystemEdge[];
  callouts: string[];
};

export const systemTabs: SystemTab[] = [
  {
    id: "observability",
    name: "Observability pipeline",
    blurb:
      "How millions of events flow from hosts to alerts without drowning anyone in noise.",
    nodes: [
      {
        id: "hosts",
        label: "App hosts",
        sub: "eBPF agent (Python)",
        x: 24, y: 40, w: 190, h: 74,
        what: "Collects logs, metrics and traces at the kernel level with an eBPF agent.",
        why: "eBPF sees what really happens in the host without instrumenting every app.",
        tradeoff: "Kernel-level capture is powerful but Linux-only and version-sensitive.",
      },
      {
        id: "redis",
        label: "Redis Streams",
        sub: "buffering",
        x: 300, y: 40, w: 180, h: 74,
        what: "Buffers the raw event firehose before processing.",
        why: "Absorbs traffic spikes so processors can consume at their own pace.",
        tradeoff: "In-memory: retention window is short by design.",
      },
      {
        id: "processors",
        label: "Stream processors",
        sub: "parse · enrich · detect",
        x: 560, y: 40, w: 210, h: 74,
        what: "Parses, enriches and runs ML-based anomaly detection on the stream.",
        why: "One place to normalize events before they hit storage.",
        tradeoff: "Processing adds latency between event and query.",
      },
      {
        id: "influx",
        label: "InfluxDB",
        sub: "metrics",
        x: 300, y: 190, w: 180, h: 64,
        what: "Time-series store for metrics.",
        why: "Purpose-built for fast range queries and downsampling.",
        tradeoff: "Another database to operate and size.",
      },
      {
        id: "postgres",
        label: "PostgreSQL",
        sub: "metadata",
        x: 560, y: 190, w: 210, h: 64,
        what: "Stores users, teams, dashboards and alert rules.",
        why: "Relational integrity for the control plane.",
        tradeoff: "Split brain risk between metadata and metric stores.",
      },
      {
        id: "dashboard",
        label: "React 18 dashboard",
        sub: "live log streaming",
        x: 24, y: 190, w: 190, h: 64,
        what: "Live querying, log streaming and debugging views.",
        why: "The surface engineers actually touch.",
        tradeoff: "Live streams need careful back-pressure on slow clients.",
      },
      {
        id: "alert",
        label: "Alert rule engine",
        sub: "thresholds · anomaly",
        x: 300, y: 330, w: 180, h: 74,
        what: "Evaluates rules against the enriched stream and metric store.",
        why: "Turns raw telemetry into something a human should look at.",
        tradeoff: "Tuning thresholds is ongoing work, not a one-time setup.",
      },
      {
        id: "channels",
        label: "Slack · Webhook · Email · PagerDuty",
        x: 560, y: 330, w: 210, h: 74,
        what: "Delivers alerts to the tools teams already live in.",
        why: "Alerts are useless if nobody sees them.",
        tradeoff: "Noisy channels get muted — pacing and dedup matter.",
      },
    ],
    edges: [
      { from: "hosts", to: "redis" },
      { from: "redis", to: "processors" },
      { from: "processors", to: "influx", label: "metrics" },
      { from: "processors", to: "postgres", label: "metadata" },
      { from: "redis", to: "dashboard", label: "live tail" },
      { from: "influx", to: "alert" },
      { from: "alert", to: "channels" },
    ],
    callouts: [
      "Designed for millions of events",
      "Anomaly detection",
      "Distributed tracing",
      "Multi-tenancy",
      "RBAC",
      "Query caching",
    ],
  },
  {
    id: "erp",
    name: "ERP backend",
    blurb: "How a production ERP keeps web, mobile and modules in real-time sync.",
    nodes: [
      {
        id: "clients",
        label: "Angular web + Flutter app",
        x: 24, y: 40, w: 210, h: 74,
        what: "50+ Angular UI modules plus a production Flutter mobile ERP app.",
        why: "Two surfaces, one coherent experience.",
        tradeoff: "Every API change has to respect both clients.",
      },
      {
        id: "api",
        label: "ASP.NET Core API",
        sub: "JWT/OAuth · RBAC · versioning",
        x: 320, y: 40, w: 220, h: 74,
        what: "Middleware pipelines, structured error handling and API versioning.",
        why: "One versioned contract for web and mobile.",
        tradeoff: "Versioning discipline slows quick hacks — on purpose.",
      },
      {
        id: "redis",
        label: "Redis",
        sub: "sessions & hot reads",
        x: 620, y: 40, w: 180, h: 74,
        what: "Caches sessions and high-frequency reads.",
        why: "Cut database load where reads repeat constantly.",
        tradeoff: "Stale cache windows must be tuned per entity.",
      },
      {
        id: "events",
        label: "Event-driven layer",
        sub: "real-time sync",
        x: 620, y: 190, w: 180, h: 74,
        what: "Event workflows sync accounting, inventory and operations modules.",
        why: "Modules stay consistent without blocking each other.",
        tradeoff: "Eventual consistency — the UI must reflect in-flight states.",
      },
      {
        id: "postgres",
        label: "PostgreSQL",
        x: 320, y: 190, w: 220, h: 64,
        what: "System of record for accounting and inventory data.",
        why: "Transactions matter when money moves.",
        tradeoff: "Heavier writes; that's why the cache layer exists.",
      },
      {
        id: "modules",
        label: "Accounting · Inventory · Operations",
        x: 24, y: 190, w: 210, h: 74,
        what: "The ERP business modules kept in sync in real time.",
        why: "One change in inventory must be visible everywhere instantly.",
        tradeoff: "Cross-module events need careful idempotency.",
      },
    ],
    edges: [
      { from: "clients", to: "api" },
      { from: "api", to: "redis" },
      { from: "api", to: "postgres" },
      { from: "api", to: "events" },
      { from: "events", to: "modules" },
      { from: "events", to: "clients", label: "WebSockets" },
    ],
    callouts: [
      "Event-driven design",
      "Real-time sync",
      "Caching",
      "API versioning",
      "RBAC",
    ],
  },
  {
    id: "automation",
    name: "Workflow engine",
    blurb: "Inside the AI workflow automation platform: from canvas to execution.",
    nodes: [
      {
        id: "builder",
        label: "React Flow builder",
        sub: "drag & drop workflows",
        x: 24, y: 40, w: 210, h: 74,
        what: "Visual canvas to create and manage multi-step workflows.",
        why: "Non-developers can automate without writing glue code.",
        tradeoff: "Visual builders always meet edge cases — escape hatches required.",
      },
      {
        id: "nodeapi",
        label: "Node / Express API",
        sub: "JWT · file storage · MongoDB",
        x: 320, y: 40, w: 210, h: 74,
        what: "Auth, workflow CRUD, file storage and orchestration.",
        why: "Separates definition (API) from execution (engine).",
        tradeoff: "Two runtimes to deploy and monitor.",
      },
      {
        id: "engine",
        label: "FastAPI engine",
        sub: "execution",
        x: 620, y: 40, w: 190, h: 74,
        what: "Runs workflows step by step, with conditional logic and loops.",
        why: "Python gives first-class access to AI/LLM tooling.",
        tradeoff: "Cross-service state must be explicit.",
      },
      {
        id: "tools",
        label: "19+ tools",
        sub: "LLM · vision AI · HTTP · Sheets · DB · email · Slack · SMS · PDF/image · custom code",
        x: 320, y: 190, w: 490, h: 84,
        what: "The tool registry workflows are composed from.",
        why: "A growing library multiplies what one workflow can do.",
        tradeoff: "Each tool brings its own failure modes to sandbox.",
      },
      {
        id: "tracker",
        label: "Execution tracker",
        sub: "real-time",
        x: 24, y: 190, w: 210, h: 74,
        what: "Live per-step status, logs and retries for every run.",
        why: "Trust in automation comes from observability.",
        tradeoff: "Streaming updates at scale need back-pressure too.",
      },
    ],
    edges: [
      { from: "builder", to: "nodeapi" },
      { from: "nodeapi", to: "engine" },
      { from: "engine", to: "tools" },
      { from: "tools", to: "tracker", label: "status" },
      { from: "engine", to: "tracker", label: "steps" },
    ],
    callouts: [
      "Stream processing",
      "Multi-tenancy",
      "Real-time sync",
      "Containerization",
      "Conditional logic · loops · transforms",
    ],
  },
];

export const systemChips = [
  "Caching",
  "Event-driven design",
  "Stream processing",
  "Multi-tenancy",
  "RBAC",
  "Real-time sync",
  "Distributed tracing",
  "Anomaly detection",
  "API versioning",
  "Containerization",
];
