import {
  TABLE_HEADER_CELL_WIDTH_DEFAULT,
  CHART_COLUMN_TYPES,
  OPTIMAL_CHART_COLUMN_WIDTH,
} from "../consts/general-consts";
import { MIN_COLUMN_WIDTH } from "../consts/column-constraints";
import HeaderObject, { Accessor, DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import { getCellId } from "./cellUtils";
import { getNestedValue } from "./rowUtils";

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
    return header.children
      .filter((child) => {
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        return showWhen === "parentCollapsed" || showWhen === "always";
      })
      .flatMap((child) => findLeafHeaders(child, collapsedHeaders));
  }

  // If not collapsed, return leaf headers that are visible when parent is expanded
  return header.children
    .filter((child) => {
      const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
      return showWhen === "parentExpanded" || showWhen === "always";
    })
    .flatMap((child) => findLeafHeaders(child, collapsedHeaders));
};

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
