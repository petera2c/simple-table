import React, { createElement, isValidElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import {
  ImperativeDomSlot,
  domSlotToReactNode,
  iconSlotToReactNode,
  mapHeaderRendererComponentsForReact,
  mapFooterIconsForReact,
  mapColumnEditorRowComponentsForReact,
} from "../utils/ImperativeDomSlot";

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function mount(node: React.ReactElement): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(node);
  return host;
}

/** True when `node` is the ImperativeDomSlot bridge element wrapping `expectedNode`. */
function isDomSlotFor(node: React.ReactNode, expectedNode: Node): boolean {
  return (
    isValidElement(node) &&
    node.type === ImperativeDomSlot &&
    (node.props as { node?: Node }).node === expectedNode
  );
}

describe("ImperativeDomSlot component", () => {
  it("appends the live DOM node into its display:contents host and removes it on unmount", async () => {
    const node = document.createElement("b");
    node.id = "slot-node";
    node.textContent = "live";

    const host = mount(createElement(ImperativeDomSlot, { node }));
    await wait(0);

    const mounted = host.querySelector("#slot-node");
    expect(mounted).not.toBeNull();
    expect((mounted!.parentElement as HTMLElement).style.display).toBe("contents");

    root!.unmount();
    root = null;
    await wait(0);

    // Cleanup detaches the node from the host span.
    expect(host.querySelector("#slot-node")).toBeNull();
    expect(node.parentNode).toBeNull();
  });
});

describe("domSlotToReactNode", () => {
  it("returns undefined for null/undefined", () => {
    expect(domSlotToReactNode(null)).toBeUndefined();
    expect(domSlotToReactNode(undefined)).toBeUndefined();
  });

  it("passes strings through unchanged", () => {
    expect(domSlotToReactNode("plain text")).toBe("plain text");
  });

  it("wraps a live DOM node in an ImperativeDomSlot", () => {
    const node = document.createElement("span");
    expect(isDomSlotFor(domSlotToReactNode(node), node)).toBe(true);
  });
});

describe("iconSlotToReactNode", () => {
  it("returns undefined for null and empty string", () => {
    expect(iconSlotToReactNode(null)).toBeUndefined();
    expect(iconSlotToReactNode("")).toBeUndefined();
  });

  it("renders non-empty string markup via dangerouslySetInnerHTML (not escaped text)", async () => {
    const result = iconSlotToReactNode("<svg class='icon-markup'></svg>");
    expect(isValidElement(result)).toBe(true);

    const host = mount(createElement("div", null, result));
    await wait(0);
    // The markup is parsed into a real <svg>, not rendered as escaped text.
    expect(host.querySelector("svg.icon-markup")).not.toBeNull();
    expect(host.textContent).not.toContain("<svg");
  });

  it("wraps a live DOM node in an ImperativeDomSlot", () => {
    const node = document.createElement("svg");
    expect(isDomSlotFor(iconSlotToReactNode(node), node)).toBe(true);
  });
});

describe("mapHeaderRendererComponentsForReact", () => {
  it("bridges each header slot DOM node into a React node", () => {
    const sortIcon = document.createElement("i");
    const filterIcon = document.createElement("i");
    const collapseIcon = document.createElement("i");
    const labelContent = document.createElement("span");

    const mapped = mapHeaderRendererComponentsForReact({
      sortIcon,
      filterIcon,
      collapseIcon,
      labelContent,
    } as any);

    expect(isDomSlotFor(mapped.sortIcon, sortIcon)).toBe(true);
    expect(isDomSlotFor(mapped.filterIcon, filterIcon)).toBe(true);
    expect(isDomSlotFor(mapped.collapseIcon, collapseIcon)).toBe(true);
    expect(isDomSlotFor(mapped.labelContent, labelContent)).toBe(true);
  });

  it("returns undefined slots when components is undefined", () => {
    const mapped = mapHeaderRendererComponentsForReact(undefined);
    expect(mapped.sortIcon).toBeUndefined();
    expect(mapped.filterIcon).toBeUndefined();
    expect(mapped.collapseIcon).toBeUndefined();
    expect(mapped.labelContent).toBeUndefined();
  });
});

describe("mapFooterIconsForReact", () => {
  it("bridges a live next icon node and treats a prev string as HTML markup", async () => {
    const nextIcon = document.createElement("i");
    const mapped = mapFooterIconsForReact({ nextIcon, prevIcon: "<i class='prev-markup'></i>" });

    expect(isDomSlotFor(mapped.nextIcon, nextIcon)).toBe(true);

    const host = mount(createElement("div", null, mapped.prevIcon));
    await wait(0);
    expect(host.querySelector("i.prev-markup")).not.toBeNull();
  });
});

describe("mapColumnEditorRowComponentsForReact", () => {
  it("bridges every column-editor row slot DOM node into a React node", () => {
    const expandIcon = document.createElement("i");
    const checkbox = document.createElement("input");
    const dragIcon = document.createElement("i");
    const labelContent = document.createElement("span");
    const pinIcon = document.createElement("i");

    const mapped = mapColumnEditorRowComponentsForReact({
      expandIcon,
      checkbox,
      dragIcon,
      labelContent,
      pinIcon,
    } as any);

    expect(isDomSlotFor(mapped.expandIcon, expandIcon)).toBe(true);
    expect(isDomSlotFor(mapped.checkbox, checkbox)).toBe(true);
    expect(isDomSlotFor(mapped.dragIcon, dragIcon)).toBe(true);
    expect(isDomSlotFor(mapped.labelContent, labelContent)).toBe(true);
    expect(isDomSlotFor(mapped.pinIcon, pinIcon)).toBe(true);
  });
});
