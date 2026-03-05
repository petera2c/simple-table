import type TableRowType from "../types/TableRow";
import { calculateRowTopPosition, HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
} from "../types/RowStateRendererProps";

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

function renderStateContent(
  renderer: LoadingStateRenderer | ErrorStateRenderer | EmptyStateRenderer | undefined,
  props: LoadingStateRendererProps | ErrorStateRendererProps | EmptyStateRendererProps
): HTMLElement | string | null {
  if (!renderer) return null;

  if (typeof renderer === "string") {
    return renderer;
  }

  if (renderer instanceof HTMLElement) {
    return renderer.cloneNode(true) as HTMLElement;
  }

  if (typeof renderer === "function") {
    return renderer(props as any);
  }

  return null;
}

export const createStateRow = (
  tableRow: TableRowType,
  context: StateRowRenderContext,
): HTMLElement => {
  const { position, stateIndicator } = tableRow;

  if (!stateIndicator) {
    throw new Error("createStateRow called without stateIndicator");
  }

  const rowElement = document.createElement("div");
  rowElement.className = "st-row st-state-row";
  rowElement.dataset.index = String(context.index);

  rowElement.style.gridTemplateColumns = context.gridTemplateColumns;
  rowElement.style.transform = `translate3d(0, ${calculateRowTopPosition({
    position,
    rowHeight: context.rowHeight,
    heightOffsets: context.heightOffsets,
    customTheme: context.customTheme,
  })}px, 0)`;
  rowElement.style.height = `${context.rowHeight}px`;

  const cellElement = document.createElement("div");
  cellElement.className = "st-cell st-state-row-cell";
  cellElement.style.gridColumn = "1 / -1";
  cellElement.style.padding = "0";

  let content: HTMLElement | string | null = null;

  if (stateIndicator.state.loading && context.loadingStateRenderer) {
    content = renderStateContent(context.loadingStateRenderer, {
      parentRow: stateIndicator.parentRow,
    });
  } else if (stateIndicator.state.error && context.errorStateRenderer) {
    content = renderStateContent(context.errorStateRenderer, {
      error: stateIndicator.state.error,
      parentRow: stateIndicator.parentRow,
    });
  } else if (stateIndicator.state.isEmpty && context.emptyStateRenderer) {
    content = renderStateContent(context.emptyStateRenderer, {
      message: stateIndicator.state.emptyMessage,
      parentRow: stateIndicator.parentRow,
    });
  }

  if (content) {
    if (typeof content === "string") {
      cellElement.textContent = content;
    } else if (content instanceof HTMLElement) {
      cellElement.appendChild(content);
    }
  }

  rowElement.appendChild(cellElement);
  return rowElement;
};

export const cleanupStateRow = (rowElement: HTMLElement): void => {
  const cellElement = rowElement.querySelector(".st-state-row-cell");
  if (cellElement) {
    cellElement.innerHTML = "";
  }
};
