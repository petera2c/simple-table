import {
  TABLE_HEADER_CELL_WIDTH_DEFAULT,
  CHART_COLUMN_TYPES,
  OPTIMAL_CHART_COLUMN_WIDTH,
} from "../consts/general-consts";
import { MIN_COLUMN_WIDTH } from "../consts/column-constraints";
import HeaderObject, { Accessor, DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import type { Pinned } from "../types/Pinned";
import { getCellId } from "./cellUtils";
import { getNestedValue } from "./rowUtils";
import { findParentHeader } from "./collapseUtils";

/**
 * Find all leaf headers (headers without children) in a header tree
 * Takes collapsed state into account - when a header is collapsed, only returns
 * children that are visible when parent is collapsed (showWhen is 'parentCollapsed' or 'always')
 */
export const findLeafHeaders = (
  header: HeaderObject,
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  // Skip hidden headers
  if (header.hide) {
    return [];
  }

  if (!header.children || header.children.length === 0) {
    return [header];
  }

  // If this header is collapsed, only return children that are visible when collapsed
  if (collapsedHeaders && collapsedHeaders.has(header.accessor)) {
    const visibleWhenCollapsed = header.children.filter((child) => {
      const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
      return showWhen === "parentCollapsed" || showWhen === "always";
    });
    // singleRowChildren: the parent is always a leaf (has its own column). When collapsed, also include visible children.
    if (header.singleRowChildren) {
      if (visibleWhenCollapsed.length === 0) {
        return [header];
      }
      return [
        header,
        ...visibleWhenCollapsed.flatMap((child) => findLeafHeaders(child, collapsedHeaders)),
      ];
    }
    if (visibleWhenCollapsed.length === 0) {
      return [header];
    }
    return visibleWhenCollapsed.flatMap((child) =>
      findLeafHeaders(child, collapsedHeaders),
    );
  }

  // If not collapsed, return leaf headers that are visible when parent is expanded
  const visibleWhenExpanded = header.children.filter((child) => {
    const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
    return showWhen === "parentExpanded" || showWhen === "always";
  });
  // singleRowChildren: parent + children are all "leaves" on the same row (e.g. Quarterly Sales + Q1–Q4)
  if (header.singleRowChildren) {
    return [
      header,
      ...visibleWhenExpanded.flatMap((child) =>
        findLeafHeaders(child, collapsedHeaders),
      ),
    ];
  }
  return visibleWhenExpanded.flatMap((child) =>
    findLeafHeaders(child, collapsedHeaders),
  );
};

/** Default pixel width for 1fr when converting before container width is known */
export const DEFAULT_FR_PX = 150;

/** Default total table width used when normalizing fr/% if container width unknown */
export const DEFAULT_TABLE_WIDTH = 800;

type WidthSpec = { type: "px"; value: number } | { type: "fr"; value: number } | { type: "pct"; value: number };

function parseWidthSpec(header: HeaderObject): WidthSpec | null {
  if (header.hide) return null;
  if (typeof header.width === "number") return { type: "px", value: header.width };
  if (typeof header.width !== "string") return null;
  const s = header.width.trim();
  if (s.endsWith("px")) return { type: "px", value: parseFloat(s) || 0 };
  if (s.endsWith("fr")) return { type: "fr", value: parseFloat(s) || 1 };
  if (s.endsWith("%")) return { type: "pct", value: parseFloat(s) || 0 };
  return null;
}

/**
 * Recursively collect leaf headers (no children) in expanded state.
 * Used for width normalization when collapsed state is not yet relevant.
 */
function getLeafHeadersForNormalization(headers: HeaderObject[]): HeaderObject[] {
  const leaves: HeaderObject[] = [];
  const visit = (h: HeaderObject): void => {
    if (h.hide) return;
    if (!h.children || h.children.length === 0) {
      leaves.push(h);
      return;
    }
    h.children.forEach(visit);
  };
  headers.forEach(visit);
  return leaves;
}

/** Get the pinned value from the root header (for nested headers, children inherit from parent). */
function getRootPinned(header: HeaderObject, headers: HeaderObject[]): Pinned | undefined {
  if (header.pinned) return header.pinned;
  const parent = findParentHeader(headers, header.accessor);
  return parent ? getRootPinned(parent, headers) : undefined;
}

/** Split headers into left, main, right by root pinned. */
function splitHeadersBySection(headers: HeaderObject[]): {
  left: HeaderObject[];
  main: HeaderObject[];
  right: HeaderObject[];
} {
  const left: HeaderObject[] = [];
  const main: HeaderObject[] = [];
  const right: HeaderObject[] = [];
  headers.forEach((h) => {
    if (h.hide) return;
    const pinned = getRootPinned(h, headers);
    if (pinned === "left") left.push(h);
    else if (pinned === "right") right.push(h);
    else main.push(h);
  });
  return { left, main, right };
}

/**
 * Build a width map for a section's leaves given a total width.
 * Used so we can normalize main section to container width after left/right are sized.
 */
function buildSectionWidthMap(
  leaves: HeaderObject[],
  total: number,
): Map<string, number> {
  const specs = leaves.map((h) => parseWidthSpec(h));
  const fixedSum = specs.reduce(
    (sum, s) => (s?.type === "px" ? sum + s.value : sum),
    0,
  );
  const pctSum = specs.reduce(
    (sum, s) => (s?.type === "pct" ? sum + s.value : sum),
    0,
  );
  const pctPx = total * (pctSum / 100);
  const frTotal = specs.reduce(
    (sum, s) => (s?.type === "fr" ? sum + s.value : sum),
    0,
  );
  const remainingForFr = Math.max(0, total - fixedSum - pctPx);
  const pxPerFr = frTotal > 0 ? remainingForFr / frTotal : DEFAULT_FR_PX;

  const widthMap = new Map<string, number>();
  leaves.forEach((h, i) => {
    const spec = specs[i];
    if (!spec) {
      widthMap.set(h.accessor as string, TABLE_HEADER_CELL_WIDTH_DEFAULT);
      return;
    }
    if (spec.type === "px") widthMap.set(h.accessor as string, spec.value);
    else if (spec.type === "fr") {
      const frAssigned = spec.value * pxPerFr;
      const minW =
        typeof h.minWidth === "number"
          ? h.minWidth
          : typeof h.minWidth === "string"
            ? parseFloat(String(h.minWidth)) || 0
            : 0;
      const width = minW > 0 ? Math.max(frAssigned, minW) : frAssigned;
      widthMap.set(h.accessor as string, width);
    } else if (spec.type === "pct")
      widthMap.set(h.accessor as string, (total * spec.value) / 100);
    else
      widthMap.set(h.accessor as string, TABLE_HEADER_CELL_WIDTH_DEFAULT);
  });
  return widthMap;
}

function sumWidthMap(map: Map<string, number>): number {
  let sum = 0;
  map.forEach((w) => (sum += w));
  return sum;
}

/**
 * Normalize header widths so that fr and % are converted to pixels.
 * Call this as soon as headers are received so the rest of the code can assume numeric widths.
 * If totalWidth is not provided, a reasonable total is computed from fixed widths + default for fr columns.
 * If options.containerWidth is provided, the main section's fr columns are given the remaining space
 * (container width minus pinned left/right), so the flexible column fills available space.
 */
export function normalizeHeaderWidths(
  headers: HeaderObject[],
  totalWidthOrOptions?: number | { containerWidth: number },
): HeaderObject[] {
  const containerWidth =
    typeof totalWidthOrOptions === "object" && totalWidthOrOptions != null
      ? totalWidthOrOptions.containerWidth
      : undefined;
  let totalWidth =
    typeof totalWidthOrOptions === "number" ? totalWidthOrOptions : undefined;

  let widthMap: Map<string, number>;

  if (containerWidth != null && containerWidth > 0) {
    const { left, main, right } = splitHeadersBySection(headers);
    const leftLeaves = getLeafHeadersForNormalization(left);
    const rightLeaves = getLeafHeadersForNormalization(right);
    const mainLeaves = getLeafHeadersForNormalization(main);

    const leftSpecs = leftLeaves.map((h) => parseWidthSpec(h));
    const rightSpecs = rightLeaves.map((h) => parseWidthSpec(h));
    const mainSpecs = mainLeaves.map((h) => parseWidthSpec(h));

    const defaultTotalForSection = (specs: (WidthSpec | null)[]): number => {
      const fixedSum = specs.reduce(
        (sum, s) => (s?.type === "px" ? sum + s.value : sum),
        0,
      );
      const frCount = specs.filter((s) => s?.type === "fr").length;
      const pctCount = specs.filter((s) => s?.type === "pct").length;
      let t =
        fixedSum +
        (frCount > 0 ? frCount * DEFAULT_FR_PX : 0) +
        (pctCount > 0 ? DEFAULT_TABLE_WIDTH * 0.2 : 0);
      return Math.max(t, DEFAULT_TABLE_WIDTH);
    };

    const leftTotal = defaultTotalForSection(leftSpecs);
    const rightTotal = defaultTotalForSection(rightSpecs);
    const leftMap = buildSectionWidthMap(leftLeaves, leftTotal);
    const rightMap = buildSectionWidthMap(rightLeaves, rightTotal);
    const leftWidth = sumWidthMap(leftMap);
    const rightWidth = sumWidthMap(rightMap);
    const mainSectionWidth = Math.max(0, containerWidth - leftWidth - rightWidth);
    const mainTotal =
      mainLeaves.length > 0 ? mainSectionWidth : 0;
    const mainMap =
      mainLeaves.length > 0
        ? buildSectionWidthMap(mainLeaves, mainTotal)
        : new Map<string, number>();

    widthMap = new Map<string, number>();
    leftMap.forEach((w, k) => widthMap.set(k, w));
    rightMap.forEach((w, k) => widthMap.set(k, w));
    mainMap.forEach((w, k) => widthMap.set(k, w));
  } else {
    const leaves = getLeafHeadersForNormalization(headers);
    const specs = leaves.map((h) => parseWidthSpec(h));

    let total = totalWidth;
    if (total == null || total <= 0) {
      const fixedSum = specs.reduce(
        (sum, s) => (s?.type === "px" ? sum + s.value : sum),
        0,
      );
      const frCount = specs.filter((s) => s?.type === "fr").length;
      const pctCount = specs.filter((s) => s?.type === "pct").length;
      total =
        fixedSum +
        (frCount > 0 ? frCount * DEFAULT_FR_PX : 0) +
        (pctCount > 0 ? DEFAULT_TABLE_WIDTH * 0.2 : 0);
      total = Math.max(total, DEFAULT_TABLE_WIDTH);
    }

    widthMap = buildSectionWidthMap(leaves, total);
  }

  function process(h: HeaderObject): HeaderObject {
    const next = { ...h };
    if (h.children && h.children.length > 0) {
      next.children = h.children.map(process);
      return next;
    }
    const px = widthMap.get(h.accessor as string);
    if (px != null) next.width = px;
    return next;
  }
  return headers.map(process);
}

/**
 * Get actual width of a header in pixels
 */
export const getHeaderWidthInPixels = (header: HeaderObject): number => {
  // Skip hidden headers
  if (header.hide) {
    return 0;
  }

  // If width is a number, use it directly
  if (typeof header.width === "number") {
    return header.width;
  }
  // If width is a string that ends with "px", parse it
  else if (typeof header.width === "string" && header.width.endsWith("px")) {
    return parseFloat(header.width);
  }
  // For fr, %, or any other format, get the actual DOM element width
  else {
    const cellElement = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    );
    return cellElement?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }
};

