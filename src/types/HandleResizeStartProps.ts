import { Dispatch, RefObject, SetStateAction } from "react";
import { HeaderObject } from "..";

export type HandleResizeStartProps = {
  event: MouseEvent;
  forceUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setPinnedLeftWidth: Dispatch<SetStateAction<number>>;
  setPinnedRightWidth: Dispatch<SetStateAction<number>>;
  startWidth: number;
};
