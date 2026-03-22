import { DragEvent, useCallback } from "react";
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
import { getSiblingArray, setSiblingArray, swapHeaders } from "../../../hooks/useDragHandler";
import { deepClone } from "../../../utils/generalUtils";
import {
  isHeaderEssential,
  moveRootColumnPinSide,
  validateFullHeaderTreeEssentialOrder,
  type PanelSection,
} from "../../../utils/pinnedColumnUtils";

const ColumnEditorCheckbox = ({
  allHeaders,
  clearHoverSeparator,
  depth = 0,
  doesAnyHeaderHaveChildren,
  draggingRow,
  expandedHeaders,
  flattenedHeaders,
  forceExpanded = false,
  header,
  hoveredSeparatorIndex,
  isCheckedOverride,
  panelSection,
  rowIndex,
  setDraggingRow,
  setExpandedHeaders,
  setHoveredSeparatorIndex,
}: {
  allHeaders: HeaderObject[];
  clearHoverSeparator?: () => void;
  depth?: number;
  doesAnyHeaderHaveChildren: boolean;
  draggingRow: FlattenedHeader | null;
  expandedHeaders: Set<string>;
  flattenedHeaders: FlattenedHeader[];
  forceExpanded?: boolean;
  header: HeaderObject;
  hoveredSeparatorIndex: number | null;
  isCheckedOverride?: boolean;
  panelSection: PanelSection;
  rowIndex?: number;
  setDraggingRow: (row: FlattenedHeader | null) => void;
  setExpandedHeaders: (headers: Set<string>) => void;
  setHoveredSeparatorIndex: (index: number | null) => void;
}) => {
  const {
    columnEditorConfig,
    essentialAccessors,
    headers,
    icons,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
  } = useTableContext();
  const allowColumnPinning = columnEditorConfig.allowColumnPinning !== false;
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isEssential = isHeaderEssential(header, essentialAccessors);
  const canToggleVisibility = !isEssential;

  const isChecked =
    isCheckedOverride ??
    !(header.hide || (hasChildren && header.children && areAllChildrenHidden(header.children)));

  const isExpanded = expandedHeaders.has(header.accessor);
  const shouldExpand = forceExpanded || isExpanded;

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

  const applyHeaderOrder = useCallback(
    (updatedHeaders: HeaderObject[]) => {
      if (
        essentialAccessors.size > 0 &&
        !validateFullHeaderTreeEssentialOrder(updatedHeaders, essentialAccessors)
      ) {
        return false;
      }
      onColumnOrderChange?.(updatedHeaders);
      setHeaders(updatedHeaders);
      return true;
    },
    [essentialAccessors, onColumnOrderChange, setHeaders],
  );

  const pinLeft = useCallback(() => {
    const next = moveRootColumnPinSide(headers, header.accessor, "left", essentialAccessors);
    if (next) applyHeaderOrder(next);
  }, [applyHeaderOrder, essentialAccessors, header.accessor, headers]);

  const pinRight = useCallback(() => {
    const next = moveRootColumnPinSide(headers, header.accessor, "right", essentialAccessors);
    if (next) applyHeaderOrder(next);
  }, [applyHeaderOrder, essentialAccessors, header.accessor, headers]);

  const unpin = useCallback(() => {
    const next = moveRootColumnPinSide(headers, header.accessor, "main", essentialAccessors);
    if (next) applyHeaderOrder(next);
  }, [applyHeaderOrder, essentialAccessors, header.accessor, headers]);

  const pinnedSide = header.pinned === "left" || header.pinned === "right" ? header.pinned : null;
  const canUnpin = Boolean(pinnedSide) && !isEssential;
  const canPinLeft = !pinnedSide && panelSection === "main";
  const canPinRight = !pinnedSide && panelSection === "main";

  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.effectAllowed = "move";
    if (rowIndex === undefined) return;
    clearHoverSeparator?.();
    setDraggingRow(flattenedHeaders[rowIndex]);
  };

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (rowIndex !== undefined && draggingRow && draggingRow.panelSection === panelSection) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseY = event.clientY;
      const rowMiddle = rect.top + rect.height / 2;
      const isTopHalfOfRow = mouseY < rowMiddle;

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
    if (
      !draggingRow ||
      hoveredSeparatorIndex === null ||
      draggingRow.panelSection !== panelSection
    ) {
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

    const haveSameParent =
      draggingRow.indexPath.length === hoveredHeader.indexPath.length &&
      (draggingRow.indexPath.length === 1 ||
        draggingRow.indexPath.slice(0, -1).every((idx, i) => idx === hoveredHeader.indexPath[i]));

    if (!haveSameParent) {
      cancelDrag();
      return;
    }

    let updatedHeaders: HeaderObject[];

    if (draggingRow.indexPath.length === 1) {
      const { newHeaders, emergencyBreak } = swapHeaders(
        headers,
        draggingRow.indexPath,
        hoveredHeader.indexPath,
      );

      if (emergencyBreak) {
        cancelDrag();
        return;
      }

      updatedHeaders = newHeaders;
    } else {
      const siblingArray = getSiblingArray(headers, draggingRow.indexPath);
      const { newHeaders, emergencyBreak } = swapHeaders(
        siblingArray,
        [draggingRow.indexPath[draggingRow.indexPath.length - 1]],
        [hoveredHeader.indexPath[hoveredHeader.indexPath.length - 1]],
      );

      if (emergencyBreak) {
        cancelDrag();
        return;
      }

      updatedHeaders = setSiblingArray(deepClone(headers), draggingRow.indexPath, newHeaders);
    }

    if (!applyHeaderOrder(updatedHeaders)) {
      cancelDrag();
      return;
    }
    cancelDrag();
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (!canToggleVisibility) return;

    header.hide = !checked;

    if (!checked) {
      updateParentHeaders(allHeaders);
    } else {
      findAndMarkParentsVisible(allHeaders, header.accessor);

      if (hasChildren && header.children && header.children.length > 0) {
        const allChildrenCurrentlyHidden = header.children.every((child) => child.hide === true);

        if (allChildrenCurrentlyHidden && header.children[0]) {
          header.children[0].hide = false;
          findAndMarkParentsVisible(allHeaders, header.children[0].accessor);
        }
      }
    }

    const updatedHeaders = [...headers];
    setHeaders(updatedHeaders);

    if (onColumnVisibilityChange) {
      const visibilityState = buildColumnVisibilityState(updatedHeaders);
      onColumnVisibilityChange(visibilityState);
    }
  };

  const ExpandIconComponent = doesAnyHeaderHaveChildren && hasChildren && (
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

  const CheckboxComponent = (
    <Checkbox checked={isChecked} disabled={!canToggleVisibility} onChange={handleCheckboxChange} />
  );

  const DragIconComponent = <div className="st-drag-icon-container">{icons.drag}</div>;

  const pinControl = {
    pinnedSide,
    canPinLeft,
    canPinRight,
    canUnpin,
    pinLeft,
    pinRight,
    unpin,
  };

  const pinnedSideMark =
    pinnedSide === "left"
      ? icons.pinnedLeftIcon
      : pinnedSide === "right"
        ? icons.pinnedRightIcon
        : null;

  const defaultPinIcon = !allowColumnPinning
    ? null
    : pinnedSide !== null && pinnedSideMark !== null ? (
      canUnpin ? (
        <button
          type="button"
          className="st-column-pin-btn st-column-pin-side st-column-pin-pinned-mark st-column-pin-pinned-active"
          aria-label="Unpin column"
          title="Unpin"
          onClick={(e) => {
            e.stopPropagation();
            unpin();
          }}
        >
          {pinnedSideMark}
        </button>
      ) : (
        <span
          className="st-column-pin-pinned-mark st-column-pin-side st-column-pin-pinned-essential st-column-pin-pinned-active"
          aria-hidden
          title="Pinned (essential)"
        >
          {pinnedSideMark}
        </span>
      )
    ) : panelSection === "main" && (canPinLeft || canPinRight) ? (
      <div className="st-column-pin-side-group">
        {canPinLeft ? (
          <button
            type="button"
            className="st-column-pin-btn st-column-pin-side st-column-pin-side-option"
            aria-label="Pin column to left"
            title="Pin to left"
            onClick={(e) => {
              e.stopPropagation();
              pinLeft();
            }}
          >
            {icons.pinnedLeftIcon}
          </button>
        ) : null}
        {canPinRight ? (
          <button
            type="button"
            className="st-column-pin-btn st-column-pin-side st-column-pin-side-option"
            aria-label="Pin column to right"
            title="Pin to right"
            onClick={(e) => {
              e.stopPropagation();
              pinRight();
            }}
          >
            {icons.pinnedRightIcon}
          </button>
        ) : null}
      </div>
    ) : null;

  const LabelContent = <div className="st-column-label-container">{header.label}</div>;

  const rowDraggable =
    rowIndex !== undefined &&
    !header.disableReorder &&
    !isHeaderEssential(header, essentialAccessors);

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
        draggable={rowDraggable}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {columnEditorConfig.rowRenderer ? (
          columnEditorConfig.rowRenderer({
            accessor: header.accessor,
            header,
            panelSection,
            isEssential,
            canToggleVisibility,
            allowColumnPinning,
            pinControl,
            components: {
              expandIcon: ExpandIconComponent || undefined,
              checkbox: CheckboxComponent,
              dragIcon: DragIconComponent,
              labelContent: LabelContent,
              pinIcon: allowColumnPinning ? (defaultPinIcon ?? undefined) : undefined,
            },
          })
        ) : (
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
            <Checkbox
              checked={isChecked}
              disabled={!canToggleVisibility}
              onChange={handleCheckboxChange}
            />
            {defaultPinIcon}
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
