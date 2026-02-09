import { SmartFilterToken } from "../types/QuickFilterTypes";
import { Accessor } from "../types/HeaderObject";

/**
 * Parses a smart filter query into tokens
 * Supports:
 * - Multi-word: "john engineer" → matches rows containing both "john" AND "engineer"
 * - Phrase: "john doe" → matches exact phrase
 * - Negation: -inactive → excludes rows containing "inactive"
 * - Column-specific: name:john → searches only in name column
 */
export const parseSmartFilter = (query: string): SmartFilterToken[] => {
  const tokens: SmartFilterToken[] = [];
  let currentIndex = 0;

  while (currentIndex < query.length) {
    // Skip whitespace
    while (currentIndex < query.length && /\s/.test(query[currentIndex])) {
      currentIndex++;
    }

    if (currentIndex >= query.length) break;

    // Check for negation
    if (query[currentIndex] === "-") {
      currentIndex++; // Skip the '-'
      const start = currentIndex;

      // Read until whitespace or end
      while (currentIndex < query.length && !/\s/.test(query[currentIndex])) {
        currentIndex++;
      }

      const value = query.substring(start, currentIndex);
      if (value) {
        tokens.push({ type: "negation", value });
      }
      continue;
    }

    // Check for phrase (quoted string)
    if (query[currentIndex] === '"') {
      currentIndex++; // Skip opening quote
      const start = currentIndex;

      // Read until closing quote or end
      while (currentIndex < query.length && query[currentIndex] !== '"') {
        currentIndex++;
      }

      const value = query.substring(start, currentIndex);
      if (value) {
        tokens.push({ type: "phrase", value });
      }

      if (currentIndex < query.length && query[currentIndex] === '"') {
        currentIndex++; // Skip closing quote
      }
      continue;
    }

    // Check for column-specific search (column:value)
    const start = currentIndex;
    while (currentIndex < query.length && !/[\s:]/.test(query[currentIndex])) {
      currentIndex++;
    }

    const word = query.substring(start, currentIndex);

    // If we found a colon, this is column-specific
    if (currentIndex < query.length && query[currentIndex] === ":") {
      currentIndex++; // Skip the ':'
      const valueStart = currentIndex;

      // Read the value (until whitespace or end)
      while (currentIndex < query.length && !/\s/.test(query[currentIndex])) {
        currentIndex++;
      }

      const value = query.substring(valueStart, currentIndex);
      if (value) {
        tokens.push({
          type: "columnSpecific",
          value,
          column: word as Accessor,
        });
      }
      continue;
    }

    // Regular word
    if (word) {
      tokens.push({ type: "word", value: word });
    }
  }

  return tokens;
};

/**
 * Checks if a value matches a simple filter (case-insensitive contains)
 */
export const matchesSimpleFilter = (
  value: string,
  filterText: string,
  caseSensitive: boolean,
): boolean => {
  if (!filterText) return true;

  const searchValue = caseSensitive ? value : value.toLowerCase();
  const searchFilter = caseSensitive ? filterText : filterText.toLowerCase();

  return searchValue.includes(searchFilter);
};