/**
 * Convert fractional widths to pixel values
 */
export const removeAllFractionalWidths = (header: HeaderObject): void => {
  const headerWidth = header.width;
  if (typeof headerWidth === "string" && headerWidth.includes("fr")) {
    header.width =
      document.getElementById(getCellId({ accessor: header.accessor, rowId: "header" }))
        ?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }
  if (header.children && header.children.length > 0) {
    header.children.forEach((child) => {
      removeAllFractionalWidths(child);
    });
  }
};

/**
 * Calculate the minimum width for a header
 */
export const getHeaderMinWidth = (header: HeaderObject): number => {
  return typeof header.minWidth === "number" ? header.minWidth : MIN_COLUMN_WIDTH;
};

/**
 * Get all visible leaf headers from an array of headers
 */
export const getAllVisibleLeafHeaders = (
  headers: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  const leafHeaders: HeaderObject[] = [];
  headers.forEach((header) => {
    if (!header.hide) {
      leafHeaders.push(...findLeafHeaders(header, collapsedHeaders));
    }
  });
  return leafHeaders;
};

/**
 * Convert pixel-based widths to proportional fr units
 * This is used when autoExpandColumns is enabled
 */
export const convertPixelWidthsToFr = (
  headers: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  const processHeader = (header: HeaderObject): HeaderObject => {
    // Process children recursively first
    const processedChildren = header.children?.map(processHeader);

    const pixelWidth = getHeaderWidthInPixels(header);
    const minWidth = header.minWidth || pixelWidth;

    // Convert px to fr (divide by 10 to get reasonable fr values)
    // e.g., 100px -> 10fr, 150px -> 15fr
    const frValue = pixelWidth / 10;

    return {
      ...header,
      width: `${frValue}fr`,
      minWidth: typeof minWidth === "number" ? minWidth : parseFloat(minWidth),
      children: processedChildren,
      __originalPixelWidth: pixelWidth, // Store original for reference
    } as HeaderObject & { __originalPixelWidth?: number };
  };

  return headers.map(processHeader);
};

