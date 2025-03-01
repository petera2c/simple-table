import { Dispatch, SetStateAction, useState } from "react";
import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";

type TableColumnEditorProps = {
  headers: HeaderObject[];
  columnEditorText: string;
  editColumns: boolean;
  editColumnsInitOpen: boolean;
  position: "left" | "right";
  setHiddenColumns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  hiddenColumns: { [key: string]: boolean };
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  editColumnsInitOpen,
  headers,
  position = "right",
  setHiddenColumns,
  hiddenColumns,
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
