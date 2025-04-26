import { RefObject, useRef, useState, useEffect } from "react";
import useWidthSync from "../../hooks/useWidthSync";
import useScrollSync from "../../hooks/useScrollSync";

const TableHorizontalScrollbar = ({
  mainBodyRef,
  pinnedLeftRef,
  pinnedRightRef,
  tableContentWidth,
}: {
  mainBodyRef: RefObject<HTMLDivElement | null>;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  tableContentWidth: number;
}) => {
  const [pinnedLeftWidth, setPinnedLeftWidth] = useState(0);
  const [pinnedRightWidth, setPinnedRightWidth] = useState(0);
  const [mainBodyWidth, setMainBodyWidth] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep up to date the width of the left pinned columns container
  useWidthSync({ widthAttribute: "offsetWidth", callback: setPinnedLeftWidth, ref: pinnedLeftRef });

  // Keep up to date the width of the right pinned columns container
  useWidthSync({
    widthAttribute: "offsetWidth",
    callback: setPinnedRightWidth,
    ref: pinnedRightRef,
  });

  // Keep up to date the scroll position of the visible scroll
  useScrollSync(mainBodyRef, scrollRef);

  // Use ResizeObserver to track mainBodyRef width changes
  useEffect(() => {
    const updateScrollState = () => {
      if (!mainBodyRef.current) return;

      const scrollWidth = mainBodyRef.current.scrollWidth;
      const clientWidth = mainBodyRef.current.clientWidth;

      setMainBodyWidth(scrollWidth);
      setIsScrollable(scrollWidth > clientWidth);
    };

    // This is a hack to ensure the scrollbar is rendered
    setTimeout(() => {
      updateScrollState();
    }, 1);
  }, [mainBodyRef]);

  if (!isScrollable) {
    // If the table is not scrollable, don't render the scrollbar
    return null;
  }

  return (
    <div className="st-horizontal-scrollbar-container" style={{ width: tableContentWidth }}>
      {pinnedLeftWidth > 0 && (
        <div
          className="st-horizontal-scrollbar-left"
          style={{
            flexShrink: 0,
            width: pinnedLeftWidth,
            height: scrollRef.current?.offsetHeight,
          }}
        />
      )}
      {mainBodyWidth > 0 && (
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
              width: mainBodyWidth,
              height: ".3px",
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
            height: scrollRef.current?.offsetHeight,
          }}
        />
      )}
    </div>
  );
};

export default TableHorizontalScrollbar;
