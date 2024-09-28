export const onSort = (
  headers: string[],
  rows: { [key: string]: any }[],
  sortConfig: { key: string; direction: string } | null,
  columnIndex: number
) => {
  const key = headers[columnIndex];
  let direction = "ascending";
  if (
    sortConfig &&
    sortConfig.key === key &&
    sortConfig.direction === "ascending"
  ) {
    direction = "descending";
  }

  const sortedData = [...rows].sort((a, b) => {
    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return { sortedData, newSortConfig: { key, direction } };
};
