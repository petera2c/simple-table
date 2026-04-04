import { useState, useCallback } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, Row } from "@simple-table/react";
import {
  infiniteScrollConfig,
  generateInfiniteScrollData,
} from "./infinite-scroll.demo-data";
import "@simple-table/react/styles.css";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

const InfiniteScrollDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [rows, setRows] = useState<Row[]>(
    () => generateInfiniteScrollData(0, 30) as Row[]
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      setRows((prev) => {
        const newRows = generateInfiniteScrollData(prev.length, BATCH_SIZE) as Row[];
        const updated = [...prev, ...newRows];
        if (updated.length >= MAX_ROWS) {
          setHasMore(false);
        }
        return updated;
      });
      setLoading(false);
    }, 500);
  }, [loading, hasMore]);

  return (
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
        {rows.length} rows loaded{hasMore ? "" : " (all loaded)"}
      </div>
      <SimpleTable
        defaultHeaders={defaultHeadersFromCore(infiniteScrollConfig.headers)}
        rows={rows}
        onLoadMore={handleLoadMore}
        isLoading={loading}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default InfiniteScrollDemo;
