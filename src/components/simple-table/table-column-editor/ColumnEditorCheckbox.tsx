import { useState, DragEvent } from "react";
import Checkbox from "../../Checkbox";
import HeaderObject from "../../../types/HeaderObject";
import { useTableContext } from "../../../context/TableContext";
import {
  areAllChildrenHidden,
  findAndMarkParentsVisible,
  updateParentHeaders,
  buildColumnVisibilityState,
} from "./columnEditorUtils";

// Recursive component to render headers with proper indentation
const ColumnEditorCheckbox = ({
  allHeaders,
  depth = 0,
  doesAnyHeaderHaveChildren,
  header,
  isCheckedOverride,
  forceExpanded = false,
  rowIndex,
  draggingRow,
  setDraggingRow,
  hoveredSeparatorIndex,
  setHoveredSeparatorIndex,
}: {
  allHeaders: HeaderObject[];
  depth?: number;
  doesAnyHeaderHaveChildren: boolean;
  header: HeaderObject;
  isCheckedOverride?: boolean;
  forceExpanded?: boolean;
  rowIndex?: number;
  draggingRow: HeaderObject | null;
  setDraggingRow: (row: HeaderObject | null) => void;
  hoveredSeparatorIndex: number | null;
  setHoveredSeparatorIndex: (index: number | null) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    dragIcon,
    expandIcon,
    headers,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
  } = useTableContext();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked =
    isCheckedOverride ??
    !(header.hide || (hasChildren && header.children && areAllChildrenHidden(header.children)));

  // Use forceExpanded when searching to show all matching children
  const shouldExpand = forceExpanded || isExpanded;

  // Drag handlers
  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.effectAllowed = "move";
    setDraggingRow(header);
  };

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (rowIndex !== undefined && draggingRow) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseY = event.clientY;
      const rowMiddle = rect.top + rect.height / 2;

      // If in top half, show separator above (index - 1)
      // If in bottom half, show separator below (index)
      if (mouseY < rowMiddle) {
        setHoveredSeparatorIndex(rowIndex - 1);
      } else {
        setHoveredSeparatorIndex(rowIndex);
      }
    }
  };

  const onDragEnd = () => {
    // Only reorder if we have valid drag and drop targets
    if (draggingRow && hoveredSeparatorIndex !== null && rowIndex !== undefined) {
      // Find the dragged row's index in the top-level headers
      const draggedIndex = allHeaders.findIndex((h) => h.accessor === draggingRow.accessor);

      if (draggedIndex !== -1) {
        // Create a copy of headers
        const newHeaders = [...allHeaders];

        // Remove the dragged item
        const [draggedItem] = newHeaders.splice(draggedIndex, 1);

        // Calculate the insertion index
        // hoveredSeparatorIndex represents the separator after that row
        // So we insert at hoveredSeparatorIndex + 1
        let insertIndex = hoveredSeparatorIndex + 1;

        // If we removed an item before the insert position, adjust the index
        if (draggedIndex < insertIndex) {
          insertIndex--;
        }

        // Insert at the new position
        newHeaders.splice(insertIndex, 0, draggedItem);

        // Update headers
        setHeaders(newHeaders);

        // Notify consumer of order change
        if (onColumnOrderChange) {
          onColumnOrderChange(newHeaders);
        }
      }
    }

    setDraggingRow(null);
    setHoveredSeparatorIndex(null);
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    // Update this header's state (checked = visible, so hide = !checked)
    header.hide = !checked;

    if (!checked) {
      // If unchecked (hidden), check if we need to update any parents to be hidden
      updateParentHeaders(allHeaders);
    } else {
      // If checked (visible), ensure all parent headers are also visible
      findAndMarkParentsVisible(allHeaders, header.accessor);

      // If this is a parent header being made visible, and all its children are hidden,
      // make at least the first child visible for better UX
      if (hasChildren && header.children && header.children.length > 0) {
        const allChildrenCurrentlyHidden = header.children.every((child) => child.hide === true);

        if (allChildrenCurrentlyHidden && header.children[0]) {
          // Make the first child visible
          header.children[0].hide = false;

          // Also make sure any parents of the child we just made visible are also visible
          findAndMarkParentsVisible(allHeaders, header.children[0].accessor);
        }
      }
    }

    // Update state
    const updatedHeaders = [...headers];
    setHeaders(updatedHeaders);

    // Notify consumer of visibility change
    if (onColumnVisibilityChange) {
      const visibilityState = buildColumnVisibilityState(updatedHeaders);
      onColumnVisibilityChange(visibilityState);
    }
  };

  return (
    <>
      <div
        className="st-header-checkbox-item"
        style={{ paddingLeft }}
        draggable
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {doesAnyHeaderHaveChildren && (
          <div className="st-header-icon-container">
            {hasChildren ? (
              <div
                className={`st-collapsible-header-icon st-expand-icon-container ${
                  shouldExpand ? "expanded" : "collapsed"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!forceExpanded) {
                    setIsExpanded(!isExpanded);
                  }
                }}
              >
                {expandIcon}
              </div>
            ) : null}
          </div>
        )}
        <Checkbox checked={isChecked} onChange={handleCheckboxChange}></Checkbox>
        <div className="st-drag-icon-container">{dragIcon}</div>
        <div className="st-column-label-container">{header.label}</div>
      </div>
      <div
        className="st-column-editor-drag-separator"
        style={{ opacity: hoveredSeparatorIndex === rowIndex ? 1 : 0 }}
      />
      {hasChildren && shouldExpand && header.children && (
        <div className="st-nested-headers">
          {header.children.map((childHeader, index) => (
            <ColumnEditorCheckbox
              allHeaders={allHeaders}
              depth={depth + 1}
              doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
              header={childHeader}
              key={`${childHeader.accessor}-${index}`}
              isCheckedOverride={!isChecked ? false : undefined}
              forceExpanded={forceExpanded}
              draggingRow={draggingRow}
              setDraggingRow={setDraggingRow}
              hoveredSeparatorIndex={hoveredSeparatorIndex}
              setHoveredSeparatorIndex={setHoveredSeparatorIndex}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColumnEditorCheckbox;
