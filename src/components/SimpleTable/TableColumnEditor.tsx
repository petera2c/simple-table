import { useState } from "react";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
}: TableColumnEditorProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (open: boolean) => {
    setOpen(!open);
  };

  if (!editColumns) return null;

  return (
    <div
      className={`st-column-editor ${open ? "open" : ""}`}
      onClick={() => handleClick(!open)}
    >
      {columnEditorText}
    </div>
  );
};

export default TableColumnEditor;
