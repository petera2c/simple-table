import { SmartFilterToken } from "../types/QuickFilterTypes";
/**
 * Parses a smart filter query into tokens
 * Supports:
 * - Multi-word: "john engineer" → matches rows containing both "john" AND "engineer"
 * - Phrase: "john doe" → matches exact phrase
 * - Negation: -inactive → excludes rows containing "inactive"
 * - Column-specific: name:john → searches only in name column
 */
export declare const parseSmartFilter: (query: string) => SmartFilterToken[];
/**
 * Checks if a value matches a simple filter (case-insensitive contains)
 */
export declare const matchesSimpleFilter: (value: string, filterText: string, caseSensitive: boolean) => boolean;
