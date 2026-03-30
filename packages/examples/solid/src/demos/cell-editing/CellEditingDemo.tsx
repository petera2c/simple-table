import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, CellChangeProps } from "@simple-table/solid";
import { cellEditingConfig } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function CellEditingDemo(props: { height?: string | number; theme?: Theme }) {
  const [data, setData] = createSignal([...cellEditingConfig.rows]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item))
    );
  };

  return (
    <SimpleTable
      defaultHeaders={cellEditingConfig.headers}
      rows={data()}
      height={props.height ?? "400px"}
      theme={props.theme}
      onCellEdit={handleCellEdit}
    />
  );
}
