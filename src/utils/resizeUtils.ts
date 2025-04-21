import { HeaderObject } from "..";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";

export const handleResizeStart = ({
  event,
  forceUpdate,
  header,
  gridColumnEnd,
  gridColumnStart,
  setIsWidthDragging,
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

  // Store original widths for reference
  const originalWidths = leafHeaders.map((leafHeader) => {
    const width =
      typeof leafHeader.width === "number"
        ? leafHeader.width
        : parseInt(String(leafHeader.width), 10) || 150;
    return width;
  });

  const handleMouseMove = (event: MouseEvent) => {
    // Calculate the width delta (how much the width has changed)
    const delta = event.clientX - startX;

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

      // Calculate the total width to distribute
      const totalWidthToDistribute = newTotalWidth - totalOriginalWidth;

      // Distribute the width proportionally based on original widths
      leafHeaders.forEach((header, index) => {
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
    }

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
