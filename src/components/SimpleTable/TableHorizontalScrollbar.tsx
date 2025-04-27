import { RefObject, useRef, useState, useEffect } from "react";
import useScrollSync from "../../hooks/useScrollSync";
import { useTableContext } from "../../context/TableContext";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";

const TableHorizontalScrollbar = ({
  mainBodyRef,
  pinnedLeftWidth,
  pinnedRightWidth,
  tableBodyContainerRef,
}: {
  mainBodyRef: RefObject<HTMLDivElement | null>;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  // Context
  const { editColumns } = useTableContext();

  // Local state
  const [mainBodyWidth, setMainBodyWidth] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);

  // Derived state
  // Check if the content is scrollable
  const isContentVerticalScrollable =
    tableBodyContainerRef.current &&
    tableBodyContainerRef.current.scrollHeight > tableBodyContainerRef.current.clientHeight;
  const scrollbarWidth =
    tableBodyContainerRef.current && isContentVerticalScrollable
      ? tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth
      : 0;
  const editorWidth = editColumns ? COLUMN_EDIT_WIDTH : 0;
  // If edit columns is enabled, add the width of the editor to the right section
  // If the content is scrollable, add the width of the scrollbar to the right section
  const rightSectionWidth = pinnedRightWidth + editorWidth + scrollbarWidth - 0.6;

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
    <div className="st-horizontal-scrollbar-container">
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
          style={{ flexGrow: 1 }}
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
            minWidth: rightSectionWidth,
            height: scrollRef.current?.offsetHeight,
          }}
        />
      )}
    </div>
  );
};

export default TableHorizontalScrollbar;
