import { createSignal, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import type { Row } from "simple-table-core";
import { loadingStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function LoadingStateDemo(props: { height?: string | number; theme?: Theme }) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [data, setData] = createSignal<Row[]>([]);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const loadData = () => {
    setIsLoading(true);
    setData([]);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setData(loadingStateConfig.rows as Row[]);
      setIsLoading(false);
    }, 2000);
  };

  onMount(() => loadData());
  onCleanup(() => { if (timer) clearTimeout(timer); });

  return (
    <div>
      <div style={{ "margin-bottom": "12px" }}>
        <button
          onClick={loadData}
          disabled={isLoading()}
          style={{ padding: "6px 16px", cursor: isLoading() ? "not-allowed" : "pointer" }}
        >
          {isLoading() ? "Loading\u2026" : "Reload Data"}
        </button>
      </div>
      <SimpleTable
        defaultHeaders={loadingStateConfig.headers}
        rows={data()}
        isLoading={isLoading()}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
