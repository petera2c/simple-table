import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";

export const handleSort = (
  headers: HeaderObject[],
  rows: { [key: string]: any }[],
  sortConfig: SortConfig
) => {
  const key = sortConfig ? sortConfig.key : headers[0];

  let direction = "ascending";
  if (
    sortConfig &&
    sortConfig.key.accessor === key.accessor &&
    sortConfig.direction === "ascending"
  ) {
    direction = "descending";
  }

  const sortedData = [...rows].sort((a, b) => {
    if (a[key.accessor] < b[key.accessor]) {
      return direction === "ascending" ? 1 : -1;
    }
    if (a[key.accessor] > b[key.accessor]) {
      return direction === "ascending" ? -1 : 1;
    }
    return 0;
  });

  return { sortedData, newSortConfig: { key, direction } };
};

// Resize handler
export const handleResizeStart = ({
  event,
  forceUpdate,
  header,
  headersRef,
  index,
  setIsWidthDragging,
}: {
  event: MouseEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  headersRef: React.RefObject<HeaderObject[]>;
  index: number;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}) => {
  setIsWidthDragging(true);
  event.preventDefault();
  const startX = event.clientX;
  if (!header) return;

  const startWidth = header.width;

  const handleMouseMove = (event: any) => {
    const newWidth = Math.max(startWidth + (event.clientX - startX), 40);
    if (!header || !headersRef.current) return;
    headersRef.current[index].width = newWidth;
    forceUpdate();
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsWidthDragging(false);
  };
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
