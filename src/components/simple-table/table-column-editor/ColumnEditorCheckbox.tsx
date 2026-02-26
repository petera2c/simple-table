import { DragEvent } from "react";
import Checkbox from "../../Checkbox";
import HeaderObject from "../../../types/HeaderObject";
import { useTableContext } from "../../../context/TableContext";
import {
  areAllChildrenHidden,
  findAndMarkParentsVisible,
  updateParentHeaders,
  buildColumnVisibilityState,
  findClosestValidSeparatorIndex,
  FlattenedHeader,
} from "./columnEditorUtils";
import {
  getSiblingArray,
  setSiblingArray,
  insertHeaderAcrossSections,
} from "../../../hooks/useDragHandler";
import { deepClone } from "../../../utils/generalUtils";

// Component to render a single header row
const ColumnEditorCheckbox = ({
  allHeaders,
  depth = 0,
  doesAnyHeaderHaveChildren,
  draggingRow,
  expandedHeaders,
  flattenedHeaders,
  forceExpanded = false,
  header,
  hoveredSeparatorIndex,
  isCheckedOverride,
  rowIndex,
  setDraggingRow,
  setExpandedHeaders,
  setHoveredSeparatorIndex,
}: {
  allHeaders: HeaderObject[];
  depth?: number;
  doesAnyHeaderHaveChildren: boolean;
  draggingRow: FlattenedHeader | null;
  expandedHeaders: Set<string>;
  flattenedHeaders: FlattenedHeader[];
  forceExpanded?: boolean;
  header: HeaderObject;
  hoveredSeparatorIndex: number | null;
  isCheckedOverride?: boolean;
  rowIndex?: number;
  setDraggingRow: (row: FlattenedHeader | null) => void;
  setExpandedHeaders: (headers: Set<string>) => void;
  setHoveredSeparatorIndex: (index: number | null) => void;
}) => {
  const { headers, icons, setHeaders, onColumnVisibilityChange, onColumnOrderChange } =
    useTableContext();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked =
    isCheckedOverride ??
    !(header.hide || (hasChildren && header.children && areAllChildrenHidden(header.children)));

  // Check if this header is expanded
  const isExpanded = expandedHeaders.has(header.accessor);
  const shouldExpand = forceExpanded || isExpanded;

  // Toggle expansion
  const toggleExpanded = () => {
    if (forceExpanded) return;

    const newExpanded = new Set(expandedHeaders);
    if (isExpanded) {
      newExpanded.delete(header.accessor);
    } else {
      newExpanded.add(header.accessor);
    }
    setExpandedHeaders(newExpanded);
  };

  // Drag handlers
  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.effectAllowed = "move";
    if (rowIndex === undefined) return;
    setDraggingRow(flattenedHeaders[rowIndex]);
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
      const isTopHalfOfRow = mouseY < rowMiddle;

      // Find the closest valid separator index based on hierarchy constraints
      const validSeparatorIndex = findClosestValidSeparatorIndex({
        flattenedHeaders,
        draggingRow,
        hoveredRowIndex: rowIndex,
        isTopHalfOfRow,
      });

      setHoveredSeparatorIndex(validSeparatorIndex);
    }
  };

  const onDragEnd = () => {
    const cancelDrag = () => {
      setDraggingRow(null);
      setHoveredSeparatorIndex(null);
    };
    if (!draggingRow || hoveredSeparatorIndex === null) {
      cancelDrag();
      return;
    }
    const targetRowIndex =
      draggingRow.visualIndex >= hoveredSeparatorIndex
        ? hoveredSeparatorIndex + 1
        : hoveredSeparatorIndex;

    let hoveredHeader = flattenedHeaders[targetRowIndex];
    if (!hoveredHeader) {
      cancelDrag();
      return;
    }

    // If dragging row is at shallower depth and hovering over a deeper child,
    // use the parent instead for reordering at the parent level
    if (draggingRow.depth < hoveredHeader.depth && hoveredHeader.parent) {
      const parentIndex = flattenedHeaders.findIndex(
        (h) => h.header.accessor === hoveredHeader.parent!.accessor,
      );
      if (parentIndex !== -1) {
        hoveredHeader = flattenedHeaders[parentIndex];
      }
    }

    if (draggingRow.header.accessor === hoveredHeader.header.accessor) {
      cancelDrag();
      return;
    }

    const { newHeaders, emergencyBreak } = insertHeaderAcrossSections({
      headers: getSiblingArray(headers, draggingRow.indexPath),
      draggedHeader: draggingRow.header,
      hoveredHeader: hoveredHeader.header,
    });

    if (emergencyBreak) {
      cancelDrag();
      return;
    }

    const updatedHeaders = setSiblingArray(deepClone(headers), draggingRow.indexPath, newHeaders);

    onColumnOrderChange?.(updatedHeaders);
    setHeaders(updatedHeaders);
    cancelDrag();
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

  // Create component elements for custom renderer
  const ExpandIconComponent = doesAnyHeaderHaveChildren &&
    hasChildren && (
      <div className="st-header-icon-container">
        <div
          className={`st-collapsible-header-icon st-expand-icon-container ${
            shouldExpand ? "expanded" : "collapsed"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {icons.expand}
        </div>
      </div>
    );

  const CheckboxComponent = <Checkbox checked={isChecked} onChange={handleCheckboxChange} />;

  const DragIconComponent = <div className="st-drag-icon-container">{icons.drag}</div>;

  const LabelContent = <div className="st-column-label-container">{header.label}</div>;

  return (
    <>
      {rowIndex === 0 && (
        <div
          className="st-column-editor-drag-separator"
          style={{ opacity: hoveredSeparatorIndex === -1 ? 1 : 0 }}
        />
      )}
      <div
        className="st-header-checkbox-item"
        style={{ paddingLeft }}
        draggable
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {header.columnEditorRowRenderer
          ? header.columnEditorRowRenderer({
              accessor: header.accessor,
              header,
              components: {
                expandIcon: ExpandIconComponent || undefined,
                checkbox: CheckboxComponent,
                dragIcon: DragIconComponent,
                labelContent: LabelContent,
              },
            })
          : (
            <>
              {doesAnyHeaderHaveChildren && (
                <div className="st-header-icon-container">
                  {hasChildren ? (
                    <div
                      className={`st-collapsible-header-icon st-expand-icon-container ${
                        shouldExpand ? "expanded" : "collapsed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded();
                      }}
                    >
                      {icons.expand}
                    </div>
                  ) : null}
                </div>
              )}
              <Checkbox checked={isChecked} onChange={handleCheckboxChange}></Checkbox>
              <div className="st-drag-icon-container">{icons.drag}</div>
              <div className="st-column-label-container">{header.label}</div>
            </>
          )}
      </div>
      <div
        className="st-column-editor-drag-separator"
        style={{ opacity: hoveredSeparatorIndex === rowIndex ? 1 : 0 }}
      />
    </>
  );
};

export default ColumnEditorCheckbox;
