import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { infiniteScrollConfig } from "@simple-table/examples-shared";
import { createSignal } from "solid-js";
import "simple-table-core/styles.css";

export default function InfiniteScrollDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [rows, setRows] = createSignal([...infiniteScrollConfig.rows]);

  const handleLoadMore = () => {
    const currentRows = rows();
    const nextId = currentRows.length + 1;
    const newRows = Array.from({ length: 20 }, (_, i) => ({
      id: nextId + i,
    }));
    setRows([...currentRows, ...newRows]);
  };

  return (
    <SimpleTable
      defaultHeaders={infiniteScrollConfig.headers}
      rows={rows()}
      height={props.height ?? "400px"}
      theme={props.theme}
      onLoadMore={handleLoadMore}
    />
  );
}
