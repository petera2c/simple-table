import { useState } from "react";
import { useEffect } from "react";

const HEADER_HEIGHT = 60;
const CONTENT_TOP_MARGIN = 24;
const CONTENT_TOP_PADDING = 32;
const EXAMPLES_NAVIGATION_HEIGHT = 32;
const EXAMPLE_NAVIGATION_BOTTOM_MARGIN = 16;

const TABLE_SCROLLBAR_WIDTH = 12;
const TABLE_FOOTER_HEIGHT = 50;

export const useExampleHeight = ({
  isUsingPagination,
  rowHeight,
}: {
  isUsingPagination: boolean;
  rowHeight: number;
}) => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      const heightToSubtract = isUsingPagination
        ? HEADER_HEIGHT +
          CONTENT_TOP_MARGIN +
          CONTENT_TOP_PADDING +
          EXAMPLES_NAVIGATION_HEIGHT +
          EXAMPLE_NAVIGATION_BOTTOM_MARGIN +
          rowHeight +
          TABLE_SCROLLBAR_WIDTH +
          TABLE_FOOTER_HEIGHT
        : HEADER_HEIGHT +
          CONTENT_TOP_MARGIN +
          CONTENT_TOP_PADDING +
          EXAMPLES_NAVIGATION_HEIGHT +
          EXAMPLE_NAVIGATION_BOTTOM_MARGIN;

      setContainerHeight(viewportHeight - heightToSubtract);
    };
    // Calculate initially
    calculateHeight();

    // Recalculate when window is resized
    window.addEventListener("resize", calculateHeight);

    // Cleanup
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  return containerHeight;
};
