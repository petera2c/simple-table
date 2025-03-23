import { RefObject, useEffect, useRef, useState } from "react";
import HeaderObject from "../../types/HeaderObject";
import useWidthSync from "../../hooks/useWidthSync";
import useScrollSync from "../../hooks/useScrollSync";

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
  useWidthSync(pinnedLeftRef, setPinnedLeftWidth);

  // Keep up to date the middle scrollable width table container
  useWidthSync(tableRef, setTableWidth);

  // Keep up to date the width of the right pinned columns container
  useWidthSync(pinnedRightRef, setPinnedRightWidth);

  // Keep up to date the scroll position of the visible scroll
  useScrollSync(tableRef, scrollRef);

  // If the table is not scrollable, don't render the scrollbar
  if (!tableRef.current || tableRef.current.scrollWidth <= tableRef.current.clientWidth) {
    return null;
  }

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
