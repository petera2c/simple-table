import { HeaderObject } from "..";
import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../consts/general-consts";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import { getCellId } from "./cellUtils";
import { calculatePinnedWidth } from "./headerUtils";

export const calculateTotalSectionWidth = ({
  header,
  headers,
  newWidth,
}: {
  header: HeaderObject;
  headers: HeaderObject[];
  newWidth: number;
}) => {
  const targetPinned = header.pinned;
  let totalWidth = 0;

  // Find all leaf headers in a header tree
  const findLeafHeaders = (header: HeaderObject): HeaderObject[] => {
    // Skip hidden headers
    if (header.hide) {
      return [];
    }

    if (!header.children || header.children.length === 0) {
      return [header];
    }
    return header.children.flatMap((child) => findLeafHeaders(child));
  };

  // Get actual width of a header in pixels
  const getHeaderWidthInPixels = (header: HeaderObject): number => {
    // If width is a number, use it directly
    if (typeof header.width === "number") {
      return header.width;
    }
    // If width is a string that ends with "px", parse it
    else if (typeof header.width === "string" && header.width.endsWith("px")) {
      return parseFloat(header.width);
    }
    // For fr, %, or any other format, get the actual DOM element width
    else {
      const cellElement = document.getElementById(
        getCellId({ accessor: header.accessor, rowIndex: 0 })
      );
      return cellElement?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
    }
  };

  // Process headers that match the target pinned value
  headers.forEach((h) => {
    // Skip this header if it's hidden
    if (h.hide || h.pinned !== targetPinned) return;

    // If this is the header being resized, use the new width
    if (h.accessor === header.accessor) {
      totalWidth += newWidth;
    } else {
      // Get all leaf headers if this is a parent header
      const leafHeaders = findLeafHeaders(h);

      // Sum up the widths of all leaf headers
      leafHeaders.forEach((leafHeader) => {
        // Skip this leaf header if it's hidden
        if (leafHeader.hide) return;

        // If this specific leaf is the one being resized, use new width
        if (leafHeader.accessor === header.accessor) {
          totalWidth += newWidth;
        } else {
          totalWidth += getHeaderWidthInPixels(leafHeader);
        }
      });
    }
  });

  const totalWidthWithPinned = header.pinned ? calculatePinnedWidth(totalWidth) : totalWidth;
  return totalWidthWithPinned;
};

export const handleResizeStart = ({
  event,
  forceUpdate,
  gridColumnEnd,
  gridColumnStart,
  header,
  headersRef,
  setIsWidthDragging,
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
  startWidth,
}: HandleResizeStartProps) => {
  setIsWidthDragging(true);
  event.preventDefault();
  const startX = event.clientX;
  if (!header || header.hide) return;

  // Get the minimum width for this header (default to 40px)
  const minWidth = typeof header.minWidth === "number" ? header.minWidth : 40;

  // Function to find all leaf headers under a parent
  const findLeafHeaders = (header: HeaderObject): HeaderObject[] => {
    // Skip hidden headers
    if (header.hide) {
      return [];
    }

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

    const updateSectionWidth = (header: HeaderObject, newWidth: number) => {
      const totalSectionWidth = calculateTotalSectionWidth({
        header,
        headers: headersRef.current,
        newWidth,
      });
      if (header.pinned === "left") {
        setPinnedLeftWidth(totalSectionWidth);
      } else if (header.pinned === "right") {
        setPinnedRightWidth(totalSectionWidth);
      } else if (!header.pinned) {
        setMainBodyWidth(totalSectionWidth);
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

      updateSectionWidth(header, newTotalWidth);

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
      updateSectionWidth(header, newWidth);
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

export const recalculateAllSectionWidths = ({
  headers,
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
}: {
  headers: HeaderObject[];
  setMainBodyWidth: (width: number) => void;
  setPinnedLeftWidth: (width: number) => void;
  setPinnedRightWidth: (width: number) => void;
}) => {
  let leftWidth = 0;
  let rightWidth = 0;
  let mainWidth = 0;

  // Get actual width of a header in pixels
  const getHeaderWidthInPixels = (header: HeaderObject): number => {
    // Skip hidden headers
    if (header.hide) {
      return 0;
    }

    // If width is a number, use it directly
    if (typeof header.width === "number") {
      return header.width;
    }
    // If width is a string that ends with "px", parse it
    else if (typeof header.width === "string" && header.width.endsWith("px")) {
      return parseFloat(header.width);
    }
    // For fr, %, or any other format, get the actual DOM element width
    else {
      const cellElement = document.getElementById(
        getCellId({ accessor: header.accessor, rowIndex: 0 })
      );
      return cellElement?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
    }
  };

  // Find all leaf headers in a header tree
  const findLeafHeaders = (header: HeaderObject): HeaderObject[] => {
    // Skip hidden headers
    if (header.hide) {
      return [];
    }

    if (!header.children || header.children.length === 0) {
      return [header];
    }
    return header.children.flatMap((child) => findLeafHeaders(child));
  };

  headers.forEach((header) => {
    // Skip hidden headers
    if (header.hide) {
      return;
    }

    const leafHeaders = findLeafHeaders(header);
    const totalHeaderWidth = leafHeaders.reduce((sum, leafHeader) => {
      return sum + getHeaderWidthInPixels(leafHeader);
    }, 0);

    if (header.pinned === "left") {
      leftWidth += totalHeaderWidth;
    } else if (header.pinned === "right") {
      rightWidth += totalHeaderWidth;
    } else {
      mainWidth += totalHeaderWidth;
    }
  });

  // Calculate pinned widths with any additional styling
  const totalPinnedLeftWidth = calculatePinnedWidth(leftWidth);
  const totalPinnedRightWidth = calculatePinnedWidth(rightWidth);

  // Update section widths
  setPinnedLeftWidth(totalPinnedLeftWidth);
  setPinnedRightWidth(totalPinnedRightWidth);
  setMainBodyWidth(mainWidth);

  return {
    leftWidth: totalPinnedLeftWidth,
    rightWidth: totalPinnedRightWidth,
    mainWidth,
  };
};
