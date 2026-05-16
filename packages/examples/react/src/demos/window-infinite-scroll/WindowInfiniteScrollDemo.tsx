import { useCallback, useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Row, Theme } from "@simple-table/react";
import {
  generateWindowScrollRows,
  windowScrollHeaders,
} from "./window-infinite-scroll.demo-data";
import "@simple-table/react/styles.css";

const INITIAL_ROWS = 50;
const BATCH_SIZE = 50;
const MAX_ROWS = 5_000;
const LOAD_DELAY_MS = 350;

/**
 * Window-style infinite scroll demo.
 *
 * The table has no `height` / `maxHeight` — it grows to its natural size inside
 * whatever scroll parent surrounds it. `scrollParent` is a getter that resolves
 * to the nearest scrollable ancestor at render time (the demo shell wraps
 * everything in a scrollable `<main>`, so `window` itself doesn't scroll inside
 * this preview). In a typical app you'd just pass `scrollParent="window"`.
 *
 * As the user scrolls toward the bottom, `onLoadMore` appends a batch of rows
 * until the dataset cap is reached.
 */
const WindowInfiniteScrollDemo = ({
  theme,
}: {
  // `height` is intentionally ignored — this demo is about *not* setting one.
  height?: string | number;
  theme?: Theme;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState<Row[]>(() => generateWindowScrollRows(0, INITIAL_ROWS));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      setRows((prev) => {
        const next = generateWindowScrollRows(prev.length, BATCH_SIZE);
        const updated = [...prev, ...next];
        if (updated.length >= MAX_ROWS) {
          setHasMore(false);
          return updated.slice(0, MAX_ROWS);
        }
        return updated;
      });
      setLoading(false);
    }, LOAD_DELAY_MS);
  }, [loading, hasMore]);

  const statusLabel = loading
    ? "Loading more rows…"
    : hasMore
      ? `${rows.length.toLocaleString()} rows loaded · scroll for more`
      : `${rows.length.toLocaleString()} rows loaded · end of dataset`;

  return (
    <div ref={wrapperRef} style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: 28,
          margin: "0 0 12px 0",
          color: "#0f172a",
        }}
      >
        Window-Scroll Infinite Loading
      </h1>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: "#475569",
          margin: "0 0 16px 0",
        }}
      >
        This table has no <code>height</code> or <code>maxHeight</code>. It grows to its natural
        size inside the page, and uses the outer scroll container (<code>scrollParent</code>) to
        drive both row virtualization and <code>onLoadMore</code>. Scroll down — new rows stream
        in as you approach the bottom.
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          marginBottom: 16,
          background: "#eef2ff",
          color: "#3730a3",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#6366f1",
          }}
        />
        <span>{statusLabel}</span>
      </div>

      <SimpleTable
        defaultHeaders={windowScrollHeaders}
        rows={rows}
        theme={theme}
        getRowId={(p) => String((p.row as { id?: number })?.id)}
        // Getter form so we don't capture the wrapper before React attaches the ref.
        // In a regular app outside this preview shell, pass scrollParent="window".
        scrollParent={() => wrapperRef.current?.parentElement ?? null}
        infiniteScrollThreshold={400}
        onLoadMore={handleLoadMore}
        isLoading={loading && rows.length === 0}
      />

      <p
        style={{
          fontSize: 13,
          color: "#94a3b8",
          margin: "24px 0 48px 0",
          textAlign: "center",
        }}
      >
        End of demo content. Keep scrolling near the bottom and onLoadMore will keep firing until
        the dataset is exhausted.
      </p>
    </div>
  );
};

export default WindowInfiniteScrollDemo;
