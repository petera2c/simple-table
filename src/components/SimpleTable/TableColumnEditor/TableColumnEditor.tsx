import { useState } from "react";
import TableColumnEditorPopout from "./TableColumnEditorPopout";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
  position: "left" | "right";
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  position = "right",
}: TableColumnEditorProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (open: boolean) => {
    setOpen(open);
  };

  if (!editColumns) return null;

  return (
    <div
      className={`st-column-editor ${open ? "open" : ""} ${position}`}
      onClick={() => handleClick(!open)}
    >
      <div className="st-column-editor-text">{columnEditorText}</div>
      <TableColumnEditorPopout
        open={open}
        position={position}
        setOpen={setOpen}
      />
    </div>
  );
};

export default TableColumnEditor;
