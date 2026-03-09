import { RefObject, useLayoutEffect, useState } from "react";

const useScrollbarWidth = ({
  tableBodyContainerRef,
}: {
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}) => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Calculate the width of the scrollbar
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;

    const newScrollbarWidth =
      tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;

    setScrollbarWidth(newScrollbarWidth);
  }, [tableBodyContainerRef]);

  return { setScrollbarWidth, scrollbarWidth, tableBodyContainerRef };
};

export default useScrollbarWidth;
