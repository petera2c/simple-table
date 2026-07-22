import { ColumnDef, Accessor } from "..";

export interface RefObject<T> {
  current: T | null;
}

export type HandleResizeStartProps = {
  autoExpandColumns: boolean;
  collapsedHeaders: Set<Accessor>;
  containerWidth: number;
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  header: ColumnDef;
  headers: ColumnDef[];
  mainBodyRef: RefObject<HTMLDivElement>;
  onColumnWidthChange?: (headers: ColumnDef[]) => void;
  /** Persist the dragged column(s)' final widths as their natural widths (autoExpandColumns). */
  onAutoExpandNaturalWidths?: (widths: Map<string, number>) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  reverse: boolean;
  setHeaders: (headers: ColumnDef[] | ((prev: ColumnDef[]) => ColumnDef[])) => void;
  setIsResizing: (isResizing: boolean | ((prev: boolean) => boolean)) => void;
  /** Natural-width shrink floors (accessor -> px) for compensating neighbors (autoExpandColumns). */
  shrinkFloors?: Map<string, number>;
  startWidth: number;
};
