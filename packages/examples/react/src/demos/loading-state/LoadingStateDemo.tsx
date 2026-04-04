import { useState, useEffect, useCallback } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, Row } from "@simple-table/react";
import { loadingStateConfig } from "./loading-state.demo-data";
import "@simple-table/react/styles.css";

const LoadingStateDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Row[]>([]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setData([]);
    const timer = setTimeout(() => {
      setData(loadingStateConfig.rows as Row[]);
      setIsLoading(false);
    }, 2000);
    return timer;
  }, []);

  useEffect(() => {
    const timer = loadData();
    return () => clearTimeout(timer);
  }, [loadData]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => loadData()}
          disabled={isLoading}
          style={{
            padding: "6px 16px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading…" : "Reload Data"}
        </button>
      </div>
      <SimpleTable
        defaultHeaders={defaultHeadersFromCore(loadingStateConfig.headers)}
        rows={data}
        isLoading={isLoading}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default LoadingStateDemo;
