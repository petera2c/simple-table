/**
 * Utility functions for safe date handling to avoid timezone issues
 */
/**
 * Safely parses a date string in YYYY-MM-DD format to a Date object at noon local time
 * This prevents timezone edge cases where midnight UTC becomes the previous day in local time
 */
export declare const parseDateString: (dateString: string) => Date;
/**
 * Normalizes a date to remove time component for accurate date-only comparison
 * Creates the date at noon to avoid timezone edge cases
 */
export declare const normalizeDate: (date: Date) => Date;
/**
 * Safely creates a Date object from various input types
 * Always creates dates at noon local time to avoid timezone issues
 */
export declare const createSafeDate: (input: string | number | Date | null | undefined) => Date;
