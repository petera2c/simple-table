import { HeaderObject, Accessor } from "..";
import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../consts/general-consts";
import { getCellId } from "./cellUtils";

/**
 * Find all leaf headers (headers without children) in a header tree
 * Takes collapsed state into account - when a header is collapsed, only returns
 * children that are marked as visibleWhenCollapsed
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
      .filter((child) => child.visibleWhenCollapsed)
      .flatMap((child) => findLeafHeaders(child, collapsedHeaders));
  }

  // If not collapsed, return all leaf headers normally
  return header.children.flatMap((child) => findLeafHeaders(child, collapsedHeaders));
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
