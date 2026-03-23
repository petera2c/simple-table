/**
 * Vanilla equivalent of React NestedGridRow: renders a full-width row that contains
 * a nested SimpleTable when a row has nestedTable config (expandable + nestedTable headers).
 */

import type TableRow from "../types/TableRow";
import type Row from "../types/Row";
import type { CustomTheme } from "../types/CustomTheme";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";
import { getNestedValue } from "./rowUtils";
import {
  calculateNestedTableHeight,
  calculateFinalNestedGridHeight,
} from "./rowUtils";
import { calculateRowTopPosition, type HeightOffsets } from "./infiniteScrollUtils";
import { SimpleTableVanilla } from "../core/SimpleTableVanilla";

export interface NestedGridRowRenderContext {
  rowHeight: number;
  heightOffsets: HeightOffsets | undefined;
  customTheme: CustomTheme;
  theme?: string;
  rowGrouping?: (string | number)[];
  depth: number;
  loadingStateRenderer?: SimpleTableConfig["loadingStateRenderer"];
  errorStateRenderer?: SimpleTableConfig["errorStateRenderer"];
  emptyStateRenderer?: SimpleTableConfig["emptyStateRenderer"];
  icons?: SimpleTableConfig["icons"];
}

/**
 * Creates a nested grid row element: a div with class "st-row st-nested-grid-row"
 * that contains a nested SimpleTableVanilla instance.
 * Returns the row element and a cleanup function to destroy the nested table.
 */
export function createNestedGridRow(
  tableRow: TableRow,
  context: NestedGridRowRenderContext,
): { element: HTMLElement; cleanup: () => void } {
  const { nestedTable } = tableRow;
  if (!nestedTable) {
    throw new Error("createNestedGridRow called without tableRow.nestedTable");
  }

  const {
    rowHeight,
    heightOffsets,
    customTheme,
    theme,
    rowGrouping,
    depth,
    loadingStateRenderer,
    errorStateRenderer,
    emptyStateRenderer,
    icons,
  } = context;

  const { parentRow, expandableHeader, childAccessor, calculatedHeight } = nestedTable;
  const nestedGridConfig = expandableHeader.nestedTable;
  if (!nestedGridConfig) {
    throw new Error("createNestedGridRow: expandableHeader.nestedTable is missing");
  }

  const childData = getNestedValue(parentRow, childAccessor);
  const childRows: Row[] = Array.isArray(childData) ? (childData as Row[]) : [];

  const nextLevelGrouping = rowGrouping && rowGrouping[depth + 1];
  const childRowGrouping = nextLevelGrouping ? rowGrouping!.slice(depth + 1) : undefined;

  const nestedCustomTheme = nestedGridConfig.customTheme
    ? { ...customTheme, ...nestedGridConfig.customTheme }
    : customTheme;

  const tableHeight = calculateNestedTableHeight({
    calculatedHeight,
    customHeight: nestedGridConfig.height,
    customTheme,
  });

  const wrapperHeight = calculateFinalNestedGridHeight({
    calculatedHeight,
    customHeight: nestedGridConfig.height,
    customTheme,
  });

  const topPosition = calculateRowTopPosition({
    position: tableRow.position,
    rowHeight,
    heightOffsets,
    customTheme,
  });

  const rowElement = document.createElement("div");
  rowElement.className = "st-row st-nested-grid-row";
  rowElement.dataset.index = String(tableRow.position);
  rowElement.style.position = "absolute";
  rowElement.style.left = "0";
  rowElement.style.right = "0";
  rowElement.style.transform = `translate3d(0, ${topPosition}px, 0)`;
  rowElement.style.height = `${wrapperHeight}px`;
  rowElement.style.paddingTop = `${customTheme.nestedGridPaddingTop}px`;
  rowElement.style.paddingBottom = `${customTheme.nestedGridPaddingBottom}px`;
  rowElement.style.paddingLeft = `${customTheme.nestedGridPaddingLeft}px`;
  rowElement.style.paddingRight = `${customTheme.nestedGridPaddingRight}px`;
  rowElement.style.boxSizing = "border-box";

  const innerContainer = document.createElement("div");
  innerContainer.style.height = "100%";
  innerContainer.style.width = "100%";
  rowElement.appendChild(innerContainer);

  const nestedConfig: SimpleTableConfig = {
    ...nestedGridConfig,
    defaultHeaders: nestedGridConfig.defaultHeaders,
    rows: childRows,
    theme: theme as SimpleTableConfig["theme"],
    customTheme: nestedCustomTheme,
    height: tableHeight,
    rowGrouping: childRowGrouping as SimpleTableConfig["rowGrouping"],
    loadingStateRenderer,
    errorStateRenderer,
    emptyStateRenderer,
    icons,
  };

  const nestedTableInstance = new SimpleTableVanilla(innerContainer, nestedConfig);
  nestedTableInstance.mount();

  const cleanup = (): void => {
    nestedTableInstance.destroy();
  };

  (rowElement as HTMLElement & { __nestedTableCleanup?: () => void }).__nestedTableCleanup = cleanup;

  return { element: rowElement, cleanup };
}

/**
 * Creates a spacer row for pinned sections: same position/height as a nested grid row
 * but no inner table (keeps scroll height in sync).
 */
export function createNestedGridSpacer(
  tableRow: TableRow,
  context: Pick<
    NestedGridRowRenderContext,
    "rowHeight" | "heightOffsets" | "customTheme"
  >,
): HTMLElement {
  const { nestedTable } = tableRow;
  if (!nestedTable) {
    throw new Error("createNestedGridSpacer called without tableRow.nestedTable");
  }

  const nestedGridConfig = tableRow.nestedTable!.expandableHeader.nestedTable;
  const wrapperHeight = calculateFinalNestedGridHeight({
    calculatedHeight: nestedTable.calculatedHeight,
    customHeight: nestedGridConfig?.height,
    customTheme: context.customTheme,
  });

  const topPosition = calculateRowTopPosition({
    position: tableRow.position,
    rowHeight: context.rowHeight,
    heightOffsets: context.heightOffsets,
    customTheme: context.customTheme,
  });

  const spacer = document.createElement("div");
  spacer.className = "st-row st-nested-grid-spacer";
  spacer.dataset.index = String(tableRow.position);
  spacer.style.position = "absolute";
  spacer.style.left = "0";
  spacer.style.right = "0";
  spacer.style.transform = `translate3d(0, ${topPosition}px, 0)`;
  spacer.style.height = `${wrapperHeight}px`;
  spacer.style.pointerEvents = "none";

  return spacer;
}
