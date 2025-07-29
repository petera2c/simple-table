import HeaderObject, { STColumn } from "../types/HeaderObject";

export function generateColumnId<T>(
  header: STColumn<T>,
  path: string[] = [],
  initialIndex: number = 0
): string {
  // Use accessor if available
  if (header.accessor) {
    return String(header.accessor);
  }

  // Generate stable ID from path and label
  const pathPrefix = path.length > 0 ? path.join("-") + "-" : "";
  const labelSlug = header.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${pathPrefix}${labelSlug}-${initialIndex}`;
}
const getColumnWidth = <T>(header: HeaderObject<T>) => {
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

export const createGridTemplateColumns = <T>({ headers }: { headers: HeaderObject<T>[] }) => {
  // We only care about the most children headers to create the grid template columns
  const flattenHeaders = ({
    headers,
    flattenedHeaders,
  }: {
    headers: HeaderObject<T>[];
    flattenedHeaders: HeaderObject<T>[];
  }): HeaderObject<T>[] => {
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
