import ColumnDef, { Accessor, DEFAULT_SHOW_WHEN } from "../types/ColumnDef";
import { flattenAllHeaders, flattenHeaders } from "./headerUtils";
import { isHeaderExcludedFromLayout } from "./headerLayoutUtils";

/**
 * Find the parent header that contains the given child header
 * Optimized using flattenAllHeaders for better performance
 */
export const findParentHeader = (
  headers: ColumnDef[],
  childAccessor: Accessor
): ColumnDef | null => {
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
  header: ColumnDef,
  headers: ColumnDef[],
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
 * Check if a header has collapsible children
 */
export const hasCollapsibleChildren = (header: ColumnDef): boolean => {
  return Boolean(header.children?.length && header.collapsible);
};

/**
 * Number of visible leaf (bottom-level) columns a header spans, for
 * `aria-colspan` on grouped/nested header cells. Leaf headers excluded from
 * layout (`hide` / `excludeFromRender`) or suppressed by their parent's
 * collapsed state are omitted so the announced span matches the columns
 * actually rendered. Leaf headers return 1.
 */
export const getHeaderColspan = (
  header: ColumnDef,
  rootHeaders: ColumnDef[],
  collapsedHeaders: Set<Accessor>,
): number => {
  if (!header.children || header.children.length === 0) return 1;
  const leaves = flattenHeaders(header.children);
  let span = 0;
  for (const leaf of leaves) {
    if (isHeaderExcludedFromLayout(leaf)) continue;
    if (shouldHideWhenParentCollapsed(leaf, rootHeaders, collapsedHeaders)) continue;
    span += 1;
  }
  return span;
};
