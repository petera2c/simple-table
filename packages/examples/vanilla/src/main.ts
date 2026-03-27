import { DEMO_LIST } from "@simple-table/examples-shared";
import type { Theme } from "simple-table-core";
import "../../shared/src/styles/shell.css";

type DemoRenderer = (
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
) => any;

const registry: Record<
  string,
  () => Promise<{ [key: string]: DemoRenderer }>
> = {
  "quick-start": () =>
    import("./demos/quick-start/QuickStartDemo").then((m) => ({
      render: m.renderQuickStartDemo,
    })),
  "column-filtering": () =>
    import("./demos/column-filtering/ColumnFilteringDemo").then((m) => ({
      render: m.renderColumnFilteringDemo,
    })),
  "column-sorting": () =>
    import("./demos/column-sorting/ColumnSortingDemo").then((m) => ({
      render: m.renderColumnSortingDemo,
    })),
  "value-formatter": () =>
    import("./demos/value-formatter/ValueFormatterDemo").then((m) => ({
      render: m.renderValueFormatterDemo,
    })),
  "pagination": () =>
    import("./demos/pagination/PaginationDemo").then((m) => ({
      render: m.renderPaginationDemo,
    })),
};

const params = new URLSearchParams(window.location.search);
let activeDemo = params.get("demo") || "quick-start";
const height = params.get("height") || undefined;
const theme = (params.get("theme") as Theme) || undefined;

const root = document.getElementById("root")!;
root.innerHTML = "";

const shell = document.createElement("div");
shell.className = "examples-shell";

const sidebar = document.createElement("aside");
sidebar.className = "examples-sidebar";

const header = document.createElement("div");
header.className = "examples-sidebar-header";
header.textContent = "Vanilla TS Examples";
sidebar.appendChild(header);

const nav = document.createElement("nav");
const ul = document.createElement("ul");
ul.className = "examples-sidebar-nav";

const links = new Map<string, HTMLButtonElement>();

for (const demo of DEMO_LIST) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.className = "examples-sidebar-link";
  btn.textContent = demo.label;
  btn.addEventListener("click", () => selectDemo(demo.id));
  links.set(demo.id, btn);
  li.appendChild(btn);
  ul.appendChild(li);
}

nav.appendChild(ul);
sidebar.appendChild(nav);

const content = document.createElement("main");
content.className = "examples-content";

shell.appendChild(sidebar);
shell.appendChild(content);
root.appendChild(shell);

function updateActive(id: string) {
  links.forEach((btn, demoId) => {
    btn.classList.toggle("active", demoId === id);
  });
}

async function loadDemo(id: string) {
  content.innerHTML = "";
  const loader = registry[id];
  if (!loader) {
    content.innerHTML = `<h2>Unknown demo: ${id}</h2>`;
    return;
  }
  const mod = await loader();
  mod.render(content, { height, theme });
}

function selectDemo(id: string) {
  activeDemo = id;
  const url = new URL(window.location.href);
  url.searchParams.set("demo", id);
  window.history.pushState({}, "", url);
  updateActive(id);
  loadDemo(id);
}

updateActive(activeDemo);
loadDemo(activeDemo);

window.addEventListener("popstate", () => {
  activeDemo =
    new URLSearchParams(window.location.search).get("demo") || "quick-start";
  updateActive(activeDemo);
  loadDemo(activeDemo);
});
