import { Dispatch, SetStateAction, useState } from "react";
import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";
import { COLUMN_EDIT_WIDTH } from "../../../consts/general-consts";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
  editColumnsInitOpen: boolean;
  headers: HeaderObject[];
  hiddenColumns: { [key: string]: boolean };
  position: "left" | "right";
  setHiddenColumns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  editColumnsInitOpen,
  headers,
  hiddenColumns,
  position = "right",
  setHiddenColumns,
}: TableColumnEditorProps) => {
  const [open, setOpen] = useState(editColumnsInitOpen);

  const handleClick = (open: boolean) => {
    setOpen(open);
  };

  if (!editColumns) return null;

  return (
    <div
      className={`st-column-editor ${open ? "open" : ""} ${position}`}
      onClick={() => handleClick(!open)}
      style={{ width: COLUMN_EDIT_WIDTH }}
    >
      <div className="st-column-editor-text">{columnEditorText}</div>
      <TableColumnEditorPopout
        headers={headers}
        open={open}
        position={position}
        setOpen={setOpen}
        setHiddenColumns={setHiddenColumns}
        hiddenColumns={hiddenColumns}
      />
    </div>
  );
};

export default TableColumnEditor;
