import { RefObject, useRef, useState, useEffect, SetStateAction, Dispatch } from "react";
import { useTableContext } from "../../context/TableContext";
import { COLUMN_EDIT_WIDTH, PINNED_BORDER_WIDTH } from "../../consts/general-consts";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";

const TableHorizontalScrollbar = ({
  mainBodyWidth,
  mainBodyRef,
  pinnedLeftWidth,
  pinnedRightWidth,
  setMainBodyWidth,
  tableBodyContainerRef,
}: {
  mainBodyRef: RefObject<HTMLDivElement | null>;
  mainBodyWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  setMainBodyWidth: Dispatch<SetStateAction<number>>;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  // Context
  const { editColumns } = useTableContext();

  // Local state
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
  const rightSectionWidth =
    (editColumns ? pinnedRightWidth + PINNED_BORDER_WIDTH : pinnedRightWidth) + scrollbarWidth;

  useEffect(() => {
    const updateScrollState = () => {
      const div = document.getElementById("testss");

      const newMainBodyWidth = div?.scrollWidth;
      console.log(newMainBodyWidth);
      if (!div) return;

      setMainBodyWidth(newMainBodyWidth || 0);
    };

    // This is a hack to ensure the scrollbar is rendered
    setTimeout(() => {
      updateScrollState();
    }, 1);
  }, [mainBodyRef, setMainBodyWidth]);

  useEffect(() => {
    const updateScrollState = () => {
      const div = document.getElementById("testss");
      if (!div) return;

      const clientWidth = div.clientWidth;

      setIsScrollable(mainBodyWidth > clientWidth);
    };

    // This is a hack to ensure the scrollbar is rendered
    setTimeout(() => {
      updateScrollState();
    }, 1);
  }, [mainBodyRef, mainBodyWidth, setMainBodyWidth]);

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
        <ScrollSyncPane>
          <div className="st-horizontal-scrollbar-middle" ref={scrollRef} style={{ flexGrow: 1 }}>
            <div
              style={{
                width: mainBodyWidth,
                height: ".3px",
              }}
            />
          </div>
        </ScrollSyncPane>
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
      {editorWidth > 0 && (
        <div style={{ width: editorWidth - 1.5, height: "100%", flexShrink: 0 }} />
      )}
    </div>
  );
};

export default TableHorizontalScrollbar;
