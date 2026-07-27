import { useEffect, RefObject } from "react";
import type { TableAPI } from "@simple-table/react";
import type { InfrastructureServer } from "./useInfrastructureData";

/** Slightly slower than frame budget so live updates + scroll rarely pile on one rAF. */
const TICK_MS = 10;
const ROWS_PER_TICK = 3;

const METRIC_SLOTS = [0, 1, 2, 3, 4, 5, 6] as const;
type MetricSlot = (typeof METRIC_SLOTS)[number];

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

function randomMetricSlot(fromIndex = 0): MetricSlot {
  const pool = METRIC_SLOTS.slice(fromIndex);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function applyRowPatch(
  api: TableAPI<InfrastructureServer>,
  rowId: string | number,
  patch: Partial<InfrastructureServer>,
) {
  if (patch.cpuUsage !== undefined) {
    api.updateData({ accessor: "cpuUsage", rowId, newValue: patch.cpuUsage });
  }
  if (patch.cpuHistory !== undefined) {
    api.updateData({ accessor: "cpuHistory", rowId, newValue: patch.cpuHistory });
  }
  if (patch.memoryUsage !== undefined) {
    api.updateData({ accessor: "memoryUsage", rowId, newValue: patch.memoryUsage });
  }
  if (patch.networkIn !== undefined) {
    api.updateData({ accessor: "networkIn", rowId, newValue: patch.networkIn });
  }
  if (patch.networkOut !== undefined) {
    api.updateData({ accessor: "networkOut", rowId, newValue: patch.networkOut });
  }
  if (patch.responseTime !== undefined) {
    api.updateData({ accessor: "responseTime", rowId, newValue: patch.responseTime });
  }
  if (patch.activeConnections !== undefined) {
    api.updateData({ accessor: "activeConnections", rowId, newValue: patch.activeConnections });
  }
  if (patch.requestsPerSec !== undefined) {
    api.updateData({ accessor: "requestsPerSec", rowId, newValue: patch.requestsPerSec });
  }
}

function computeMetricPatch(
  row: InfrastructureServer,
  slot: MetricSlot,
): Partial<InfrastructureServer> | null {
  switch (slot) {
    case 0: {
      const currentCpu = row.cpuUsage;
      if (typeof currentCpu !== "number") return null;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      const currentHistory = row.cpuHistory;
      if (Array.isArray(currentHistory) && currentHistory.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...currentHistory.slice(1), newCpuRounded] };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      const currentMemory = row.memoryUsage;
      if (typeof currentMemory !== "number") return null;
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, currentMemory + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      const currentNetIn = row.networkIn;
      if (typeof currentNetIn !== "number") return null;
      const netChange = (Math.random() - 0.5) * 100;
      return { networkIn: Math.round(Math.max(0, currentNetIn + netChange) * 100) / 100 };
    }
    case 3: {
      const currentNetOut = row.networkOut;
      if (typeof currentNetOut !== "number") return null;
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, currentNetOut + netChange) * 100) / 100 };
    }
    case 4: {
      const currentResponseTime = row.responseTime;
      if (typeof currentResponseTime !== "number") return null;
      const responseChange = (Math.random() - 0.5) * 100;
      return {
        responseTime: Math.round(Math.max(10, currentResponseTime + responseChange) * 10) / 10,
      };
    }
    case 5: {
      const currentConnections = row.activeConnections;
      if (typeof currentConnections !== "number") return null;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, currentConnections + connectionChange) };
    }
    case 6: {
      const currentRequests = row.requestsPerSec;
      if (typeof currentRequests !== "number") return null;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, currentRequests + requestChange) };
    }
    default:
      return null;
  }
}

/**
 * Drives “live server metrics” without O(visible rows) concurrent `setTimeout` chains.
 * A single interval samples a few visible rows per tick and applies one metric patch each.
 */
export function useServerMetricsUpdates(
  tableRef: RefObject<TableAPI<InfrastructureServer> | null>,
  _data: InfrastructureServer[],
) {
  useEffect(() => {
    let isActive = true;

    const tick = () => {
      if (!isActive) return;
      const api = tableRef.current;
      if (!api) return;

      const visible = api.getVisibleRows();
      if (!visible.length) return;

      const picks = pickRandomSubset(visible, ROWS_PER_TICK);
      let usedCpuSparkline = false;

      for (const vr of picks) {
        const rowId = vr.row.id;
        if (rowId === undefined || rowId === null || rowId === "") continue;

        let slot = randomMetricSlot();
        if (slot === 0 && usedCpuSparkline) slot = randomMetricSlot(1);
        if (slot === 0) usedCpuSparkline = true;

        const patch = computeMetricPatch(vr.row, slot);
        if (patch) applyRowPatch(api, rowId, patch);
      }
    };

    tick();
    const intervalId = setInterval(tick, TICK_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [tableRef]);
}
