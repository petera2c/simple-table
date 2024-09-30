import HeaderObject from "../types/HeaderObject";

export const onSort = (
  headers: HeaderObject[],
  rows: { [key: string]: any }[],
  sortConfig: { key: HeaderObject; direction: string } | null,
  columnIndex: number
) => {
  const key = headers[columnIndex];
  let direction = "ascending";
  if (
    sortConfig &&
    sortConfig.key.accessor === key.accessor &&
    sortConfig.direction === "ascending"
  ) {
    direction = "descending";
  }

  const sortedData = [...rows].sort((a, b) => {
    if (a[key.accessor] < b[key.accessor]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key.accessor] > b[key.accessor]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return { sortedData, newSortConfig: { key, direction } };
};
