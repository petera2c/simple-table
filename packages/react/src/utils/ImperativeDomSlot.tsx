import React, { useLayoutEffect, useRef } from "react";
import type {
  ColumnEditorRowRendererComponents as VanillaColumnEditorRowComponents,
  HeaderRendererComponents as VanillaHeaderRendererComponents,
} from "simple-table-core";

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

/** Maps core header slots (live DOM icons) to React nodes for `headerRenderer` JSX. */
export function mapHeaderRendererComponentsForReact(
  components: VanillaHeaderRendererComponents | undefined,
): {
  sortIcon?: React.ReactNode;
  filterIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  labelContent?: React.ReactNode;
} {
  return {
    sortIcon: domSlotToReactNode(components?.sortIcon as string | Node | undefined),
    filterIcon: domSlotToReactNode(components?.filterIcon as string | Node | undefined),
    collapseIcon: domSlotToReactNode(components?.collapseIcon as string | Node | undefined),
    labelContent: domSlotToReactNode(components?.labelContent as string | Node | undefined),
  };
}

/**
 * Bridges an *icon* slot into a ReactNode. Unlike {@link domSlotToReactNode}, a
 * string is treated as HTML markup — core serializes React icons to HTML strings
 * (via renderToStaticMarkup), so it must be rendered with dangerouslySetInnerHTML
 * rather than as escaped text. Live DOM nodes still go through ImperativeDomSlot.
 */
export function iconSlotToReactNode(value: string | Node | null | undefined): React.ReactNode {
  if (value == null) return undefined;
  if (typeof value === "string") {
    if (value === "") return undefined;
    return <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: value }} />;
  }
  if (value instanceof Node) {
    return <ImperativeDomSlot node={value} />;
  }
  return undefined;
}

/** Maps core footer pagination icon slots (live DOM / HTML string) to React nodes for `footerRenderer` JSX. */
export function mapFooterIconsForReact(icons: {
  nextIcon?: unknown;
  prevIcon?: unknown;
}): { nextIcon?: React.ReactNode; prevIcon?: React.ReactNode } {
  return {
    nextIcon: iconSlotToReactNode(icons.nextIcon as string | Node | undefined),
    prevIcon: iconSlotToReactNode(icons.prevIcon as string | Node | undefined),
  };
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
