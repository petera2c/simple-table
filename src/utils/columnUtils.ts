import HeaderObject, { Accessor } from "../types/HeaderObject";

const getColumnWidth = (header: HeaderObject) => {
  let { minWidth, width } = header;

  if (typeof width === "number") {
    width = `${width}px`;
  }
  if (minWidth && typeof minWidth === "number") {
    minWidth = `${minWidth}px`;
  }
  if (minWidth !== undefined) {
    // If width is in fr units, we need to ensure the minimum is respected
    if (typeof width === "string" && width.endsWith("fr")) {
      return `minmax(${minWidth}, ${width})`;
    }
    // For fixed widths, use max()
    return `max(${minWidth}, ${width})`;
  }
  return width;
};

export const createGridTemplateColumns = ({
  headers,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
}) => {
  // We only care about the leaf headers that are actually visible to create the grid template columns
  const flattenHeaders = ({
    headers,
    flattenedHeaders,
  }: {
    headers: HeaderObject[];
    flattenedHeaders: HeaderObject[];
  }): HeaderObject[] => {
    headers.forEach((header) => {
      if (header.hide) return;

      if (header.children && header.children.length > 0) {
        // If this header is collapsed, show children based on showWhen property
        if (collapsedHeaders && collapsedHeaders.has(header.accessor)) {
          const visibleChildren = header.children.filter(
            (child) => child.showWhen === "parentCollapsed" || child.showWhen === "always"
          );
          if (visibleChildren.length > 0) {
            flattenHeaders({ headers: visibleChildren, flattenedHeaders });
          } else {
            // No visible children when collapsed - use the parent header itself with its own width
            flattenedHeaders.push(header);
          }
        } else {
          // If not collapsed, show children based on showWhen property (parentExpanded or always)
          const childrenToShow = header.children.filter(
            (child) =>
              child.showWhen === "parentExpanded" || child.showWhen === "always" || !child.showWhen
          );
          flattenHeaders({ headers: childrenToShow, flattenedHeaders });
        }
      } else {
        flattenedHeaders.push(header);
      }
    });
    return flattenedHeaders;
  };

  const flattenedHeaders = flattenHeaders({ headers, flattenedHeaders: [] });

  return `${flattenedHeaders.map((header) => getColumnWidth(header)).join(" ")}`;
};
