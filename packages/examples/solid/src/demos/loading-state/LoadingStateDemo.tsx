import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { loadingStateConfig } from "@simple-table/examples-shared";
import { createSignal, onMount } from "solid-js";
import "simple-table-core/styles.css";

export default function LoadingStateDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    setTimeout(() => setIsLoading(false), 2000);
  });

  const reload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div>
      <div style={{ "margin-bottom": "8px" }}>
        <button onClick={reload}>Reload Data</button>
      </div>
      <SimpleTable
        defaultHeaders={loadingStateConfig.headers}
        rows={loadingStateConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
        isLoading={isLoading()}
      />
    </div>
  );
}
