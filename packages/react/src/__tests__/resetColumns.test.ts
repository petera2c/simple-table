import { afterEach, describe, expect, it } from "vitest";
// Tested against the core *source* (not the built dist) — same as the adapter
// tests. resetColumns() must restore the columns exactly as configured in the
// column definitions (all visible except headers defined with `hide: true`),
// regardless of any runtime visibility changes made through the column editor.
import { SimpleTableVanilla } from "simple-table-core";
import type { HeaderObject, SimpleTableConfig } from "simple-table-core";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

let container: HTMLDivElement | null = null;
let instance: SimpleTableVanilla | null = null;

afterEach(() => {
  instance?.destroy();
  instance = null;
  container?.remove();
  container = null;
});

const rows = [
  { id: 1, name: "Alice", score: 10, secret: "a" },
  { id: 2, name: "Bob", score: 20, secret: "b" },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

const makeHeaders = (): HeaderObject[] => [
  { accessor: "name", label: "Name", width: 120, type: "string" },
  { accessor: "score", label: "Score", width: 120, type: "number" },
  // Explicitly configured as hidden in the column definitions — must STAY
  // hidden after resetColumns().
  { accessor: "secret", label: "Secret", width: 120, type: "string", hide: true },
];

function mountTable(defaultHeaders: HeaderObject[]): SimpleTableVanilla {
  container = document.createElement("div");
  document.body.appendChild(container);

  const config: SimpleTableConfig = {
    defaultHeaders,
    rows,
    getRowId,
    height: "250px",
    theme: "light",
    editColumns: true,
    editColumnsInitOpen: true,
  };

  instance = new SimpleTableVanilla(container, config);
  instance.mount();
  return instance;
}

/** Visible header-cell labels currently painted in the table. */
function visibleHeaderLabels(): string[] {
  return Array.from(container!.querySelectorAll(".st-header-label-text")).map(
    (el) => el.textContent ?? "",
  );
}

/** Toggle a column's checkbox in the column editor, like a user would. */
function toggleEditorCheckbox(label: string): void {
  const row = Array.from(container!.querySelectorAll(".st-header-checkbox-item")).find(
    (item) => item.querySelector(".st-column-label-container")?.textContent === label,
  );
  if (!row) throw new Error(`Column editor row for "${label}" not found`);
  const input = row.querySelector<HTMLInputElement>(".st-checkbox-input");
  if (!input) throw new Error(`Checkbox input for "${label}" not found`);
  input.click();
}

describe("resetColumns() — restores the configured column definitions", () => {
  it("makes a user-hidden column visible again (and keeps explicitly-hidden columns hidden)", async () => {
    const table = mountTable(makeHeaders());
    const api = table.getAPI();

    await waitFor(() => visibleHeaderLabels().includes("Score"));
    expect(visibleHeaderLabels()).toEqual(["Name", "Score"]);

    // User hides "Score" through the column editor UI.
    toggleEditorCheckbox("Score");
    await waitFor(() => !visibleHeaderLabels().includes("Score"));

    // Reset must return to the configured defaults: Score visible again,
    // Secret (hide: true in the definitions) still hidden.
    api.resetColumns();

    await waitFor(() => visibleHeaderLabels().includes("Score"));
    expect(visibleHeaderLabels()).toEqual(["Name", "Score"]);
  });

  it("resets reliably even when visibility was hydrated (applyColumnVisibility) before the user toggled columns", async () => {
    const table = mountTable(makeHeaders());
    const api = table.getAPI();

    await waitFor(() => visibleHeaderLabels().includes("Score"));

    // Simulate persisted-settings hydration: a previous session had "Name"
    // hidden, restored programmatically right after mount.
    await api.applyColumnVisibility({ name: false });
    await waitFor(() => !visibleHeaderLabels().includes("Name"));

    // The user later hides "Score" via the editor as well.
    toggleEditorCheckbox("Score");
    await waitFor(() => !visibleHeaderLabels().includes("Score"));

    api.resetColumns();

    // Reset must produce the same well-defined default state no matter what
    // was hydrated or toggled: everything visible except "Secret".
    await waitFor(() => visibleHeaderLabels().includes("Name"));
    expect(visibleHeaderLabels()).toEqual(["Name", "Score"]);
  });
});
