import { HeaderObject, Accessor } from "..";

export interface RefObject<T> {
  current: T | null;
}

export type HandleResizeStartProps = {
  autoExpandColumns: boolean;
  collapsedHeaders: Set<Accessor>;
  containerWidth: number;
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  headers: HeaderObject[];
  mainBodyRef: RefObject<HTMLDivElement>;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  reverse: boolean;
  setHeaders: (headers: HeaderObject[] | ((prev: HeaderObject[]) => HeaderObject[])) => void;
  setIsResizing: (isResizing: boolean | ((prev: boolean) => boolean)) => void;
  startWidth: number;
};
