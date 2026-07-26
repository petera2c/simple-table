import { useState, useEffect, useCallback } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { loadingStateConfig, type LoadingStateEmployee } from "./loading-state.demo-data";
import "@simple-table/react/styles.css";

const LoadingStateDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<LoadingStateEmployee[]>([]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setData([]);
    const timer = setTimeout(() => {
      setData([...loadingStateConfig.rows]);
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
      <SimpleTable<LoadingStateEmployee>
        columns={loadingStateConfig.headers}
        getRowId={({ row }) => row.id}
        rows={data}
        isLoading={isLoading}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default LoadingStateDemo;
