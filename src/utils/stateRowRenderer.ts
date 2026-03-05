// State row renderer with React portal mounting (vanilla JS/TS container + React content)
// Replaces RowStateIndicator.tsx React component

import type TableRowType from "../types/TableRow";
import { calculateRowTopPosition, HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
} from "../types/RowStateRendererProps";

// Use dynamic import to avoid TypeScript errors with react-dom
declare const ReactDOM: any;

export interface StateRowRenderContext {
  index: number;
  gridTemplateColumns: string;
  rowHeight: number;
  heightOffsets: HeightOffsets | undefined;
  customTheme: CustomTheme;
  loadingStateRenderer?: LoadingStateRenderer;
  errorStateRenderer?: ErrorStateRenderer;
  emptyStateRenderer?: EmptyStateRenderer;
}

// Create a state row element with React content mounted via portal
export const createStateRow = (
  tableRow: TableRowType,
  context: StateRowRenderContext,
): HTMLElement => {
  const { position, stateIndicator } = tableRow;

  if (!stateIndicator) {
    throw new Error("createStateRow called without stateIndicator");
  }

  // Create row wrapper
  const rowElement = document.createElement("div");
  rowElement.className = "st-row st-state-row";
  rowElement.dataset.index = String(context.index);

  // Apply positioning
  rowElement.style.gridTemplateColumns = context.gridTemplateColumns;
  rowElement.style.transform = `translate3d(0, ${calculateRowTopPosition({
    position,
    rowHeight: context.rowHeight,
    heightOffsets: context.heightOffsets,
    customTheme: context.customTheme,
  })}px, 0)`;
  rowElement.style.height = `${context.rowHeight}px`;

  // Create cell that spans all columns
  const cellElement = document.createElement("div");
  cellElement.className = "st-cell st-state-row-cell";
  cellElement.style.gridColumn = "1 / -1";
  cellElement.style.padding = "0";

  // Determine which renderer to use
  let reactRenderer: React.ReactNode = null;

  if (stateIndicator.state.loading && context.loadingStateRenderer) {
    reactRenderer = context.loadingStateRenderer;
  } else if (stateIndicator.state.error && context.errorStateRenderer) {
    reactRenderer = context.errorStateRenderer;
  } else if (stateIndicator.state.isEmpty && context.emptyStateRenderer) {
    reactRenderer = context.emptyStateRenderer;
  }

  // If we have a React renderer, mount it using render
  if (reactRenderer) {
    // Lazy load ReactDOM
    const ReactDOMModule = require("react-dom");
    ReactDOMModule.render(reactRenderer, cellElement);
  }

  rowElement.appendChild(cellElement);
  return rowElement;
};

// Cleanup state row by unmounting React content
export const cleanupStateRow = (rowElement: HTMLElement): void => {
  const cellElement = rowElement.querySelector(".st-state-row-cell");
  if (cellElement) {
    // Lazy load ReactDOM
    const ReactDOMModule = require("react-dom");
    ReactDOMModule.unmountComponentAtNode(cellElement);
  }
};
