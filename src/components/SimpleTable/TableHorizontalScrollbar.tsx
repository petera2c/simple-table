import { RefObject, useRef, useState } from "react";
import HeaderObject from "../../types/HeaderObject";
import useWidthSync from "../../hooks/useWidthSync";
import useScrollSync from "../../hooks/useScrollSync";

const TableHorizontalScrollbar = ({
  headersRef,
  mainBodyRef,
  pinnedLeftRef,
  pinnedRightRef,
  scrollbarHorizontalRef,
  tableContentWidth,
}: {
  headersRef: RefObject<HeaderObject[]>;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  scrollbarHorizontalRef: RefObject<HTMLDivElement | null>;
  tableContentWidth: number;
}) => {
  const [pinnedLeftWidth, setPinnedLeftWidth] = useState(0);
  const [pinnedRightWidth, setPinnedRightWidth] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep up to date the width of the left pinned columns container
  useWidthSync({ widthAttribute: "offsetWidth", callback: setPinnedLeftWidth, ref: pinnedLeftRef });

  // Keep up to date the middle scrollable width table container
  useWidthSync({ widthAttribute: "scrollWidth", callback: setTableWidth, ref: mainBodyRef });

  // Keep up to date the width of the right pinned columns container
  useWidthSync({ widthAttribute: "offsetWidth", callback: setPinnedRightWidth, ref: pinnedRightRef });

  // Keep up to date the scroll position of the visible scroll
  useScrollSync(mainBodyRef, scrollRef);

  // If the table is not scrollable, don't render the scrollbar
  if (!mainBodyRef.current || mainBodyRef.current.scrollWidth <= mainBodyRef.current.clientWidth) {
    return null;
  }

  return (
    <div className="st-horizontal-scrollbar-container" ref={scrollbarHorizontalRef}>
      <div style={{ width: tableContentWidth }}>
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
            onScroll={(e) => {
              const scrollLeft = (e.target as HTMLDivElement).scrollLeft;

              if (scrollLeft !== undefined && mainBodyRef.current) {
                mainBodyRef.current.scrollTo({ left: scrollLeft, behavior: "auto" });
              }
            }}
            ref={scrollRef}
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
              minWidth: pinnedRightWidth,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TableHorizontalScrollbar;
