import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";

type TableColumnEditorPopoutProps = {
  headers: HeaderObject[];
  open: boolean;
  position: "left" | "right";
  setHiddenColumns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  hiddenColumns: { [key: string]: boolean };
};

const TableColumnEditorPopout = ({
  headers,
  open,
  position,
  setHiddenColumns,
  hiddenColumns,
}: TableColumnEditorPopoutProps) => {
  const positionClass = position === "left" ? "left" : "";

  return (
    <div
      className={`st-column-editor-popout ${open ? "open" : ""} ${positionClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">
        {headers.map((header, index) => (
          <ColumnEditorCheckbox
            key={`${header.accessor}-${index}`}
            header={header}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
            allHeaders={headers}
          />
        ))}
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
