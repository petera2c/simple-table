import { Dispatch, SetStateAction } from "react";
import { HeaderObject } from "..";

export type HandleResizeStartProps = {
  event: MouseEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  gridColumnEnd: number;
  gridColumnStart: number;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  startWidth: number;
};
