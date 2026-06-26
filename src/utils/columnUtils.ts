import HeaderObject, {
  Accessor,
  DEFAULT_SHOW_WHEN,
} from "../types/HeaderObject";

export const getColumnWidth = (
  header: HeaderObject,
  autoExpandColumns?: boolean,
) => {
  let { minWidth, width } = header;

  if (typeof width === "number") {
    width = `${width}px`;
  }
  if (minWidth && typeof minWidth === "number") {
    minWidth = `${minWidth}px`;
  }
  // When autoExpandColumns is true, ignore minWidth to prevent horizontal overflow
  if (minWidth !== undefined && !autoExpandColumns) {
    // If width is in fr units, we need to ensure the minimum is respected
    if (typeof width === "string" && width.endsWith("fr")) {
      return `minmax(${minWidth}, ${width})`;
    }
    // For fixed widths, use max()
    return `max(${minWidth}, ${width})`;
  }
  return width;
};

/**
 * Flatten a header tree into the ordered list of leaf (or representative) headers
 * that map 1:1 to the CSS grid tracks produced by {@link createGridTemplateColumns}.
 *
 * This is the single source of truth for column order within a section. Column
 * virtualization relies on it so that the n-th leaf header always corresponds to the
 * n-th grid track, keeping windowed cells correctly positioned via `grid-column`.
 */
export const flattenColumnsForGrid = ({
  headers,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
}): HeaderObject[] => {
  const flattenHeaders = ({
    headers,
    flattenedHeaders,
  }: {
    headers: HeaderObject[];
    flattenedHeaders: HeaderObject[];
  }): HeaderObject[] => {
    headers.forEach((header) => {
      if (header.hide || header.excludeFromRender) return;

      if (header.children && header.children.length > 0) {
        // If this header is collapsed, show children based on showWhen property
        if (collapsedHeaders && collapsedHeaders.has(header.accessor)) {
          const visibleChildren = header.children.filter((child) => {
            const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
            return showWhen === "parentCollapsed" || showWhen === "always";
          });

          // With singleRowChildren, parent always takes up a column
          if (header.singleRowChildren) {
            flattenedHeaders.push(header);
          }

          if (visibleChildren.length > 0) {
            flattenHeaders({ headers: visibleChildren, flattenedHeaders });
          } else if (!header.singleRowChildren) {
            // No visible children when collapsed and NOT singleRowChildren - use the parent header itself with its own width
            flattenedHeaders.push(header);
          }
        } else {
          // If not collapsed, show children based on showWhen property (parentExpanded or always)
          const childrenToShow = header.children.filter((child) => {
            const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
            return showWhen === "parentExpanded" || showWhen === "always";
          });

          // If singleRowChildren is true, the parent also takes up a column
          if (header.singleRowChildren) {
            flattenedHeaders.push(header);
          }

          flattenHeaders({ headers: childrenToShow, flattenedHeaders });
        }
      } else {
        flattenedHeaders.push(header);
      }
    });
    return flattenedHeaders;
  };

  return flattenHeaders({ headers, flattenedHeaders: [] });
};

export const createGridTemplateColumns = ({
  headers,
  collapsedHeaders,
  autoExpandColumns,
}: {
  headers: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
  autoExpandColumns?: boolean;
}) => {
  const flattenedHeaders = flattenColumnsForGrid({ headers, collapsedHeaders });

  return `${flattenedHeaders.map((header) => getColumnWidth(header, autoExpandColumns)).join(" ")}`;
};
