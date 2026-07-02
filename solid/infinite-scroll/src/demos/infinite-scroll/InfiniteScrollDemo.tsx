import { createSignal, createMemo } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme, Row } from "@simple-table/solid";
import { infiniteScrollConfig, generateInfiniteScrollData } from "./infinite-scroll.demo-data";
import "@simple-table/solid/styles.css";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

export default function InfiniteScrollDemo(props: { height?: string | number; theme?: Theme }) {
  const [rows, setRows] = createSignal<Row[]>(generateInfiniteScrollData(0, 30) as Row[]);
  const [loading, setLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);

  const statusText = createMemo(() =>
    `${rows().length} rows loaded${hasMore() ? "" : " (all loaded)"}`
  );

  const handleLoadMore = () => {
    if (loading() || !hasMore()) return;
    setLoading(true);
    setTimeout(() => {
      setRows((prev) => {
        const newRows = generateInfiniteScrollData(prev.length, BATCH_SIZE) as Row[];
        const updated = [...prev, ...newRows];
        if (updated.length >= MAX_ROWS) setHasMore(false);
        return updated;
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <div style={{ "margin-bottom": "8px", "font-size": "13px", color: "#666" }}>
        {statusText()}
      </div>
      <SimpleTable
        defaultHeaders={infiniteScrollConfig.headers}
        rows={rows()}
        onLoadMore={handleLoadMore}
        isLoading={loading()}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
