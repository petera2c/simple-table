import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import HeaderObject from "../../types/HeaderObject";

const TableHorizontalScrollbar = ({
  headersRef,
  pinnedLeftRef,
  pinnedRightRef,
  tableRef,
}: {
  headersRef: RefObject<HeaderObject[]>;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  tableRef: RefObject<HTMLDivElement | null>;
}) => {
  const [pinnedLeftWidth, setPinnedLeftWidth] = useState(0);
  const [pinnedRightWidth, setPinnedRightWidth] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinnedLeftRef.current) return;
    const updatePinnedLeftWidth = () => {
      setPinnedLeftWidth(pinnedLeftRef.current?.scrollWidth || 0);
    };

    updatePinnedLeftWidth();

    const resizeObserver = new ResizeObserver(() => {
      updatePinnedLeftWidth();
    });
    resizeObserver.observe(pinnedLeftRef.current);

    return () => resizeObserver.disconnect();
  }, [pinnedLeftRef]);

  useEffect(() => {
    if (!tableRef.current) return;
    const updateTableWidth = () => {
      setTableWidth(tableRef.current?.scrollWidth || 0);
    };

    updateTableWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateTableWidth();
    });
    resizeObserver.observe(tableRef.current);

    return () => resizeObserver.disconnect();
  }, [tableRef]);

  useEffect(() => {
    if (!pinnedRightRef.current) return;
    const updatePinnedRightWidth = () => {
      setPinnedRightWidth(pinnedRightRef.current?.scrollWidth || 0);
    };

    updatePinnedRightWidth();

    const resizeObserver = new ResizeObserver(() => {
      updatePinnedRightWidth();
    });
    resizeObserver.observe(pinnedRightRef.current);
    return () => resizeObserver.disconnect();
  }, [pinnedRightRef]);

  useEffect(() => {
    if (!tableRef.current) return;

    const handleScroll = () => {
      const scrollLeft = tableRef.current?.scrollLeft;
      // Set the scrollLeft to the tableRef.current?.scrollLeft
      if (scrollLeft) {
        scrollRef.current?.scrollTo(scrollLeft, 0);
      }
    };

    tableRef.current.addEventListener("scroll", handleScroll);

    return () => {
      tableRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [tableRef]);

  return (
    <div className="st-horizontal-scrollbar-container">
      {pinnedLeftWidth > 0 && (
        <div
          className="st-horizontal-scrollbar-left"
          style={{
            flexShrink: 0,
            width: pinnedLeftWidth,
            backgroundColor: "blue",
          }}
        />
      )}
      {tableWidth > 0 && (
        <div className="st-horizontal-scrollbar-middle" ref={scrollRef}>
          <div
            style={{
              width: tableWidth,
              transform: `translateX(-${scrollLeft}px)`,
            }}
          ></div>
        </div>
      )}
      {pinnedRightWidth > 0 && (
        <div
          className="st-horizontal-scrollbar-right"
          style={{
            flexShrink: 0,
            width: pinnedRightWidth,
          }}
        />
      )}
    </div>
  );
};

export default TableHorizontalScrollbar;
