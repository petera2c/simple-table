import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { FlattenedHeader } from "../../types/FlattenedHeader";
import { PanelSection } from "../../types/PanelSection";
export type { FlattenedHeader };
/**
 * Tracks which drop separator is currently highlighted during a column-editor
 * drag. The `index` is **section-relative** (matches the per-section
 * `visualIndex`, or `-1` for the separator above the first row), so it must be
 * paired with the `panelSection` it belongs to. Without the section, the same
 * index is ambiguous across the pinned-left / main / pinned-right lists and the
 * divider renders in the wrong section.
 */
export type HoveredSeparator = {
    panelSection: PanelSection;
    index: number;
} | null;
export declare const findAndMarkParentsVisible: (headers: HeaderObject[], childAccessor: Accessor, visited?: Set<string>) => void;
export declare const areAllChildrenHidden: (children: HeaderObject[]) => boolean;
export declare const updateParentHeaders: (headers: HeaderObject[]) => void;
export declare const buildColumnVisibilityState: (headers: HeaderObject[]) => ColumnVisibilityState;
export declare const findClosestValidSeparatorIndex: ({ flattenedHeaders, draggingRow, hoveredRowIndex, isTopHalfOfRow, }: {
    flattenedHeaders: FlattenedHeader[];
    draggingRow: FlattenedHeader;
    hoveredRowIndex: number;
    isTopHalfOfRow: boolean;
}) => number | null;
