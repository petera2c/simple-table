import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../../consts/general-consts";
import HeaderObject from "../../types/HeaderObject";
import { getCellId } from "../cellUtils";
import { calculateHeaderContentWidth } from "../headerWidthUtils";
import {
  getHeaderIndexPath,
  getSiblingArray,
  setSiblingArray,
} from "../../managers/DragHandlerManager";
import { handleResizeStart } from "../resizeUtils";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener, throttle } from "./eventTracking";

export const createResizeHandle = (
  header: HeaderObject,
  context: HeaderRenderContext,
  isLastHeader: boolean,
): HTMLElement | null => {
  const { columnResizing } = context;
  const isSelectionColumn =
    header.isSelectionColumn && context.enableRowSelection;

  if (!columnResizing || isSelectionColumn || isLastHeader) return null;

  const resizeContainer = document.createElement("div");
  resizeContainer.className = "st-header-resize-handle-container";
  resizeContainer.setAttribute("role", "separator");
  resizeContainer.setAttribute("aria-label", `Resize ${header.label} column`);
  resizeContainer.setAttribute("aria-orientation", "vertical");

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "st-header-resize-handle";
  resizeContainer.appendChild(resizeHandle);

  const handleMouseDown = (event: MouseEvent) => {
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    )?.offsetWidth;

    throttle(() => {
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: event,
        forceUpdate: context.forceUpdate,
        header,
        headers: context.headers,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: context.reverse,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth ?? TABLE_HEADER_CELL_WIDTH_DEFAULT,
      });
    }, 10);
  };

  addTrackedEventListener(
    resizeContainer,
    "mousedown",
    handleMouseDown as EventListener,
  );

  const handleTouchStart = (event: Event) => {
    const touchEvent = event as globalThis.TouchEvent;
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    )?.offsetWidth;

    throttle(() => {
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: touchEvent as any,
        forceUpdate: context.forceUpdate,
        header,
        headers: context.headers,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: context.reverse,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth ?? TABLE_HEADER_CELL_WIDTH_DEFAULT,
      });
    }, 10);
  };

  addTrackedEventListener(resizeContainer, "touchstart", handleTouchStart);

  const handleDoubleClick = () => {
    const contentWidth = calculateHeaderContentWidth(header.accessor, {
      rows: context.rows,
      header,
      maxWidth: 500,
      sampleSize: 50,
    });

    const path = getHeaderIndexPath(context.headers, header.accessor);
    if (!path) return;

    const siblings = getSiblingArray(context.headers, path);
    const headerIndex = path[path.length - 1];

    const updatedSiblings = siblings.map((h, i) =>
      i === headerIndex ? { ...h, width: contentWidth } : h,
    );

    const updatedHeaders = setSiblingArray(
      context.headers,
      path,
      updatedSiblings,
    );
    context.setHeaders(updatedHeaders);

    if (context.onColumnWidthChange) {
      context.onColumnWidthChange(updatedHeaders);
    }
  };

  addTrackedEventListener(
    resizeContainer,
    "dblclick",
    handleDoubleClick as EventListener,
  );

  return resizeContainer;
};
