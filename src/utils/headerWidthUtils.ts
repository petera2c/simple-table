import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../consts/general-consts";
import HeaderObject, { Accessor, DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import { getCellId } from "./cellUtils";

/**
 * Find all leaf headers (headers without children) in a header tree
 * Takes collapsed state into account - when a header is collapsed, only returns
 * children that are visible when parent is collapsed (showWhen is 'parentCollapsed' or 'always')
 */
export const findLeafHeaders = (
  header: HeaderObject,
  collapsedHeaders?: Set<Accessor>
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
      getCellId({ accessor: header.accessor, rowId: "header" })
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
  return typeof header.minWidth === "number" ? header.minWidth : 40;
};

/**
 * Get all visible leaf headers from an array of headers
 */
export const getAllVisibleLeafHeaders = (
  headers: HeaderObject[],
  collapsedHeaders?: Set<Accessor>
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
  collapsedHeaders?: Set<Accessor>
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
      minWidth: typeof minWidth === "number" ? minWidth : parseFloat(minWidth as string),
      children: processedChildren,
      __originalPixelWidth: pixelWidth, // Store original for reference
    } as HeaderObject & { __originalPixelWidth?: number };
  };

  return headers.map(processHeader);
};
