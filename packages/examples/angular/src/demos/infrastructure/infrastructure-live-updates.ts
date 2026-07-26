import type { CellValue, Row, TableAPI } from "@simple-table/angular";
import type { InfrastructureServer } from "./infrastructure.demo-data";

const INFRA_TICK_MS = 20;
const INFRA_ROWS_PER_TICK = 4;
type InfraMetricSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function infraPickRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export function infraApplyRowPatch(
  api: TableAPI,
  rowId: string | number,
  patch: Partial<InfrastructureServer>,
) {
  if (patch.cpuUsage !== undefined) {
    api.updateData({ accessor: "cpuUsage", rowId, newValue: patch.cpuUsage as CellValue });
  }
  if (patch.cpuHistory !== undefined) {
    api.updateData({ accessor: "cpuHistory", rowId, newValue: patch.cpuHistory as CellValue });
  }
  if (patch.memoryUsage !== undefined) {
    api.updateData({ accessor: "memoryUsage", rowId, newValue: patch.memoryUsage as CellValue });
  }
  if (patch.networkIn !== undefined) {
    api.updateData({ accessor: "networkIn", rowId, newValue: patch.networkIn as CellValue });
  }
  if (patch.networkOut !== undefined) {
    api.updateData({ accessor: "networkOut", rowId, newValue: patch.networkOut as CellValue });
  }
  if (patch.responseTime !== undefined) {
    api.updateData({ accessor: "responseTime", rowId, newValue: patch.responseTime as CellValue });
  }
  if (patch.activeConnections !== undefined) {
    api.updateData({ accessor: "activeConnections", rowId, newValue: patch.activeConnections as CellValue });
  }
  if (patch.requestsPerSec !== undefined) {
    api.updateData({ accessor: "requestsPerSec", rowId, newValue: patch.requestsPerSec as CellValue });
  }
}

export function infraComputeMetricPatch(row: Row, slot: InfraMetricSlot): Partial<InfrastructureServer> | null {
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
      return { responseTime: Math.round(Math.max(10, currentResponseTime + responseChange) * 10) / 10 };
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

export function startInfraDemoLiveUpdates(getApi: () => TableAPI | null | undefined): () => void {
  let isActive = true;
  const tick = () => {
    if (!isActive) return;
    const api = getApi();
    if (!api) return;
    const visible = api.getVisibleRows();
    if (!visible.length) return;
    const picks = infraPickRandomSubset(visible, INFRA_ROWS_PER_TICK);
    let usedCpuSparkline = false;
    for (const vr of picks) {
      const rowId = vr.row.id;
      if (rowId === undefined || rowId === null || rowId === "") continue;
      if (typeof rowId !== "number" && typeof rowId !== "string") continue;
      let slot = Math.floor(Math.random() * 7) as InfraMetricSlot;
      if (slot === 0 && usedCpuSparkline) slot = (1 + Math.floor(Math.random() * 6)) as InfraMetricSlot;
      if (slot === 0) usedCpuSparkline = true;
      const patch = infraComputeMetricPatch(vr.row, slot);
      if (patch) infraApplyRowPatch(api, rowId, patch);
    }
  };
  tick();
  const intervalId = setInterval(tick, INFRA_TICK_MS);
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}
