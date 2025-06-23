import { useMemo } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";

type TableColumnEditorPopoutProps = {
  headers: HeaderObject[];
  open: boolean;
  position: "left" | "right";
};

const TableColumnEditorPopout = ({ headers, open, position }: TableColumnEditorPopoutProps) => {
  const positionClass = position === "left" ? "left" : "";
  const doesAnyHeaderHaveChildren = useMemo(
    () =>
      headers
        .filter((header) => !header.hide)
        .some((header) => header.children && header.children.length > 0),
    [headers]
  );

  return (
    <div
      className={`st-column-editor-popout ${open ? "open" : ""} ${positionClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">
        {headers.map((header, index) => (
          <ColumnEditorCheckbox
            doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
            key={`${header.accessor}-${index}`}
            header={header}
            allHeaders={headers}
          />
        ))}
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