/**
 * Calculate the optimal width for a column by measuring both header and cell content
 * This is used for auto-sizing columns to fit their content (like Excel/Google Sheets)
 *
 * @param accessor - The accessor of the header to measure
 * @param options - Configuration options
 * @returns The optimal width in pixels
 */
export const calculateHeaderContentWidth = (
  accessor: Accessor,
  options?: {
    rows?: any[]; // Array of row data to sample
    header?: HeaderObject; // Header object for valueFormatter/valueGetter
    maxWidth?: number; // Maximum width (default: 500px)
    sampleSize?: number; // Number of rows to sample (default: 50)
  },
): number => {
  const { rows, header, maxWidth = 500, sampleSize = 50 } = options || {};
  // Get the header cell element from the DOM
  const headerCellElement = document.getElementById(getCellId({ accessor, rowId: "header" }));

  if (!headerCellElement) {
    return TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }

  // Get the computed styles to access padding and gap
  const computedStyle = window.getComputedStyle(headerCellElement);
  const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
  const gap = parseFloat(computedStyle.gap) || 0;

  // Initialize total width with padding
  let totalWidth = paddingLeft + paddingRight;

  // Measure the actual text content width
  const headerLabelElement = headerCellElement.querySelector(".st-header-label") as HTMLElement;
  if (headerLabelElement) {
    const textSpan = headerLabelElement.querySelector(".st-header-label-text") as HTMLElement;
    if (textSpan) {
      // Create a temporary element to measure the actual text width
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.style.width = "auto";

      // Copy all computed styles from the original span
      const textStyle = window.getComputedStyle(textSpan);
      tempSpan.style.font = textStyle.font;
      tempSpan.style.fontSize = textStyle.fontSize;
      tempSpan.style.fontWeight = textStyle.fontWeight;
      tempSpan.style.fontFamily = textStyle.fontFamily;
      tempSpan.style.letterSpacing = textStyle.letterSpacing;
      tempSpan.style.padding = textStyle.padding;

      tempSpan.textContent = textSpan.textContent;

      document.body.appendChild(tempSpan);
      const actualTextWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      totalWidth += actualTextWidth;
    }
  }

  // Loop through all direct children to measure icons
  const children = Array.from(headerCellElement.children);
  let visibleItemCount = 1; // Start with 1 for the text we already measured

  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;

    // Skip the header label (we already measured its text)
    if (child.classList.contains("st-header-label")) {
      continue;
    }

    // Don't skip the resize handle - it contributes to the content width
    // (even though it's positioned, it still takes up visual space)

    // Skip screen reader only elements (visually hidden)
    if (child.classList.contains("st-sr-only")) {
      continue;
    }

    // Get the computed styles for this child
    const childStyle = window.getComputedStyle(child);

    // Skip if display is none
    if (childStyle.display === "none") {
      continue;
    }

    // Get the width of the child element (icons)
    const childWidth = child.offsetWidth || 0;

    // Get margins
    const marginLeft = parseFloat(childStyle.marginLeft) || 0;
    const marginRight = parseFloat(childStyle.marginRight) || 0;

    // Add child width and margins to total
    totalWidth += childWidth + marginLeft + marginRight;
    visibleItemCount++;
  }

  // Add gaps between items (n-1 gaps for n items)
  if (gap > 0 && visibleItemCount > 1) {
    const gapTotal = gap * (visibleItemCount - 1);
    totalWidth += gapTotal;
  }

  // Now measure cell content widths from row data
  let maxCellWidth = 0;

  // For chart columns, skip cell content measurement and use a minimum width
  const isChartColumn = header && header.type && CHART_COLUMN_TYPES.includes(header.type as any);

  if (rows && rows.length > 0 && !isChartColumn) {
    // Sample rows for performance
    const rowsToSample = Math.min(rows.length, sampleSize);

    // Create a temporary element to measure text
    const tempDiv = document.createElement("div");
    tempDiv.style.visibility = "hidden";
    tempDiv.style.position = "absolute";
    tempDiv.style.whiteSpace = "nowrap";
    tempDiv.style.width = "auto";

    // Copy font styles from a sample cell content span
    let cellPaddingLeft = 0;
    let cellPaddingRight = 0;
    const sampleCellContent = document.querySelector(".st-cell-content") as HTMLElement;
    if (sampleCellContent) {
      const cellStyle = window.getComputedStyle(sampleCellContent);
      tempDiv.style.font = cellStyle.font;
      tempDiv.style.fontSize = cellStyle.fontSize;
      tempDiv.style.fontFamily = cellStyle.fontFamily;
      // Get padding from the cell content span
      cellPaddingLeft = parseFloat(cellStyle.paddingLeft) || 0;
      cellPaddingRight = parseFloat(cellStyle.paddingRight) || 0;
    }

    document.body.appendChild(tempDiv);

    for (let i = 0; i < rowsToSample; i++) {
      const row = rows[i];

      // Get the value using valueGetter if available, otherwise use accessor
      let value;
      if (header?.valueGetter) {
        value = header.valueGetter({ accessor, row, rowIndex: i });
      } else {
        // Use getNestedValue to support nested accessors like "user.name"
        value = getNestedValue(row, accessor);
      }

      // Format the value if valueFormatter is available
      let displayValue = value;
      if (header?.valueFormatter && value !== null && value !== undefined) {
        displayValue = header.valueFormatter({
          accessor,
          colIndex: 0,
          row,
          rowIndex: i,
          value,
        });
      }

      // Convert to string for measurement
      const textContent = displayValue != null ? String(displayValue) : "";

      // Measure the text width
      tempDiv.textContent = textContent;
      const textWidth = tempDiv.offsetWidth;

      // Add cell padding to get total cell width
      const cellWidth = textWidth + cellPaddingLeft + cellPaddingRight;

      if (cellWidth > maxCellWidth) {
        maxCellWidth = cellWidth;
      }
    }

    document.body.removeChild(tempDiv);
  }

  // Use the larger of header width or max cell width
  let optimalWidth = Math.max(totalWidth, maxCellWidth);

  // For chart columns, apply a minimum width
  if (isChartColumn) {
    optimalWidth = Math.max(optimalWidth, OPTIMAL_CHART_COLUMN_WIDTH);
  }

  // Apply max width constraint
  if (optimalWidth > maxWidth) {
    optimalWidth = maxWidth;
  }

  // Add a small buffer to account for rounding and browser rendering differences
  const buffer = 2;

  return optimalWidth + buffer;
};
