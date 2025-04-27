import { SetStateAction, useState } from "react";
import { Dispatch } from "react";
import Checkbox from "../../Checkbox";
import HeaderObject from "../../../types/HeaderObject";
import { useTableContext } from "../../../context/TableContext";
import { areAllChildrenHidden, findAndMarkParentsVisible } from "./columnEditorUtils";
import { updateParentHeaders } from "./columnEditorUtils";
import { recalculateAllSectionWidths } from "../../../utils/resizeUtils";

// Recursive component to render headers with proper indentation
const ColumnEditorCheckbox = ({
  allHeaders,
  depth = 0,
  header,
  hiddenColumns,
  setHiddenColumns,
}: {
  allHeaders: HeaderObject[];
  depth?: number;
  header: HeaderObject;
  hiddenColumns: { [key: string]: boolean };
  setHiddenColumns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    expandIcon,
    collapseIcon,
    headersRef,
    setMainBodyWidth,
    setPinnedLeftWidth,
    setPinnedRightWidth,
  } = useTableContext();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked =
    hiddenColumns[header.accessor] ||
    (hasChildren && header.children && areAllChildrenHidden(header.children, hiddenColumns));

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    // Create updated state
    const updatedHiddenColumns = { ...hiddenColumns };

    // Update this header's state
    updatedHiddenColumns[header.accessor] = checked;

    if (checked) {
      // If checked (hidden), check if we need to update any parents to be hidden
      updateParentHeaders(allHeaders, updatedHiddenColumns);
    } else {
      // If unchecked (visible), ensure all parent headers are also visible
      findAndMarkParentsVisible(allHeaders, header.accessor, updatedHiddenColumns);

      // If this is a parent header being made visible, and all its children are hidden,
      // make at least the first child visible for better UX
      if (hasChildren && header.children && header.children.length > 0) {
        const allChildrenCurrentlyHidden = header.children.every(
          (child) => hiddenColumns[child.accessor] === true
        );

        if (allChildrenCurrentlyHidden && header.children[0]) {
          // Make the first child visible
          updatedHiddenColumns[header.children[0].accessor] = false;

          // Also make sure any parents of the child we just made visible are also visible
          findAndMarkParentsVisible(allHeaders, header.children[0].accessor, updatedHiddenColumns);
        }
      }
    }

    // Update state
    setHiddenColumns(updatedHiddenColumns);

    // Apply hide/show state to headers
    headersRef.current.forEach((header) => {
      header.hide = updatedHiddenColumns[header.accessor] === true;
    });

    // Recalculate section widths
    recalculateAllSectionWidths({
      headers: headersRef.current,
      setMainBodyWidth,
      setPinnedLeftWidth,
      setPinnedRightWidth,
    });
  };

  return (
    <>
      <div className="st-header-checkbox-item" style={{ paddingLeft }}>
        <div className="st-header-icon-container">
          {hasChildren ? (
            <div
              className="st-collapsible-header-icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? collapseIcon : expandIcon}
            </div>
          ) : null}
        </div>
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
              header={childHeader}
              hiddenColumns={hiddenColumns}
              key={`${childHeader.accessor}-${index}`}
              setHiddenColumns={setHiddenColumns}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColumnEditorCheckbox;
