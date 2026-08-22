import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "@simple-table/solid/styles.css";

export default function CellEditingDemo(props: { height?: string | number; theme?: Theme }) {
  const [data, setData] = createSignal([...cellEditingConfig.rows]);

  return (
    <SimpleTable
      columns={cellEditingConfig.headers}
      getRowId={({ row }) => row.id}
      rows={data()}
      height={props.height ?? "400px"}
      theme={props.theme}
      onCellEdit={({ accessor, newValue, row }) => {
        setData((prev) =>
          prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)),
        );
      }}
    />
  );
}
