import type HeaderObject from "../../types/HeaderObject";
import type { Accessor } from "../../types/HeaderObject";
import type { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
/**
 * Handler for when resize dragging starts
 */
export declare const handleResizeStart: ({ autoExpandColumns, collapsedHeaders, containerWidth, event, header, headers, mainBodyRef, onColumnWidthChange, onAutoExpandNaturalWidths, reverse, setHeaders, setIsResizing, shrinkFloors, startWidth, }: HandleResizeStartProps) => void;
export type ApplyColumnAutoFitWithAutoExpandParams = {
    collapsedHeaders: Set<Accessor>;
    containerWidth: number;
    getTargetLeafWidth: (leafHeader: HeaderObject) => number;
    header: HeaderObject;
    headerCellElement: HTMLElement | null;
    headers: HeaderObject[];
    mainBodyRef: HandleResizeStartProps["mainBodyRef"];
    /** Persist the auto-fitted column(s)' widths as their natural widths. */
    onAutoExpandNaturalWidths?: (widths: Map<string, number>) => void;
    reverse: boolean;
    /** Natural-width shrink floors (accessor -> px) for compensating neighbors. */
    shrinkFloors?: Map<string, number>;
};
/**
 * Apply a one-shot "fit to content" width for a column while preserving autoExpand
 * compensation (same redistribution rules as dragging the resize handle).
 */
export declare const applyColumnAutoFitWithAutoExpand: ({ header, headers, collapsedHeaders, containerWidth, mainBodyRef, reverse, headerCellElement, getTargetLeafWidth, onAutoExpandNaturalWidths, shrinkFloors, }: ApplyColumnAutoFitWithAutoExpandParams) => void;
