import { useEffect, RefObject } from "react";
import type { TableAPI, Row } from "@simple-table/react";

/**
 * Drives “live server metrics” without O(visible rows) concurrent `setTimeout` chains.
 * A single interval samples a few visible rows per tick and applies one metric each
 * (CPU + sparkline uses two `updateData` calls, at most once per tick).
 */
const TICK_MS = 800;
/** Max rows to touch per tick (each ≤ 2 `updateData` when CPU+history runs). */
const ROWS_PER_TICK = 4;

type MetricSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function pickRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function applyOneMetricUpdate(
  api: TableAPI,
  server: Row,
  actualRowIndex: number,
  slot: MetricSlot,
) {
  switch (slot) {
    case 0: {
      const currentCpu = server.cpuUsage as number;
      if (typeof currentCpu !== "number") return;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      api.updateData({
        accessor: "cpuUsage",
        rowIndex: actualRowIndex,
        newValue: newCpuRounded,
      });
      const currentHistory = server.cpuHistory as number[];
      if (Array.isArray(currentHistory) && currentHistory.length > 0) {
        const updatedHistory = [...currentHistory.slice(1), newCpuRounded];
        api.updateData({
          accessor: "cpuHistory",
          rowIndex: actualRowIndex,
          newValue: updatedHistory,
        });
      }
      break;
    }
    case 1: {
      const currentMemory = server.memoryUsage as number;
      if (typeof currentMemory !== "number") return;
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, currentMemory + memoryChange));
      api.updateData({
        accessor: "memoryUsage",
        rowIndex: actualRowIndex,
        newValue: Math.round(newMemory * 10) / 10,
      });
      break;
    }
    case 2: {
      const currentNetIn = server.networkIn as number;
      if (typeof currentNetIn !== "number") return;
      const netChange = (Math.random() - 0.5) * 100;
      const newNetIn = Math.max(0, currentNetIn + netChange);
      api.updateData({
        accessor: "networkIn",
        rowIndex: actualRowIndex,
        newValue: Math.round(newNetIn * 100) / 100,
      });
      break;
    }
    case 3: {
      const currentNetOut = server.networkOut as number;
      if (typeof currentNetOut !== "number") return;
      const netChange = (Math.random() - 0.5) * 60;
      const newNetOut = Math.max(0, currentNetOut + netChange);
      api.updateData({
        accessor: "networkOut",
        rowIndex: actualRowIndex,
        newValue: Math.round(newNetOut * 100) / 100,
      });
      break;
    }
    case 4: {
      const currentResponseTime = server.responseTime as number;
      if (typeof currentResponseTime !== "number") return;
      const responseChange = (Math.random() - 0.5) * 100;
      const newResponseTime = Math.max(10, currentResponseTime + responseChange);
      api.updateData({
        accessor: "responseTime",
        rowIndex: actualRowIndex,
        newValue: Math.round(newResponseTime * 10) / 10,
      });
      break;
    }
    case 5: {
      const currentConnections = server.activeConnections as number;
      if (typeof currentConnections !== "number") return;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      const newConnections = Math.max(0, currentConnections + connectionChange);
      api.updateData({
        accessor: "activeConnections",
        rowIndex: actualRowIndex,
        newValue: newConnections,
      });
      break;
    }
    case 6: {
      const currentRequests = server.requestsPerSec as number;
      if (typeof currentRequests !== "number") return;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      const newRequests = Math.max(0, currentRequests + requestChange);
      api.updateData({
        accessor: "requestsPerSec",
        rowIndex: actualRowIndex,
        newValue: newRequests,
      });
      break;
    }
    default:
      break;
  }
}

export function useServerMetricsUpdates(tableRef: RefObject<TableAPI>, data: Row[]) {
  useEffect(() => {
    let isActive = true;
    const idToIndex = new Map<string, number>();
    for (let i = 0; i < data.length; i++) {
      idToIndex.set(String(data[i]!.id), i);
    }

    const tick = () => {
      if (!isActive) return;
      const api = tableRef.current;
      if (!api) return;

      const visible = api.getVisibleRows();
      if (!visible.length) return;

      const picks = pickRandomSubset(visible, ROWS_PER_TICK);
      let usedCpuSparkline = false;

      for (const vr of picks) {
        const rowId = String(vr.row.id);
        const idx = idToIndex.get(rowId);
        if (idx === undefined) continue;

        let slot = Math.floor(Math.random() * 7) as MetricSlot;
        if (slot === 0 && usedCpuSparkline) {
          slot = (1 + Math.floor(Math.random() * 6)) as MetricSlot;
        }
        if (slot === 0) {
          usedCpuSparkline = true;
        }

        applyOneMetricUpdate(api, data[idx]!, idx, slot);
      }
    };

    tick();
    const intervalId = setInterval(tick, TICK_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [tableRef, data]);
}
