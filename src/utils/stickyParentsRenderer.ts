// Vanilla JS sticky parents container renderer
// Replaces StickyParentsContainer.tsx React component

import TableRow from "../types/TableRow";
import HeaderObject from "../types/HeaderObject";
import { COLUMN_EDIT_WIDTH, ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import { createRowSeparator } from "./rowSeparatorRenderer";
import { calculateColumnIndices } from "./columnIndicesUtils";
import { CumulativeHeightMap, HeightOffsets } from "./infiniteScrollUtils";
import { scrollSyncManager } from "./scrollSyncManager";
import { CustomTheme } from "../types/CustomTheme";

export interface StickyParentsContainerProps {
  calculatedHeaderHeight: number;
  heightMap?: CumulativeHeightMap;
  mainTemplateColumns: string;
  partiallyVisibleRows: TableRow[];
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  scrollTop: number;
  scrollbarWidth: number;
  stickyParents: TableRow[];
}

export interface StickyParentsRenderContext {
  collapsedHeaders: Set<string>;
  customTheme: CustomTheme;
  editColumns: boolean;
  headers: HeaderObject[];
  rowHeight: number;
  heightOffsets: HeightOffsets | undefined;
}

// Calculate tree transition offset
const calculateTreeTransitionOffset = (
  stickyParents: TableRow[],
  partiallyVisibleRows: TableRow[],
  heightMap: CumulativeHeightMap | undefined,
  rowHeight: number,
  customTheme: CustomTheme,
  scrollTop: number,
): { treeTransitionOffset: number; offsetStartIndex: number } => {
  if (stickyParents.length === 0) {
    return { treeTransitionOffset: 0, offsetStartIndex: -1 };
  }

  // Find the first parent of the first partially visible row that's in stickyParents
  const firstPartiallyVisibleRow = partiallyVisibleRows[0];
  let stickyParentPosition: number | undefined;

  if (
    firstPartiallyVisibleRow?.parentIndices &&
    firstPartiallyVisibleRow.parentIndices.length > 0
  ) {
    // Check parents from immediate to most distant
    for (let i = firstPartiallyVisibleRow.parentIndices.length - 1; i >= 0; i--) {
      const parentPosition = firstPartiallyVisibleRow.parentIndices[i];

      // Check if this parent is in stickyParents
      if (stickyParents.some((parent) => parent.position === parentPosition)) {
        stickyParentPosition = parentPosition;
        break;
      }
    }
  }

  // Find the index in stickyParents where we should start applying the offset
  const calculatedOffsetStartIndex =
    stickyParentPosition !== undefined
      ? stickyParents.findIndex((parent) => parent.position === stickyParentPosition)
      : -1;

  // Find where a new sibling tree starts (same depth parents)
  let newTreeStartIndex = -1;

  for (let i = 0; i < stickyParents.length; i++) {
    const currentParent = stickyParents[i];
    const nextParent = stickyParents[i + 1];

    if (!nextParent) break;

    if (nextParent.depth === currentParent.depth) {
      newTreeStartIndex = i;
      break;
    } else if (nextParent.depth < currentParent.depth) {
      newTreeStartIndex = stickyParents.findIndex(
        (parent) => parent.depth === currentParent.depth,
      );
      break;
    }
  }

  if (newTreeStartIndex === -1) {
    return { treeTransitionOffset: 0, offsetStartIndex: calculatedOffsetStartIndex };
  }

  const oldTreeParentPosition = stickyParents[newTreeStartIndex]?.position;

  if (oldTreeParentPosition === undefined) {
    return { treeTransitionOffset: 0, offsetStartIndex: calculatedOffsetStartIndex };
  }

  // Count remaining visible rows from the old tree
  let rowsLeftFromOldTree = 0;

  for (const row of partiallyVisibleRows) {
    if (row.parentIndices?.includes(oldTreeParentPosition)) {
      rowsLeftFromOldTree++;
    } else {
      break;
    }
  }

  if (rowsLeftFromOldTree === 0) {
    return { treeTransitionOffset: 0, offsetStartIndex: calculatedOffsetStartIndex };
  }

  const firstRowFromOldTree = partiallyVisibleRows[0];

  // Get row's top position
  let firstRowTopPosition: number;
  if (heightMap) {
    firstRowTopPosition = heightMap.rowTopPositions[firstRowFromOldTree.position];
  } else {
    firstRowTopPosition =
      firstRowFromOldTree.position * (rowHeight + customTheme.rowSeparatorWidth);
  }

  const pixelsScrolledOutOfView = Math.max(0, scrollTop - firstRowTopPosition);
  const parentsFromOldTree = newTreeStartIndex + 1;

  // Offset = freed sticky slots + pixels scrolled out
  const offset = (parentsFromOldTree - rowsLeftFromOldTree) * rowHeight + pixelsScrolledOutOfView;

  return { treeTransitionOffset: -offset, offsetStartIndex: calculatedOffsetStartIndex };
};

// Create a sticky section
const createStickySection = (
  templateColumns: string,
  sectionHeaders: HeaderObject[],
  stickyParents: TableRow[],
  stickyHeight: number,
  offsetStartIndex: number,
  treeTransitionOffset: number,
  rowHeight: number,
  heightOffsets: HeightOffsets | undefined,
  customTheme: CustomTheme,
  pinned?: "left" | "right",
  width?: number,
  scrollSyncGroup?: string,
): HTMLElement => {
  const section = document.createElement("div");
  section.className = pinned ? `st-sticky-section-${pinned}` : "st-sticky-section-main";

  section.style.position = "relative";
  section.style.height = `${stickyHeight}px`;

  if (pinned && width) {
    section.style.width = `${width}px`;
    section.style.flexGrow = "0";
    section.style.flexShrink = "0";
  } else {
    section.style.flexGrow = "1";
  }

  // Render separators
  stickyParents.forEach((tableRow, stickyIndex) => {
    // Only apply offset to this row if it's at or after the offsetStartIndex
    const shouldApplyOffset = offsetStartIndex !== -1 && stickyIndex >= offsetStartIndex;
    const rowOffset = shouldApplyOffset ? treeTransitionOffset : 0;

    // Calculate the Y position for this sticky row's separator
    const separatorTop =
      (stickyIndex + 1) * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH + rowOffset;

    const separator = createRowSeparator(
      separatorTop,
      rowHeight,
      templateColumns,
      false,
      heightOffsets,
      customTheme,
      true,
    );

    section.appendChild(separator);
  });

  // Register with scroll sync manager
  if (scrollSyncGroup) {
    scrollSyncManager.registerPane(section, [scrollSyncGroup]);
  }

  return section;
};

// Create sticky parents container
export const createStickyParentsContainer = (
  props: StickyParentsContainerProps,
  context: StickyParentsRenderContext,
): HTMLElement | null => {
  const { stickyParents } = props;

  if (stickyParents.length === 0) return null;

  // Calculate tree transition offset
  const { treeTransitionOffset, offsetStartIndex } = calculateTreeTransitionOffset(
    stickyParents,
    props.partiallyVisibleRows,
    props.heightMap,
    context.rowHeight,
    context.customTheme,
    props.scrollTop,
  );

  // Calculate column indices
  const columnIndices = calculateColumnIndices({
    headers: context.headers,
    pinnedLeftColumns: props.pinnedLeftColumns,
    pinnedRightColumns: props.pinnedRightColumns,
    collapsedHeaders: context.collapsedHeaders,
  });

  // Calculate total height
  const stickyHeight =
    stickyParents.length > 0
      ? stickyParents.length * (context.rowHeight + ROW_SEPARATOR_WIDTH) + treeTransitionOffset
      : 0;

  // Calculate width accounting for scrollbar
  const containerWidth = `calc(100% - ${props.scrollbarWidth}px - ${
    context.editColumns ? `${COLUMN_EDIT_WIDTH}px` : "0px"
  })`;

  // Create main container
  const container = document.createElement("div");
  container.className = "st-sticky-top";
  container.style.height = `${stickyHeight}px`;
  container.style.width = containerWidth;
  container.style.top = `${props.calculatedHeaderHeight}px`;

  // Get current headers (non-pinned)
  const currentHeaders = context.headers.filter((header) => !header.pinned);

  // Create left pinned section
  if (props.pinnedLeftColumns.length > 0) {
    const leftSection = createStickySection(
      props.pinnedLeftTemplateColumns,
      props.pinnedLeftColumns,
      stickyParents,
      stickyHeight,
      offsetStartIndex,
      treeTransitionOffset,
      context.rowHeight,
      context.heightOffsets,
      context.customTheme,
      "left",
      props.pinnedLeftWidth,
      "pinned-left",
    );
    container.appendChild(leftSection);
  }

  // Create main center section
  const centerSection = createStickySection(
    props.mainTemplateColumns,
    currentHeaders,
    stickyParents,
    stickyHeight,
    offsetStartIndex,
    treeTransitionOffset,
    context.rowHeight,
    context.heightOffsets,
    context.customTheme,
    undefined,
    undefined,
    "default",
  );
  container.appendChild(centerSection);

  // Create right pinned section
  if (props.pinnedRightColumns.length > 0) {
    const rightSection = createStickySection(
      props.pinnedRightTemplateColumns,
      props.pinnedRightColumns,
      stickyParents,
      stickyHeight,
      offsetStartIndex,
      treeTransitionOffset,
      context.rowHeight,
      context.heightOffsets,
      context.customTheme,
      "right",
      props.pinnedRightWidth,
      "pinned-right",
    );
    container.appendChild(rightSection);
  }

  return container;
};

// Cleanup sticky parents container
export const cleanupStickyParentsContainer = (container: HTMLElement): void => {
  // Unregister all sections from scroll sync
  const sections = container.querySelectorAll(
    ".st-sticky-section-left, .st-sticky-section-main, .st-sticky-section-right",
  );

  sections.forEach((section) => {
    if (section instanceof HTMLElement) {
      const groups = scrollSyncManager["getGroupsForPane"]?.(section) || [];
      if (groups.length > 0) {
        scrollSyncManager.unregisterPane(section, groups);
      }
    }
  });

  container.remove();
};
