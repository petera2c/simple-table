import { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import { HeaderObject } from "..";

export type HandleResizeStartProps<T> = {
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  header: HeaderObject<T>;
  headers: HeaderObject<T>[];
  setHeaders: Dispatch<SetStateAction<HeaderObject<T>[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  startWidth: number;
};
