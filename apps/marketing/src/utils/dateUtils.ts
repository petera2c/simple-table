/**
 * Utility functions for safe date handling
 */

/**
 * Creates a safe Date object from various input types
 * @param input - Date input (string, number, Date, or null/undefined)
 * @returns A valid Date object, defaults to current date if input is invalid
 */
export const createSafeDate = (input?: string | number | Date | null): Date => {
  if (!input) return new Date();

  if (typeof input === "string") {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  if (typeof input === "number") {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? new Date() : input;
  }

  return new Date();
};

/**
 * Creates a date with year, month, and day parameters safely
 * @param year - Year (e.g., 2024)
 * @param month - Month (0-11, where 0 = January)
 * @param day - Day of month (1-31)
 * @returns A valid Date object
 */
export const createDate = (year: number, month: number, day: number): Date => {
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? new Date() : date;
};

/**
 * Adds days to a date safely
 * @param date - Base date
 * @param days - Number of days to add (can be negative)
 * @returns New Date object with days added
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Adds months to a date safely
 * @param date - Base date
 * @param months - Number of months to add (can be negative)
 * @returns New Date object with months added
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Adds years to a date safely
 * @param date - Base date
 * @param years - Number of years to add (can be negative)
 * @returns New Date object with years added
 */
export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

/**
 * Formats a date to ISO string (YYYY-MM-DD format)
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Gets a random date within a range
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns Random date within the range
 */
export const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
};
