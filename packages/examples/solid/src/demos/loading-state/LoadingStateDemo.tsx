import { createSignal, onMount, onCleanup } from "solid-js";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/solid";
import type { Theme, Row } from "@simple-table/solid";
import { loadingStateConfig } from "./loading-state.demo-data";
import "@simple-table/solid/styles.css";

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
        defaultHeaders={defaultHeadersFromCore(loadingStateConfig.headers)}
        rows={data()}
        isLoading={isLoading()}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
