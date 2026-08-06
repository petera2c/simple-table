/**
 * COLUMN EDITOR PIN SECTION SYNC
 *
 * Regression: pin/unpin that preserves flattened column order
 * ([...left, ...main, ...right]) used to take the visibility-only fast path
 * and leave editor rows in the wrong section (e.g. left-pinned under "Main").
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/53 - Column Editor Pin Section Sync",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Regression tests: column editor rows must move between Pinned Left / Main / Pinned Right when pin side changes, even if flattened accessor order is unchanged.",
      },
    },
  },
};

export default meta;

type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  projects: number;
};

const createData = (): EmployeeRow[] => [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Engineer", projects: 3 },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Designer", projects: 2 },
];

const openColumnEditor = async (canvasElement: HTMLElement): Promise<Element> => {
  const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
  expect(columnEditorText).toBeTruthy();
  (columnEditorText as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 300));
  const popout =
    canvasElement.querySelector(".st-column-editor-popout.open") ??
    canvasElement.querySelector(".st-column-editor-popout");
  expect(popout).toBeTruthy();
  return popout!;
};

const getEditorRowByAccessor = (popout: Element, accessor: string): HTMLElement => {
  const item = popout.querySelector(
    `.st-header-checkbox-item[data-accessor="${accessor}"]`,
  ) as HTMLElement | null;
  expect(item).toBeTruthy();
  return item!;
};

const getEditorRowSection = (item: Element): string | null => {
  const list = item.closest(".st-column-editor-list") as HTMLElement | null;
  return list?.dataset.panelSection ?? null;
};

const getMainSectionAccessors = (popout: Element): string[] => {
  const mainList = popout.querySelector('.st-column-editor-list[data-panel-section="main"]');
  if (!mainList) return [];
  return Array.from(mainList.querySelectorAll<HTMLElement>(".st-header-checkbox-item")).map(
    (el) => el.dataset.accessor ?? "",
  );
};

const clickPinLeft = async (item: HTMLElement) => {
  const btn = Array.from(item.querySelectorAll<HTMLElement>(".st-column-pin-side-option")).find(
    (el) => el.textContent?.trim() === "L",
  );
  expect(btn).toBeTruthy();
  btn!.click();
  await new Promise((r) => setTimeout(r, 500));
};

const clickUnpin = async (item: HTMLElement) => {
  const btn = item.querySelector<HTMLElement>(".st-column-pin-pinned-active");
  expect(btn).toBeTruthy();
  btn!.click();
  await new Promise((r) => setTimeout(r, 500));
};

const defaultHeaders = (): ColumnDef<EmployeeRow>[] => [
  { accessor: "name", label: "Name", width: 140, type: "string", pinned: "left" },
  { accessor: "email", label: "Email", width: 180, type: "string" },
  { accessor: "role", label: "Role", width: 120, type: "string" },
  { accessor: "projects", label: "Projects", width: 100, type: "number", pinned: "right" },
];

/** name left, email first in main — pinning email left keeps flat order identical. */
export const PinAdjacentMainColumnMovesRowToLeftSection = {
  name: "Pin adjacent main column moves editor row to Pinned Left",
  render: () => {
    const { wrapper } = renderVanillaTable(defaultHeaders(), createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "320px",
      enableColumnEditor: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const popout = await openColumnEditor(canvasElement);

    const emailBefore = getEditorRowByAccessor(popout, "email");
    expect(getEditorRowSection(emailBefore)).toBe("main");

    await clickPinLeft(emailBefore);

    // Re-query after pin — row must be under the left section list, not still Main.
    const emailAfter = getEditorRowByAccessor(popout, "email");
    expect(getEditorRowSection(emailAfter)).toBe("left");
    expect(emailAfter.querySelector(".st-column-pin-pinned-active")?.textContent?.trim()).toBe("L");
  },
};

/** Unpinning the sole left column keeps flat order; row must leave Pinned Left at top of Main. */
export const UnpinLeftColumnMovesRowToTopOfMain = {
  name: "Unpin left column moves editor row to top of Main",
  render: () => {
    const { wrapper } = renderVanillaTable(defaultHeaders(), createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "320px",
      enableColumnEditor: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const popout = await openColumnEditor(canvasElement);

    const nameBefore = getEditorRowByAccessor(popout, "name");
    expect(getEditorRowSection(nameBefore)).toBe("left");

    await clickUnpin(nameBefore);

    const nameAfter = getEditorRowByAccessor(popout, "name");
    expect(getEditorRowSection(nameAfter)).toBe("main");
    expect(getMainSectionAccessors(popout)[0]).toBe("name");
  },
};
