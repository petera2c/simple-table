import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";
import { COLUMN_EDIT_WIDTH } from "../../../consts/general-consts";
import { ColumnEditorSearchFunction } from "../../../types/ColumnEditorConfig";

type TableColumnEditorProps = {
  columnEditorText: string;
  editColumns: boolean;
  headers: HeaderObject[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableColumnEditor = ({
  columnEditorText,
  editColumns,
  headers,
  open,
  searchEnabled,
  searchPlaceholder,
  searchFunction,
  setOpen,
}: TableColumnEditorProps) => {
  const handleClick = () => {
    setOpen(!open);
  };

  if (!editColumns) return null;

  return (
    <div
      className={`st-column-editor ${open ? "open" : ""}`}
      onClick={handleClick}
      style={{ width: COLUMN_EDIT_WIDTH }}
    >
      <div className="st-column-editor-text">{columnEditorText}</div>
      <TableColumnEditorPopout
        headers={headers}
        open={open}
        searchEnabled={searchEnabled}
        searchPlaceholder={searchPlaceholder}
        searchFunction={searchFunction}
      />
    </div>
  );
};

export default TableColumnEditor;
