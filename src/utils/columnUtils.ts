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
    return `minmax(${minWidth}, ${width})`;
  }

  return width;
};

export const createGridTemplateColumns = ({
  headers,
  hiddenColumns,
}: {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
}) => {
  return `${headers
    .filter((header) => hiddenColumns[header.accessor] !== true)
    .map((header) => getColumnWidth(header))
    .join(" ")}`;
};
