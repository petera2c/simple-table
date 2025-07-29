import { useMemo } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";

type TableColumnEditorPopoutProps<T> = {
  headers: HeaderObject<T>[];
  open: boolean;
  position: "left" | "right";
};

const TableColumnEditorPopout = <T,>({
  headers,
  open,
  position,
}: TableColumnEditorPopoutProps<T>) => {
  const positionClass = position === "left" ? "left" : "";
  const doesAnyHeaderHaveChildren = useMemo(
    () => headers.some((header) => header.children && header.children.length > 0),
    [headers]
  );

  return (
    <div
      className={`st-column-editor-popout ${open ? "open" : ""} ${positionClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">
        {headers.map((header, index) => {
          if (header.isSelectionColumn) {
            return null;
          }
          return (
            <ColumnEditorCheckbox
              doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
              key={`${header.accessor}-${index}`}
              header={header}
              allHeaders={headers}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
