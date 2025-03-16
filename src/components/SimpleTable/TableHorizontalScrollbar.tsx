import { RefObject, useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep up to date the width of the left pinned columns container
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

  // Keep up to date the middle scrollable width table container
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

  // Keep up to date the width of the right pinned columns container
  useEffect(() => {
    if (!pinnedRightRef.current) return;
    const updatePinnedRightWidth = () => {
      console.log(
        "pinnedRightRef.current?.scrollWidth",
        pinnedRightRef.current?.scrollWidth
      );
      setPinnedRightWidth(pinnedRightRef.current?.scrollWidth || 0);
    };

    updatePinnedRightWidth();

    const resizeObserver = new ResizeObserver(() => {
      updatePinnedRightWidth();
    });
    resizeObserver.observe(pinnedRightRef.current);
    return () => resizeObserver.disconnect();
  }, [pinnedRightRef]);

  // Keep up to date the scroll position of the visible scroll
  useEffect(() => {
    if (!tableRef.current) return;

    const tableRefDiv = tableRef.current;

    const handleScroll = () => {
      const scrollLeft = tableRefDiv?.scrollLeft;
      // Set the scrollLeft to the tableRef.current?.scrollLeft
      if (scrollLeft !== undefined) {
        scrollRef.current?.scrollTo(scrollLeft, 0);
      }
    };

    tableRefDiv.addEventListener("scroll", handleScroll);

    return () => {
      tableRefDiv?.removeEventListener("scroll", handleScroll);
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
          }}
        />
      )}
      {tableWidth > 0 && (
        <div
          className="st-horizontal-scrollbar-middle"
          onScroll={() => {
            const scrollLeft = scrollRef.current?.scrollLeft;
            if (scrollLeft !== undefined) {
              tableRef.current?.scrollTo(scrollLeft, 0);
            }
          }}
          ref={scrollRef}
          style={{
            width: tableWidth,
          }}
        >
          <div
            style={{
              width: tableWidth,
            }}
          />
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
