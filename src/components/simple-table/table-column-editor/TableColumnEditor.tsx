import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";
import { COLUMN_EDIT_WIDTH } from "../../../consts/general-consts";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
  headers: HeaderObject[];
  open: boolean;
  position: "left" | "right";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  headers,
  open,
  position = "right",
  setOpen,
}: TableColumnEditorProps) => {
  const handleClick = () => {
    setOpen(!open);
  };

  if (!editColumns) return null;

  return (
    <div
      className={`st-column-editor ${open ? "open" : ""} ${position}`}
      onClick={handleClick}
      style={{ width: COLUMN_EDIT_WIDTH }}
    >
      <div className="st-column-editor-text">{columnEditorText}</div>
      <TableColumnEditorPopout headers={headers} open={open} position={position} />
    </div>
  );
};

export default TableColumnEditor;
