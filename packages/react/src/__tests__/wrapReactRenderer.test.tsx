import React, { createContext, createElement, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { PortalBridge, useTablePortals } from "../PortalBridge";
import {
  wrapReactRenderer,
  wrapReactRendererIntoFragment,
  wrapReactHeaderRenderer,
  wrapReactHeaderDropdown,
  wrapReactFooterRenderer,
  wrapReactColumnEditorRowRenderer,
  wrapReactColumnEditorCustomRenderer,
  wrapReactNode,
  reactNodeToHtmlString,
  isReactComponent,
  isWrappedRenderer,
} from "../utils/wrapReactRenderer";

let host: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  host?.remove();
  host = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(10);
  }
  throw new Error("Timed out waiting for condition");
}

/** Renders the bridge's portals into a host React tree (optionally under `wrapper`). */
function mountBridge(bridge: PortalBridge, wrapper?: (node: React.ReactNode) => React.ReactElement) {
  function Harness() {
    return createElement(React.Fragment, null, useTablePortals(bridge));
  }
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  const tree = createElement(Harness);
  root.render(wrapper ? wrapper(tree) : tree);
}

describe("wrapReactRenderer / wrapReactRendererIntoFragment", () => {
  it("returns a container synchronously and renders the component into it via the bridge", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    function Comp({ value }: { value: string }) {
      return createElement("span", { className: "wrapped" }, value);
    }
    const renderToDom = wrapReactRenderer(bridge, Comp);
    const container = renderToDom({ value: "hello" });

    expect(container.tagName).toBe("DIV");
    await waitFor(() => container.querySelector(".wrapped")?.textContent === "hello");
    expect(container.querySelector(".wrapped")?.textContent).toBe("hello");
  });

  it("uses display:contents for the fragment variant (no extra layout box)", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    function Comp() {
      return createElement("span", { className: "frag" }, "x");
    }
    const container = wrapReactRendererIntoFragment(bridge, Comp)({});

    expect(container.style.display).toBe("contents");
    await waitFor(() => container.querySelector(".frag") !== null);
    expect(container.querySelector(".frag")).not.toBeNull();
  });

  it("keeps the wrapped component inside the host React tree so it inherits context", async () => {
    const Ctx = createContext("DEFAULT");
    const bridge = new PortalBridge();
    mountBridge(bridge, (node) => createElement(Ctx.Provider, { value: "FROM_HOST" }, node));

    function Comp() {
      return createElement("span", { className: "ctx" }, useContext(Ctx));
    }
    const container = wrapReactRenderer(bridge, Comp)({});

    await waitFor(() => container.querySelector(".ctx")?.textContent === "FROM_HOST");
    expect(container.querySelector(".ctx")?.textContent).toBe("FROM_HOST");
  });
});

describe("wrapReact*Renderer slot mapping (DOM node -> React node)", () => {
  it("wrapReactHeaderRenderer maps `components` DOM nodes to React nodes", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    const sortIcon = document.createElement("i");
    sortIcon.id = "sort-node";

    function Header({ components }: any) {
      return createElement("span", { className: "head" }, components?.sortIcon);
    }
    const container = wrapReactHeaderRenderer(bridge, Header)({
      accessor: "x",
      colIndex: 0,
      header: { accessor: "x", label: "X" },
      components: { sortIcon },
    } as any);

    await waitFor(() => container.querySelector(".head #sort-node") !== null);
    expect(container.querySelector(".head #sort-node")).not.toBeNull();
  });

  it("wrapReactHeaderDropdown maps `components` DOM nodes to React nodes", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    const filterIcon = document.createElement("i");
    filterIcon.id = "filter-node";

    function Dropdown({ components }: any) {
      return createElement("span", { className: "dd" }, components?.filterIcon);
    }
    const container = wrapReactHeaderDropdown(bridge, Dropdown)({
      components: { filterIcon },
    } as any);

    await waitFor(() => container.querySelector(".dd #filter-node") !== null);
    expect(container.querySelector(".dd #filter-node")).not.toBeNull();
  });

  it("wrapReactFooterRenderer maps next/prev icon slots to React nodes", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    const nextIcon = document.createElement("i");
    nextIcon.id = "next-node";

    function Footer({ nextIcon: next, prevIcon }: any) {
      return createElement(
        "span",
        { className: "foot" },
        next,
        prevIcon,
      );
    }
    const container = wrapReactFooterRenderer(bridge, Footer)({
      nextIcon,
      prevIcon: "<i class='prev-markup'></i>",
    } as any);

    await waitFor(() => container.querySelector(".foot #next-node") !== null);
    expect(container.querySelector(".foot #next-node")).not.toBeNull();
    expect(container.querySelector(".foot i.prev-markup")).not.toBeNull();
  });

  it("wrapReactColumnEditorRowRenderer maps row `components` DOM nodes to React nodes", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    const dragIcon = document.createElement("i");
    dragIcon.id = "drag-node";

    function Row({ components }: any) {
      return createElement("span", { className: "row" }, components?.dragIcon);
    }
    const container = wrapReactColumnEditorRowRenderer(bridge, Row)({
      components: { dragIcon },
    } as any);

    await waitFor(() => container.querySelector(".row #drag-node") !== null);
    expect(container.querySelector(".row #drag-node")).not.toBeNull();
  });

  it("wrapReactColumnEditorCustomRenderer maps section DOM nodes to React nodes", async () => {
    const bridge = new PortalBridge();
    mountBridge(bridge);

    const listSection = document.createElement("ul");
    listSection.id = "list-node";

    function Custom({ listSection: list }: any) {
      return createElement("div", { className: "editor" }, list);
    }
    const container = wrapReactColumnEditorCustomRenderer(bridge, Custom)({
      listSection,
    } as any);

    await waitFor(() => container.querySelector(".editor #list-node") !== null);
    expect(container.querySelector(".editor #list-node")).not.toBeNull();
  });
});

describe("static helpers", () => {
  it("wrapReactNode unwraps a single-root static render into that element", () => {
    const el = wrapReactNode(createElement("div", { className: "static" }, "hi"));
    expect(el.tagName).toBe("DIV");
    expect(el.className).toBe("static");
    expect(el.textContent).toBe("hi");
  });

  it("wrapReactNode keeps the wrapper div when markup has multiple roots", () => {
    const el = wrapReactNode(
      createElement(React.Fragment, null, createElement("a", null, "a"), createElement("b", null, "b")),
    );
    expect(el.children.length).toBe(2);
  });

  it("reactNodeToHtmlString serializes a node to HTML markup", () => {
    const html = reactNodeToHtmlString(createElement("span", { className: "c" }, "txt"));
    expect(html).toContain("<span");
    expect(html).toContain("txt");
  });

  it("isReactComponent recognizes functions/classes but not nodes or strings", () => {
    expect(isReactComponent(() => null)).toBe(true);
    expect(isReactComponent(class C extends React.Component {})).toBe(true);
    expect(isReactComponent("text")).toBe(false);
    expect(isReactComponent(createElement("div"))).toBe(false);
    expect(isReactComponent(null)).toBe(false);
  });

  it("does not nest wraps when a wrapped renderer is passed back through wrap helpers", () => {
    const bridge = new PortalBridge();
    function Comp({ value }: { value: string }) {
      return createElement("span", null, value);
    }
    const once = wrapReactRendererIntoFragment(bridge, Comp);
    const twice = wrapReactRendererIntoFragment(bridge, once as unknown as React.ComponentType<object>);
    expect(twice).toBe(once);
    expect(isWrappedRenderer(once)).toBe(true);
    expect(isWrappedRenderer(Comp)).toBe(false);
  });
});
