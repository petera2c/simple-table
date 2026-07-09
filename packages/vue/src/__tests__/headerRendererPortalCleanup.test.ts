import { defineComponent, h, onUnmounted } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "simple-table-core";
import { buildVanillaConfig } from "../buildVanillaConfig";
import { MountRegistry } from "../MountRegistry";
import type { SimpleTableVueProps, VueHeaderObject } from "../types";

/**
 * Simulates Teleport/floating UI: content is appended to document.body and
 * must be removed when the header Vue subtree unmounts.
 */
const FLOATING_ATTR = "data-st-test-floating-header";

const FloatingHeader = defineComponent({
  name: "FloatingHeader",
  props: {
    header: { type: Object, required: true },
    components: { type: Object, required: false },
  },
  setup(props) {
    const el = document.createElement("div");
    el.setAttribute(FLOATING_ATTR, "true");
    el.textContent = `floating:${String((props.header as { label?: string }).label)}`;
    document.body.appendChild(el);
    onUnmounted(() => {
      el.remove();
    });
    return () =>
      h(
        "span",
        { class: "custom-head" },
        String((props.header as { label?: string }).label ?? ""),
      );
  },
});

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let host: HTMLDivElement | null = null;
let instance: SimpleTableVanilla | null = null;
let registry: MountRegistry | null = null;

afterEach(() => {
  instance?.destroy();
  instance = null;
  registry?.clear();
  registry = null;
  host?.remove();
  host = null;
  document.querySelectorAll(`[${FLOATING_ATTR}]`).forEach((el) => el.remove());
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

function findScoreHeaderLabel(scope: HTMLElement): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Score"));
  if (!label) throw new Error("Score header label not found");
  return label;
}

describe("Vue adapter — headerRenderer mount cleanup on sort", () => {
  it("disposes the previous header mount so body-portaled floating UI unmounts on sort", async () => {
    const headers: VueHeaderObject[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 120,
        type: "number",
        isSortable: true,
        headerRenderer: FloatingHeader,
      },
    ];

    host = document.createElement("div");
    document.body.appendChild(host);
    registry = new MountRegistry();

    const props: SimpleTableVueProps = {
      defaultHeaders: headers,
      rows,
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
    };

    instance = new SimpleTableVanilla(host, buildVanillaConfig(props, registry));
    instance.mount();

    await waitFor(() => host!.querySelector(".custom-head") !== null);
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);

    const headerLabel = findScoreHeaderLabel(host);

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);
    await wait(50);
    expect(document.querySelectorAll(`[${FLOATING_ATTR}]`)).toHaveLength(1);

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);
    await wait(50);
    expect(document.querySelectorAll(`[${FLOATING_ATTR}]`)).toHaveLength(1);

    expect(registry.size).toBeGreaterThan(0);
  });
});
