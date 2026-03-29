import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import type { CellChangeProps } from "simple-table-core";
import { cellEditingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
      defaultHeaders={cellEditingConfig.headers}
      rows={data}
      height={height}
      theme={theme}
      onCellEdit={handleCellEdit}
    />
  );
};

export default CellEditingDemo;
