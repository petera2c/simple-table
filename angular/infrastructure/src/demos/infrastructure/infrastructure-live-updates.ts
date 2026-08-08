import type { TableAPI } from "@simple-table/angular";
import type { InfrastructureServer } from "./infrastructure.demo-data";

const INFRA_TICK_MS = 20;
const INFRA_ROWS_PER_TICK = 4;
const INFRA_METRIC_SLOTS = [0, 1, 2, 3, 4, 5, 6] as const;
type InfraMetricSlot = (typeof INFRA_METRIC_SLOTS)[number];

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

function randomInfraMetricSlot(fromIndex = 0): InfraMetricSlot {
  const pool = INFRA_METRIC_SLOTS.slice(fromIndex);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function infraApplyRowPatch(
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

export function infraComputeMetricPatch(
  row: InfrastructureServer,
  slot: InfraMetricSlot,
): Partial<InfrastructureServer> | null {
  switch (slot) {
    case 0: {
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, row.cpuUsage + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      if (row.cpuHistory.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...row.cpuHistory.slice(1), newCpuRounded] };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, row.memoryUsage + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      const netChange = (Math.random() - 0.5) * 100;
      return { networkIn: Math.round(Math.max(0, row.networkIn + netChange) * 100) / 100 };
    }
    case 3: {
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, row.networkOut + netChange) * 100) / 100 };
    }
    case 4: {
      const responseChange = (Math.random() - 0.5) * 100;
      return {
        responseTime: Math.round(Math.max(10, row.responseTime + responseChange) * 10) / 10,
      };
    }
    case 5: {
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, row.activeConnections + connectionChange) };
    }
    case 6: {
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, row.requestsPerSec + requestChange) };
    }
    default:
      return null;
  }
}

export function startInfraDemoLiveUpdates(
  getApi: () => TableAPI<InfrastructureServer> | null | undefined,
): () => void {
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
      let slot = randomInfraMetricSlot();
      if (slot === 0 && usedCpuSparkline) slot = randomInfraMetricSlot(1);
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
