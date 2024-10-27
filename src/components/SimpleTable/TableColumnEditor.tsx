import { useState } from "react";
import HeaderObject from "../../types/HeaderObject";

type TableColumnEditorProps = {
  editColumns: boolean;
  headersRef: React.MutableRefObject<HeaderObject[]>;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

const TableColumnEditor = ({
  editColumns,
  headersRef,
  onTableHeaderDragEnd,
}: TableColumnEditorProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`st-column-editor ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      Columns
    </div>
  );
};

export default TableColumnEditor;
