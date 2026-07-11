import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "simple-table-core";
import type { HeaderObject } from "simple-table-core";

/**
 * Mirrors the Storybook expandable loading stories: vanilla
 * `update({ isLoading })` only, same rows reference.
 *
 * React re-renders often pass `rows` again and can invalidate the body
 * context cache as a side effect. A loading-only update does not — so
 * `createContextHash` must include `isLoading`, otherwise cells keep a
 * stale cached context and never swap skeletons ↔ content.
 */

let container: HTMLDivElement | null = null;
let table: SimpleTableVanilla | null = null;

afterEach(() => {
  table?.destroy();
  table = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const headers: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  { accessor: "role", label: "Role", width: 120, type: "string" },
];

const rows = [
  {
    id: "dept-1",
    name: "Engineering",
    role: "Dept",
    teams: [
      { id: "team-1", name: "Frontend", role: "Team" },
      { id: "team-2", name: "Backend", role: "Team" },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    role: "Dept",
    teams: [{ id: "team-3", name: "West", role: "Team" }],
  },
];

function mount(isLoading: boolean): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  table = new SimpleTableVanilla(host, {
    defaultHeaders: headers,
    rows,
    rowGrouping: ["teams"],
    getRowId: (p) => String((p.row as { id?: unknown })?.id),
    height: "300px",
    isLoading,
  });
  table.mount();
  return host;
}

describe("SimpleTableVanilla — isLoading-only update with expandable column", () => {
  it("restores expandable content after update({ isLoading: false })", async () => {
    const host = mount(true);
    await wait(80);

    expect(
      host.querySelectorAll('.st-cell[data-accessor="name"] .st-loading-skeleton').length,
    ).toBeGreaterThan(0);

    table!.update({ isLoading: false });
    await wait(150);

    expect(host.textContent).toContain("Engineering");
    expect(
      host.querySelectorAll('.st-cell[data-accessor="name"] .st-loading-skeleton').length,
    ).toBe(0);
    const engineering = Array.from(
      host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
    ).find((c) => c.textContent?.includes("Engineering"));
    expect(engineering?.querySelector(".st-expand-icon-container")).not.toBeNull();
  });

  it("shows expandable skeletons after update({ isLoading: true })", async () => {
    const host = mount(false);
    await wait(80);
    expect(host.textContent).toContain("Engineering");

    table!.update({ isLoading: true });
    await wait(150);

    const nameCells = host.querySelectorAll('.st-cell[data-accessor="name"]');
    expect(nameCells.length).toBeGreaterThan(0);
    nameCells.forEach((cell) => {
      expect(cell.querySelector(".st-loading-skeleton")).not.toBeNull();
    });
  });
});
