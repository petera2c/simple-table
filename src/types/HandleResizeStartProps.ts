import { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import { HeaderObject } from "..";

export type HandleResizeStartProps = {
  event: MouseEvent | TouchEvent;
  forceUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  setMainBodyWidth: Dispatch<SetStateAction<number>>;
  setPinnedLeftWidth: Dispatch<SetStateAction<number>>;
  setPinnedRightWidth: Dispatch<SetStateAction<number>>;
  startWidth: number;
};
