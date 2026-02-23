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
  mainBodyRef: RefObject<HTMLDivElement>;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  reverse: boolean;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  startWidth: number;
};
