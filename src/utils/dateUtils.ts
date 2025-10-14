/**
 * Utility functions for safe date handling to avoid timezone issues
 */

/**
 * Safely parses a date string in YYYY-MM-DD format to a Date object at noon local time
 * This prevents timezone edge cases where midnight UTC becomes the previous day in local time
 */
export const parseDateString = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }

  // For other formats, fall back to standard parsing but create at noon
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return new Date();

  // If the date was parsed successfully, recreate it at noon to avoid timezone issues
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
};

/**
 * Normalizes a date to remove time component for accurate date-only comparison
 * Creates the date at noon to avoid timezone edge cases
 */
export const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
};

/**
 * Safely creates a Date object from various input types
 * Always creates dates at noon local time to avoid timezone issues
 */
export const createSafeDate = (input: string | number | Date | null | undefined): Date => {
  if (!input) return new Date();

  if (typeof input === "string") {
    return parseDateString(input);
  }

  if (typeof input === "number") {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : normalizeDate(date);
  }

  if (input instanceof Date) {
    return normalizeDate(input);
  }

  return new Date();
};
