import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../../../types/HeaderObject";
import Checkbox from "../../Checkbox";

type TableColumnEditorPopoutProps = {
  headers: HeaderObject[];
  open: boolean;
  position: "left" | "right";
  setOpen: (open: boolean) => void;
  setHiddenColumns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  hiddenColumns: { [key: string]: boolean };
};
const TableColumnEditorPopout = ({
  headers,
  open,
  position,
  setOpen,
  setHiddenColumns,
  hiddenColumns,
}: TableColumnEditorPopoutProps) => {
  const positionClass = position === "left" ? "left" : "";

  return (
    <div
      className={`st-column-editor-popout ${
        open ? "open" : ""
      } ${positionClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">
        {headers.map((header, index) => (
          <Checkbox
            checked={hiddenColumns[header.accessor]}
            key={index}
            onChange={(checked) =>
              setHiddenColumns({
                ...hiddenColumns,
                [header.accessor]: checked,
              })
            }
          >
            {header.label}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
