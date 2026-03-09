import { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import { HeaderObject, Accessor } from "..";

export type HandleResizeStartProps = {
  autoExpandColumns: boolean;
  collapsedHeaders: Set<Accessor>;
  containerWidth: number;
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  headers: HeaderObject[];
  mainBodyRef: RefObject<HTMLDivElement | null>;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  reverse: boolean;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  startWidth: number;
};
