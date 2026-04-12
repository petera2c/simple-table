import { useState } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, CellChangeProps } from "@simple-table/react";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "@simple-table/react/styles.css";

const CellEditingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [data, setData] = useState([...cellEditingConfig.rows]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, [accessor]: newValue } : item
      )
    );
  };

  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(cellEditingConfig.headers)}
      rows={data}
      height={height}
      theme={theme}
      onCellEdit={handleCellEdit}
    />
  );
};

export default CellEditingDemo;
