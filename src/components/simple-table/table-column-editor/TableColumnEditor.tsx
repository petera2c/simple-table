import { useState } from "react";
import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";
import { COLUMN_EDIT_WIDTH } from "../../../consts/general-consts";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
  editColumnsInitOpen: boolean;
  headers: HeaderObject[];
  position: "left" | "right";
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  editColumnsInitOpen,
  headers,
  position = "right",
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
      <TableColumnEditorPopout headers={headers} open={open} position={position} />
    </div>
  );
};

export default TableColumnEditor;
