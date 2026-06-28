import type Row from "../../types/Row";
import type TableRow from "../../types/TableRow";
import { CellRenderContext } from "./types";

// WeakMap holding a mutable row + tableRow ref per cell element so click
// handlers (cell click, chevron expand) always read the latest data even when
// the cell DOM node is reused across renders. The chevron handler in
// `createExpandIcon` looks this up via `closest('[data-row-id]')` to avoid
// stale-closure rowIds after sort/filter/reorder reuses the same DOM cell for
// a row whose positional rowId has changed.
//
// Lives in its own leaf module (rather than `styling.ts`) so `expansion.ts`
// can read the live ref without creating an import cycle
// (styling → content → expansion → styling).
export interface CellLiveRef {
  row: Row;
  tableRow: TableRow;
  // Latest render context for this cell. Refreshed every full render so the
  // cell-registry `updateContent` path (driven by `updateData`, e.g. live
  // metric ticks) re-renders content with the CURRENT theme/handlers instead
  // of the context captured when the DOM cell was first created. Without this,
  // a post-mount theme switch is immediately reverted on the next live update
  // because the stale closure re-renders custom cell content with the old theme.
  context: CellRenderContext;
}

export const cellLiveRefMap = new WeakMap<HTMLElement, CellLiveRef>();
