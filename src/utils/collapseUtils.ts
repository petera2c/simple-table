import HeaderObject, { Accessor, DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import { flattenAllHeaders, flattenHeaders } from "./headerUtils";

/**
 * Find the parent header that contains the given child header
 * Optimized using flattenAllHeaders for better performance
 */
export const findParentHeader = (
  headers: HeaderObject[],
  childAccessor: Accessor
): HeaderObject | null => {
  // Get all headers in the hierarchy
  const allHeaders = flattenAllHeaders(headers);

  // Find the parent by checking each header's direct children
  for (const header of allHeaders) {
    if (header.children && header.children.length > 0) {
      const isDirectParent = header.children.some((child) => child.accessor === childAccessor);
      if (isDirectParent) {
        return header;
      }
    }
  }
  return null;
};

/**
 * Check if a header should be hidden based on its parent's collapsed state
 */
export const shouldHideWhenParentCollapsed = (
  header: HeaderObject,
  headers: HeaderObject[],
  collapsedHeaders: Set<Accessor>
): boolean => {
  const parentHeader = findParentHeader(headers, header.accessor);

  if (parentHeader) {
    const isParentCollapsed = collapsedHeaders.has(parentHeader.accessor);
    const showWhen = header.showWhen || DEFAULT_SHOW_WHEN;

    if (isParentCollapsed) {
      // If parent is collapsed, hide if showWhen is 'parentExpanded'
      return showWhen === "parentExpanded";
    } else {
      // If parent is NOT collapsed, hide if showWhen is 'parentCollapsed'
      return showWhen === "parentCollapsed";
    }
  }

  return false;
};

/**
 * Get all child headers of a parent header (recursively)
 * Uses flattenAllHeaders for consistency and better performance
 */
export const getAllChildHeaders = (header: HeaderObject): HeaderObject[] => {
  if (!header.children || header.children.length === 0) {
    return [];
  }

  // Use the existing flattenAllHeaders utility for consistency
  return flattenAllHeaders(header.children);
};

/**
 * Check if a header has collapsible children
 */
export const hasCollapsibleChildren = (header: HeaderObject): boolean => {
  return Boolean(header.children?.length && header.collapsible);
};

/**
 * Get all leaf (bottom-level) headers that should be visible when a parent is collapsed
 * Uses flattenHeaders for consistent leaf detection
 */
export const getVisibleLeafHeadersWhenCollapsed = (header: HeaderObject): HeaderObject[] => {
  if (!header.children || header.children.length === 0) {
    return [];
  }

  // Get all leaf headers (bottom-level columns)
  const leafHeaders = flattenHeaders(header.children);

  // Return only those marked as visible when collapsed
  return leafHeaders.filter((leafHeader) => {
    const showWhen = leafHeader.showWhen || DEFAULT_SHOW_WHEN;
    return showWhen === "parentCollapsed" || showWhen === "always";
  });
};
