import TableColumnEditorPopout from "./TableColumnEditorPopout";
import HeaderObject from "../../../types/HeaderObject";
import { COLUMN_EDIT_WIDTH } from "../../../consts/general-consts";
import { MergedColumnEditorConfig } from "../../../types/ColumnEditorConfig";

type TableColumnEditorProps = {
  columnEditorConfig: MergedColumnEditorConfig;
  editColumns: boolean;
  headers: HeaderObject[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableColumnEditor = ({
  columnEditorConfig,
  editColumns,
  headers,
  open,
  setOpen,
}: TableColumnEditorProps) => {
  const {
    text: columnEditorText,
    searchEnabled,
    searchPlaceholder,
    searchFunction,
    customRenderer,
  } = columnEditorConfig;
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
        customRenderer={customRenderer}
      />
    </div>
  );
};

export default TableColumnEditor;
