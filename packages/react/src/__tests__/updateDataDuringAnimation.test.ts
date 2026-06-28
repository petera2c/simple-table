import { describe, expect, it, vi } from "vitest";
// Tests for `updateData`'s interaction with mid-FLIP cells. Live ticks must not
// re-render a cell while it slides to a new position (jank), but the queued
// value must NOT be dropped — it has to land once the animation settles,
// otherwise "live updates stop after spamming sort".
import { TableAPIImpl, type TableAPIContext } from "../../../core/src/core/api/TableAPIImpl";

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

async function waitFor(predicate: () => boolean, timeoutMs = 1500): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("Timed out waiting for condition");
}

interface RowData {
  id: string;
  price: number;
}

function makeHarness() {
  const updateContent = vi.fn();
  const localRows: RowData[] = [{ id: "r1", price: 1 }];
  const cellRegistry = new Map<string, { updateContent: (value: unknown) => void }>([
    ["r1-price", { updateContent }],
  ]);
  // The cell registry / animation coordinator key both resolve to
  // `${stableRowKey}-${accessor}` => "r1-price".
  const rowsToRender = [{ row: localRows[0], rowId: "r1", stableRowKey: "r1" }];

  const state = { animating: false };

  const context = {
    localRows,
    config: { getRowId: (props: { row: RowData }) => String(props.row.id) },
    cellRegistry,
    isCellAnimating: (cellId: string) => state.animating && cellId === "r1-price",
    getCachedProcessedResult: () => ({ rowsToRender }),
  } as unknown as TableAPIContext;

  const api = TableAPIImpl.createAPI(context);
  return { api, updateContent, localRows, state };
}

describe("updateData — mid-animation cells", () => {
  it("applies the update immediately when the cell is not animating", async () => {
    const { api, updateContent, localRows } = makeHarness();

    api.updateData({ rowIndex: 0, accessor: "price", newValue: 2 });
    await flushMicrotasks();

    expect(updateContent).toHaveBeenCalledWith(2);
    expect(localRows[0].price).toBe(2);
  });

  it("skips the DOM write while animating but still updates the underlying row data", async () => {
    const { api, updateContent, localRows, state } = makeHarness();
    state.animating = true;

    api.updateData({ rowIndex: 0, accessor: "price", newValue: 3 });
    await flushMicrotasks();

    // No jank: the sliding cell's content is not rewritten...
    expect(updateContent).not.toHaveBeenCalled();
    // ...but the row data is already current.
    expect(localRows[0].price).toBe(3);
  });

  it("lands the deferred value once the animation settles (does not drop it)", async () => {
    const { api, updateContent, state } = makeHarness();
    state.animating = true;

    api.updateData({ rowIndex: 0, accessor: "price", newValue: 3 });
    await flushMicrotasks();
    expect(updateContent).not.toHaveBeenCalled();

    // Animation finishes; the queued value must still be applied via retry.
    state.animating = false;
    await waitFor(() => updateContent.mock.calls.length > 0);
    expect(updateContent).toHaveBeenLastCalledWith(3);
  });

  it("coalesces rapid updates to a single latest write after the cell settles", async () => {
    const { api, updateContent, state } = makeHarness();
    state.animating = true;

    api.updateData({ rowIndex: 0, accessor: "price", newValue: 5 });
    api.updateData({ rowIndex: 0, accessor: "price", newValue: 6 });
    await flushMicrotasks();
    expect(updateContent).not.toHaveBeenCalled();

    state.animating = false;
    await waitFor(() => updateContent.mock.calls.length > 0);
    expect(updateContent).toHaveBeenCalledTimes(1);
    expect(updateContent).toHaveBeenCalledWith(6);
  });
});
