import React, { useLayoutEffect, useRef } from "react";
import type { ColumnEditorRowRendererComponents as VanillaColumnEditorRowComponents } from "simple-table-core";

type DomSlotProps = {
  node: Node;
};

/**
 * Bridges imperative DOM from simple-table-core into a React subtree. Core passes
 * HTMLElement/SVG nodes as slots; React cannot render those as children directly.
 * This host uses `display: contents` so flex/grid parents still lay out the slot.
 */
export function ImperativeDomSlot({ node }: DomSlotProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.appendChild(node);
    return () => {
      if (node.parentNode === host) {
        host.removeChild(node);
      }
    };
  }, [node]);

  return <span ref={ref} style={{ display: "contents" }} />;
}

/**
 * Converts a core column-editor slot (string markup or a live node) into a ReactNode.
 */
export function domSlotToReactNode(value: string | Node | null | undefined): React.ReactNode {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Node) {
    return <ImperativeDomSlot node={value} />;
  }
  return undefined;
}

/** Maps core column-editor row slots (live DOM) to React nodes for `rowRenderer` JSX. */
export function mapColumnEditorRowComponentsForReact(
  components: VanillaColumnEditorRowComponents,
): {
  expandIcon?: React.ReactNode;
  checkbox?: React.ReactNode;
  dragIcon?: React.ReactNode;
  labelContent?: React.ReactNode;
  pinIcon?: React.ReactNode;
} {
  return {
    expandIcon: domSlotToReactNode(components.expandIcon as string | Node | undefined),
    checkbox: domSlotToReactNode(components.checkbox as string | Node | undefined),
    dragIcon: domSlotToReactNode(components.dragIcon as string | Node | undefined),
    labelContent: domSlotToReactNode(components.labelContent as string | Node | undefined),
    pinIcon: domSlotToReactNode(components.pinIcon as string | Node | undefined),
  };
}
