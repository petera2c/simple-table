import { RefObject, useRef, useState, useEffect } from "react";
import { useTableContext } from "../../context/TableContext";
import { COLUMN_EDIT_WIDTH, PINNED_BORDER_WIDTH } from "../../consts/general-consts";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";

const TableHorizontalScrollbar = ({
  mainBodyWidth,
  mainBodyRef,
  pinnedLeftWidth,
  pinnedRightWidth,
  pinnedLeftContentWidth,
  pinnedRightContentWidth,
  tableBodyContainerRef,
}: {
  mainBodyRef: RefObject<HTMLDivElement>;
  mainBodyWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  pinnedLeftContentWidth: number;
  pinnedRightContentWidth: number;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}) => {
  // Context
  const { editColumns } = useTableContext();

  // Local state
  const [isScrollable, setIsScrollable] = useState(false);

  // Refs
  const scrollRefMainBody = useRef<HTMLDivElement>(null);
  const scrollRefPinnedLeft = useRef<HTMLDivElement>(null);
  const scrollRefPinnedRight = useRef<HTMLDivElement>(null);

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
    const updateIsScrollable = () => {
      if (!mainBodyRef.current) return;

      const clientWidth = mainBodyRef.current.clientWidth;

      setIsScrollable(mainBodyWidth > clientWidth);
    };

    // This is a hack to ensure the scrollbar is rendered
    setTimeout(() => {
      updateIsScrollable();
    }, 1);
  }, [mainBodyRef, mainBodyWidth]);

  if (!isScrollable) {
    // If the table is not scrollable, don't render the scrollbar
    return null;
  }

  return (
    <div className="st-horizontal-scrollbar-container">
      {pinnedLeftWidth > 0 && (
        <ScrollSyncPane childRef={scrollRefPinnedLeft} group="pinned-left">
          <div
            className="st-horizontal-scrollbar-left"
            ref={scrollRefPinnedLeft}
            style={{
              width: pinnedLeftWidth,
            }}
          >
            <div
              style={{
                width: pinnedLeftContentWidth,
              }}
            />
          </div>
        </ScrollSyncPane>
      )}
      {mainBodyWidth > 0 && (
        <ScrollSyncPane childRef={scrollRefMainBody}>
          <div className="st-horizontal-scrollbar-middle" ref={scrollRefMainBody}>
            <div
              style={{
                width: mainBodyWidth,
              }}
            />
          </div>
        </ScrollSyncPane>
      )}
      {pinnedRightWidth > 0 && (
        <ScrollSyncPane childRef={scrollRefPinnedRight} group="pinned-right">
          <div
            className="st-horizontal-scrollbar-right"
            ref={scrollRefPinnedRight}
            style={{
              width: rightSectionWidth,
            }}
          >
            <div
              style={{
                width: pinnedRightContentWidth,
              }}
            />
          </div>
        </ScrollSyncPane>
      )}
      {editorWidth > 0 && (
        <div style={{ width: editorWidth - 1.5, height: "100%", flexShrink: 0 }} />
      )}
    </div>
  );
};

export default TableHorizontalScrollbar;
