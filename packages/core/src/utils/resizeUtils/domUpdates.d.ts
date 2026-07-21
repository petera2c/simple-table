import type HeaderObject from "../../types/HeaderObject";
import type { Pinned } from "../../types/Pinned";
/**
 * Get the pinned value from the root header (for nested headers, children inherit from parent)
 */
export declare const getRootPinned: (header: HeaderObject, headers: HeaderObject[]) => Pinned | undefined;
/**
 * Update column widths and positions directly in the DOM without triggering React re-renders
 * This is used during resize drag for better performance
 *
 * IMPORTANT: Positions are calculated per pinned section (left/main/right each start at 0)
 * @param collapsedHeaders - Set of collapsed header accessors; only visible children are laid out (matches findLeafHeaders / SectionRenderer).
 * @param overrideWidths - Optional map of accessor -> width to use for position calculation (e.g. after resize so DOM reflects just-set value)
 */
export declare const updateColumnWidthsInDOM: (headers: HeaderObject[], collapsedHeaders?: Set<string>, overrideWidths?: Map<string, number>) => void;
