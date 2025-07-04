import HeaderObject from "../types/HeaderObject";

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

export const createGridTemplateColumns = ({ headers }: { headers: HeaderObject[] }) => {
  // We only care about the most children headers to create the grid template columns
  const flattenHeaders = ({
    headers,
    flattenedHeaders,
  }: {
    headers: HeaderObject[];
    flattenedHeaders: HeaderObject[];
  }): HeaderObject[] => {
    headers.forEach((header) => {
      if (header.hide) return;
      if (header.children) {
        flattenHeaders({ headers: header.children, flattenedHeaders });
      } else {
        flattenedHeaders.push(header);
      }
    });
    return flattenedHeaders;
  };

  const flattenedHeaders = flattenHeaders({ headers, flattenedHeaders: [] });

  return `${flattenedHeaders.map((header) => getColumnWidth(header)).join(" ")}`;
};
