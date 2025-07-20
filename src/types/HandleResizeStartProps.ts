import { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import { HeaderObject } from "..";

export type HandleResizeStartProps = {
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  header: HeaderObject;
  headers: HeaderObject[];
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  startWidth: number;
};
