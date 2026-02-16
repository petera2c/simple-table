import { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import { HeaderObject, Accessor } from "..";

export type HandleResizeStartProps = {
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  headers: HeaderObject[];
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
  startWidth: number;
  collapsedHeaders: Set<Accessor>;
  autoExpandColumns: boolean;
  reverse: boolean;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
};
