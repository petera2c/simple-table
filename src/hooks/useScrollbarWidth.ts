import { RefObject, useLayoutEffect, useState } from "react";

const useScrollbarWidth = ({
  tableBodyContainerRef,
}: {
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Calculate the width of the scrollbar
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;

    const newScrollbarWidth =
      tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;

    setScrollbarWidth(newScrollbarWidth);
  }, []);

  return { setScrollbarWidth, scrollbarWidth };
};

export default useScrollbarWidth;
