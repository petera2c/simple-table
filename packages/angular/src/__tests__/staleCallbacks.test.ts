import { afterEach, describe, expect, it, vi } from "vitest";
import type { AngularColumnDef } from "../index";
import {
  mountAngularTable,
  wait,
  waitForElement,
  type MountedTestTable,
} from "./testUtils";

/**
 * Callback props must not be frozen at mount time: when the parent re-renders
 * with a new callback closure, a subsequent sort must invoke the LATEST
 * callback. Mirrors packages/vue/src/__tests__/staleCallbacks.test.ts.
 */

const headers: AngularColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
];

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

let mounted: MountedTestTable | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

function findSortableHeaderLabel(scope: HTMLElement): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Name"));
  if (!label) throw new Error("Sortable header label not found");
  return label;
}

describe("SimpleTable (Angular adapter) — callback props stay fresh across re-renders", () => {
  it("invokes the latest onSortChange closure after a re-render, not the mount-time one", async () => {
    const mountCallback = vi.fn();
    const latestCallback = vi.fn();

    mounted = await mountAngularTable({
      columns: headers,
      rows,
      onSortChange: mountCallback,
      getRowId: (p: { row: { id?: number } }) => String(p.row.id),
    });
    await waitForElement(mounted.el, ".st-header-label");

    mounted.setState({ onSortChange: latestCallback });
    await wait(50);

    const headerLabel = findSortableHeaderLabel(mounted.el);
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(mountCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
  });
});
