import { useEffect, RefObject } from "react";
import type { TableAPI, Row, CellValue } from "@simple-table/react";

const TICK_MS = 20;
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

function applyRowPatch(api: TableAPI, rowIndex: number, patch: Partial<Row>) {
  for (const accessor of Object.keys(patch)) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({
      accessor,
      rowIndex,
      newValue: newValue as CellValue,
    });
  }
}

function computeMetricPatch(row: Row, slot: MetricSlot): Partial<Row> | null {
  switch (slot) {
    case 0: {
      const currentCpu = row.cpuUsage as number;
      if (typeof currentCpu !== "number") return null;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      const currentHistory = row.cpuHistory as number[];
      if (Array.isArray(currentHistory) && currentHistory.length > 0) {
        const updatedHistory = [...currentHistory.slice(1), newCpuRounded];
        return { cpuUsage: newCpuRounded, cpuHistory: updatedHistory };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      const currentMemory = row.memoryUsage as number;
      if (typeof currentMemory !== "number") return null;
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, currentMemory + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      const currentNetIn = row.networkIn as number;
      if (typeof currentNetIn !== "number") return null;
      const netChange = (Math.random() - 0.5) * 100;
      const newNetIn = Math.max(0, currentNetIn + netChange);
      return { networkIn: Math.round(newNetIn * 100) / 100 };
    }
    case 3: {
      const currentNetOut = row.networkOut as number;
      if (typeof currentNetOut !== "number") return null;
      const netChange = (Math.random() - 0.5) * 60;
      const newNetOut = Math.max(0, currentNetOut + netChange);
      return { networkOut: Math.round(newNetOut * 100) / 100 };
    }
    case 4: {
      const currentResponseTime = row.responseTime as number;
      if (typeof currentResponseTime !== "number") return null;
      const responseChange = (Math.random() - 0.5) * 100;
      const newResponseTime = Math.max(10, currentResponseTime + responseChange);
      return { responseTime: Math.round(newResponseTime * 10) / 10 };
    }
    case 5: {
      const currentConnections = row.activeConnections as number;
      if (typeof currentConnections !== "number") return null;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      const newConnections = Math.max(0, currentConnections + connectionChange);
      return { activeConnections: newConnections };
    }
    case 6: {
      const currentRequests = row.requestsPerSec as number;
      if (typeof currentRequests !== "number") return null;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      const newRequests = Math.max(0, currentRequests + requestChange);
      return { requestsPerSec: newRequests };
    }
    default:
      return null;
  }
}

/**
 * Drives “live server metrics” without O(visible rows) concurrent `setTimeout` chains.
 * A single interval samples a few visible rows per tick and applies one metric patch each.
 */
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

        const patch = computeMetricPatch(vr.row, slot);
        if (patch) {
          applyRowPatch(api, idx, patch);
        }
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
