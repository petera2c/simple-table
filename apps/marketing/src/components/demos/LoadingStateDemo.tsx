import { useState, useEffect, useCallback, useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

const HEADERS: ReactHeaderObject[] = [
  { accessor: "id", label: "Project ID", width: 80, type: "number" },
  { accessor: "projectName", label: "Project Name", width: "1fr", minWidth: 120, type: "string" },
  { accessor: "client", label: "Client", width: 180, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "budget", label: "Budget", width: 110, type: "string" },
];

const STATUSES = ["In Progress", "Planning", "Testing", "Completed"] as const;
const CLIENTS = [
  "TechVenture Labs",
  "RetailMax Solutions",
  "DataFlow Systems",
  "SmartMetrics Inc",
  "CyberShield Corp",
  "MediaWave Digital",
  "FinTech Innovations",
  "AI Dynamics Group",
];
const PROJECT_NAMES = [
  "Phoenix Analytics Platform",
  "Quantum E-Commerce Rebuild",
  "CloudSync Mobile App",
  "AI Dashboard Integration",
  "SecureVault Authentication",
  "StreamLine Video Platform",
  "BlockChain Payment Gateway",
  "Neural Network API",
  "RealTime Chat Engine",
  "Inventory Optimization Suite",
  "HealthTrack Wellness App",
  "AutoScale Cloud Migration",
];

type ProjectRow = {
  id: number;
  projectName: string;
  client: string;
  status: (typeof STATUSES)[number];
  budget: string;
};

const BATCH_SIZE = 12;
const MAX_ROWS = 60;

const createRows = (startId: number, count: number): ProjectRow[] =>
  Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    return {
      id,
      projectName: PROJECT_NAMES[id % PROJECT_NAMES.length],
      client: CLIENTS[id % CLIENTS.length],
      status: STATUSES[id % STATUSES.length],
      budget: `$${150 + ((id * 17) % 400)}K`,
    };
  });

const INITIAL_ROWS = createRows(1001, BATCH_SIZE);

const LoadingStateDemo = ({ theme }: { height?: string | number; theme?: Theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ProjectRow[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadInitial = useCallback(() => {
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    loadingRef.current = true;
    setHasMore(true);
    setData([]);
    setIsLoading(true);
    reloadTimerRef.current = setTimeout(() => {
      setData(INITIAL_ROWS);
      setIsLoading(false);
      loadingRef.current = false;
    }, 2000);
  }, []);

  useEffect(() => {
    loadInitial();
    return () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    };
  }, [loadInitial]);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    setTimeout(() => {
      setData((prev) => {
        if (prev.length >= MAX_ROWS) {
          setHasMore(false);
          return prev;
        }
        const nextStartId = (prev[prev.length - 1]?.id ?? 1000) + 1;
        const nextBatch = createRows(nextStartId, BATCH_SIZE);
        const updated = [...prev, ...nextBatch];
        if (updated.length >= MAX_ROWS) setHasMore(false);
        return updated;
      });
      setIsLoading(false);
      loadingRef.current = false;
    }, 1000);
  }, [hasMore]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={loadInitial}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Data
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {data.length} rows loaded
          {isLoading && data.length > 0 ? " · loading more…" : ""}
          {!hasMore ? " (all loaded)" : ""}
        </span>
      </div>
      <SimpleTable
        defaultHeaders={HEADERS}
        height="380px"
        isLoading={isLoading}
        rows={data}
        onLoadMore={handleLoadMore}
        theme={theme}
      />
    </div>
  );
};

export default LoadingStateDemo;
