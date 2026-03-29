import { createSignal, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { columnWidthConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ColumnWidthDemo(props: { height?: string | number; theme?: Theme }) {
  const [isMobile, setIsMobile] = createSignal(false);

  const check = () => setIsMobile(window.innerWidth < 768);

  onMount(() => {
    check();
    window.addEventListener("resize", check);
  });

  onCleanup(() => {
    window.removeEventListener("resize", check);
  });

  return (
    <SimpleTable
      autoExpandColumns={!isMobile()}
      columnResizing
      defaultHeaders={columnWidthConfig.headers}
      height={props.height ?? "400px"}
      rows={columnWidthConfig.rows}
      theme={props.theme}
    />
  );
}
