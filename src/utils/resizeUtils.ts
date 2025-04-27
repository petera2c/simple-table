import { HeaderObject } from "..";
import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../consts/general-consts";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import { getCellId } from "./cellUtils";
import { calculatePinnedWidth } from "./headerUtils";

export const handleResizeStart = ({
  event,
  forceUpdate,
  gridColumnEnd,
  gridColumnStart,
  header,
  headersRef,
  setIsWidthDragging,
  setPinnedLeftWidth,
  setPinnedRightWidth,
  startWidth,
}: HandleResizeStartProps) => {
  setIsWidthDragging(true);
  event.preventDefault();
  const startX = event.clientX;
  if (!header) return;

  // Get the minimum width for this header (default to 40px)
  const minWidth = typeof header.minWidth === "number" ? header.minWidth : 40;

  // Function to find all leaf headers under a parent
  const findLeafHeaders = (header: HeaderObject): HeaderObject[] => {
    if (!header.children || header.children.length === 0) {
      return [header]; // This is a leaf node
    }

    // Collect all leaf nodes from children
    return header.children.flatMap((child) => findLeafHeaders(child));
  };

  // Get all leaf headers if this is a parent header
  const isParentHeader = gridColumnEnd - gridColumnStart > 1;
  const leafHeaders = isParentHeader ? findLeafHeaders(header) : [header];

  const handleMouseMove = (event: MouseEvent) => {
    // Calculate the width delta (how much the width has changed)
    // Check if header.pinned is right because if it is, we need to subtract the width of the pinned columns from the delta
    const delta = header.pinned === "right" ? startX - event.clientX : event.clientX - startX;

    const updatePinnedWidth = (header: HeaderObject, newWidth: number) => {
      if (header.pinned === "left") {
        setPinnedLeftWidth(calculatePinnedWidth(newWidth));
      } else if (header.pinned === "right") {
        setPinnedRightWidth(calculatePinnedWidth(newWidth));
      }
    };

    if (isParentHeader && leafHeaders.length > 1) {
      const totalMinWidth = leafHeaders.reduce((min, header) => {
        return Math.min(min, typeof header.minWidth === "number" ? header.minWidth : 40);
      }, 40);

      // Calculate the total original width first
      const totalOriginalWidth = leafHeaders.reduce((sum, header) => {
        const width = typeof header.width === "number" ? header.width : 150;
        return sum + width;
      }, 0);

      // Calculate new total width with minimum constraints
      const newTotalWidth = Math.max(startWidth + delta, totalMinWidth);

      updatePinnedWidth(header, newTotalWidth);

      // Calculate the total width to distribute
      const totalWidthToDistribute = newTotalWidth - totalOriginalWidth;

      // Distribute the width proportionally based on original widths
      leafHeaders.forEach((header) => {
        const originalWidth = typeof header.width === "number" ? header.width : 150;
        const proportion = originalWidth / totalOriginalWidth;
        const widthIncrease = totalWidthToDistribute * proportion;
        const newWidth = Math.max(originalWidth + widthIncrease, minWidth);
        header.width = newWidth;
      });
    } else {
      // For leaf headers or parents with only one leaf, just adjust the width directly
      const newWidth = Math.max(startWidth + delta, minWidth);

      header.width = newWidth;
      updatePinnedWidth(header, newWidth);
    }

    // After a header is resized we need up update any headers that use fractional widths
    // This must happen recursively
    const removeAllFractionalWidths = (header: HeaderObject) => {
      const headerWidth = header.width;
      if (typeof headerWidth === "string" && headerWidth.includes("fr")) {
        header.width =
          document.getElementById(getCellId({ accessor: header.accessor, rowIndex: 0 }))
            ?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
      }
      if (header.children) {
        header.children.forEach((child) => {
          removeAllFractionalWidths(child);
        });
      }
    };
    headersRef.current.forEach((header) => {
      removeAllFractionalWidths(header);
    });

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
