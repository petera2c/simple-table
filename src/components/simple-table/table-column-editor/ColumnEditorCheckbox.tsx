import { useState } from "react";
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
}: {
  allHeaders: HeaderObject[];
  depth?: number;
  doesAnyHeaderHaveChildren: boolean;
  header: HeaderObject;
  isCheckedOverride?: boolean;
  forceExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { dragIcon, expandIcon, headers, setHeaders, onColumnVisibilityChange } = useTableContext();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked =
    isCheckedOverride ??
    !(header.hide || (hasChildren && header.children && areAllChildrenHidden(header.children)));

  // Use forceExpanded when searching to show all matching children
  const shouldExpand = forceExpanded || isExpanded;

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
      <div className="st-header-checkbox-item" style={{ paddingLeft }}>
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
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColumnEditorCheckbox;
