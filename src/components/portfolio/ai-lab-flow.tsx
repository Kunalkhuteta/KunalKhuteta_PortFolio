import { useMemo } from "react";
import { Background, BackgroundVariant, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./ai-lab-flow.css";
import { workflowEdges, workflowNodes } from "@/data/ai-lab";

const VIOLET_KINDS = new Set(["llm", "condition"]);

/**
 * Read-only React Flow canvas for the AI lab. Heavy library lives behind a
 * lazy import in ai-lab.tsx so it never runs during SSR.
 */
export function WorkflowFlow({ lit, interactive }: { lit: Set<string>; interactive: boolean }) {
  const nodes: Node[] = useMemo(
    () =>
      workflowNodes.map((n) => ({
        id: n.id,
        position: { x: n.x * 190, y: n.y * 118 },
        data: { label: n.label },
        className: `wf-node ${VIOLET_KINDS.has(n.kind) ? "wf-node-violet" : ""} ${
          lit.has(n.id) ? "wf-node-lit" : ""
        }`,
        draggable: false,
        selectable: false,
      })),
    [lit],
  );

  const edges: Edge[] = useMemo(
    () =>
      workflowEdges.map((e) => {
        const on = lit.has(e.source) && lit.has(e.target);
        return {
          id: `${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          animated: on,
          style: {
            stroke: on ? "oklch(0.92 0.23 128 / 0.85)" : "oklch(1 0 0 / 0.15)",
            strokeWidth: on ? 2 : 1.5,
          },
        };
      }),
    [lit],
  );

  return (
    <div className="h-[360px] w-full sm:h-[400px]" aria-hidden="true">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.6}
        maxZoom={1.4}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesFocusable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={interactive}
        panOnDrag={interactive}
        preventScrolling={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="oklch(1 0 0 / 0.12)"
        />
      </ReactFlow>
    </div>
  );
}
