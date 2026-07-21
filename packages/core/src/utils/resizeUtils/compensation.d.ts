import type HeaderObject from "../../types/HeaderObject";
/**
 * Distribute compensation among columns proportionally based on available headroom
 * Used in autoExpandColumns mode
 * Positive compensation = shrink columns, Negative compensation = grow columns
 *
 * `shrinkFloors` (accessor -> px) sets each column's shrink floor — its natural
 * width (declared, content-measured, or user-set). Columns give up only their
 * surplus (expanded) space and are never squeezed below their natural width.
 * Falls back to MIN_COLUMN_WIDTH when a column has no known floor.
 */
export declare const distributeCompensationProportionally: ({ columnsToShrink, totalCompensation, initialWidthsMap, shrinkFloors, }: {
    columnsToShrink: HeaderObject[];
    totalCompensation: number;
    initialWidthsMap: Map<string, number>;
    shrinkFloors?: Map<string, number>;
}) => void;
