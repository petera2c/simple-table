import { useState } from "react";
import Checkbox from "../../Checkbox";
import HeaderObject from "../../../types/HeaderObject";
import { useTableContext } from "../../../context/TableContext";
import { areAllChildrenHidden, findAndMarkParentsVisible } from "./columnEditorUtils";
import { updateParentHeaders } from "./columnEditorUtils";

// Recursive component to render headers with proper indentation
const ColumnEditorCheckbox = ({
  allHeaders,
  depth = 0,
  doesAnyHeaderHaveChildren,
  header,
  isCheckedOverride,
}: {
  allHeaders: HeaderObject[];
  depth?: number;
  doesAnyHeaderHaveChildren: boolean;
  header: HeaderObject;
  isCheckedOverride?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { expandIcon, headers, setHeaders } = useTableContext();
  const paddingLeft = doesAnyHeaderHaveChildren ? `${depth * 16}px` : "8px";
  const hasChildren = header.children && header.children.length > 0;

  const isChecked =
    isCheckedOverride ??
    (header.hide || (hasChildren && header.children && areAllChildrenHidden(header.children)));

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    // Update this header's state
    header.hide = checked;

    if (checked) {
      // If checked (hidden), check if we need to update any parents to be hidden
      updateParentHeaders(allHeaders);
    } else {
      // If unchecked (visible), ensure all parent headers are also visible
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
    setHeaders([...headers]);
  };

  return (
    <>
      <div className="st-header-checkbox-item" style={{ paddingLeft }}>
        {doesAnyHeaderHaveChildren && (
          <div className="st-header-icon-container">
            {hasChildren ? (
              <div
                className={`st-collapsible-header-icon st-expand-icon-container ${
                  isExpanded ? "expanded" : "collapsed"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {expandIcon}
              </div>
            ) : null}
          </div>
        )}
        <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
          {header.label}
        </Checkbox>
      </div>
      {hasChildren && isExpanded && header.children && (
        <div className="st-nested-headers">
          {header.children.map((childHeader, index) => (
            <ColumnEditorCheckbox
              allHeaders={allHeaders}
              depth={depth + 1}
              doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
              header={childHeader}
              key={`${childHeader.accessor}-${index}`}
              isCheckedOverride={isChecked ? true : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColumnEditorCheckbox;
