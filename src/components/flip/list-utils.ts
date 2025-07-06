/**
 * Sorts an array by a specific property
 */
export const sortBy = <T>(array: T[], key: keyof T, direction: "asc" | "desc" = "asc"): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
