import { RefObject, useLayoutEffect } from "react";

const useWindowResize = ({
  forceUpdate,
  tableBodyContainerRef,
  setScrollbarWidth,
}: {
  forceUpdate: () => void;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
  setScrollbarWidth: (width: number) => void;
}) => {
  // On window risize completely re-render the table
  useLayoutEffect(() => {
    const handleResize = () => {
      // Force a re-render of the table
      forceUpdate();
      // Re-calculate the width of the scrollbar and table content
      if (!tableBodyContainerRef.current) return;

      const newScrollbarWidth =
        tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;

      setScrollbarWidth(newScrollbarWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [forceUpdate, tableBodyContainerRef, setScrollbarWidth]);
};

export default useWindowResize;
