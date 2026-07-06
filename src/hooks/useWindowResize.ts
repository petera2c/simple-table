import { RefObject, useLayoutEffect, useRef } from "react";
import { CONTAINER_RESIZE_SETTLE_MS } from "./resizeCoalescing";

const useWindowResize = ({
  forceUpdate,
  tableBodyContainerRef,
  setScrollbarWidth,
}: {
  forceUpdate: () => void;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
  setScrollbarWidth: (width: number) => void;
}) => {
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (settleTimeoutRef.current !== null) {
        clearTimeout(settleTimeoutRef.current);
      }
      settleTimeoutRef.current = setTimeout(() => {
        settleTimeoutRef.current = null;
        forceUpdate();
        if (!tableBodyContainerRef.current) return;

        const newScrollbarWidth =
          tableBodyContainerRef.current.offsetWidth -
          tableBodyContainerRef.current.clientWidth;

        setScrollbarWidth(newScrollbarWidth);
      }, CONTAINER_RESIZE_SETTLE_MS);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (settleTimeoutRef.current !== null) {
        clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }
    };
  }, [forceUpdate, tableBodyContainerRef, setScrollbarWidth]);
};

export default useWindowResize;
