<template>
  <SimpleTable
    ref="tableRef"
    :default-headers="headers"
    :rows="infrastructureData"
    :height="height"
    :theme="theme"
    :auto-expand-columns="true"
    :column-reordering="true"
    :column-resizing="true"
    :edit-columns="true"
    :selectable-cells="true"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI, HeaderObject, CellRenderer, Row, CellValue } from "@simple-table/vue";
import {
  infrastructureConfig,
  infrastructureData,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/vue/styles.css";

const INFRA_TICK_MS = 20;
const INFRA_ROWS_PER_TICK = 4;
type InfraMetricSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function infraPickRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function infraApplyRowPatch(api: TableAPI, rowIndex: number, patch: Partial<Row>) {
  for (const accessor of Object.keys(patch)) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowIndex, newValue: newValue as CellValue });
  }
}

function infraComputeMetricPatch(row: Row, slot: InfraMetricSlot): Partial<Row> | null {
  switch (slot) {
    case 0: {
      const currentCpu = row.cpuUsage as number;
      if (typeof currentCpu !== "number") return null;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      const currentHistory = row.cpuHistory as number[];
      if (Array.isArray(currentHistory) && currentHistory.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...currentHistory.slice(1), newCpuRounded] };
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
      return { networkIn: Math.round(Math.max(0, currentNetIn + netChange) * 100) / 100 };
    }
    case 3: {
      const currentNetOut = row.networkOut as number;
      if (typeof currentNetOut !== "number") return null;
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, currentNetOut + netChange) * 100) / 100 };
    }
    case 4: {
      const currentResponseTime = row.responseTime as number;
      if (typeof currentResponseTime !== "number") return null;
      const responseChange = (Math.random() - 0.5) * 100;
      return { responseTime: Math.round(Math.max(10, currentResponseTime + responseChange) * 10) / 10 };
    }
    case 5: {
      const currentConnections = row.activeConnections as number;
      if (typeof currentConnections !== "number") return null;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, currentConnections + connectionChange) };
    }
    case 6: {
      const currentRequests = row.requestsPerSec as number;
      if (typeof currentRequests !== "number") return null;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, currentRequests + requestChange) };
    }
    default:
      return null;
  }
}

function startInfraDemoLiveUpdates(getApi: () => TableAPI | null | undefined, rows: Row[]): () => void {
  let isActive = true;
  const idToIndex = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    idToIndex.set(String(rows[i]!.id), i);
  }
  const tick = () => {
    if (!isActive) return;
    const api = getApi();
    if (!api) return;
    const visible = api.getVisibleRows();
    if (!visible.length) return;
    const picks = infraPickRandomSubset(visible, INFRA_ROWS_PER_TICK);
    let usedCpuSparkline = false;
    for (const vr of picks) {
      const idx = idToIndex.get(String(vr.row.id));
      if (idx === undefined) continue;
      let slot = Math.floor(Math.random() * 7) as InfraMetricSlot;
      if (slot === 0 && usedCpuSparkline) slot = (1 + Math.floor(Math.random() * 6)) as InfraMetricSlot;
      if (slot === 0) usedCpuSparkline = true;
      const patch = infraComputeMetricPatch(vr.row, slot);
      if (patch) infraApplyRowPatch(api, idx, patch);
    }
  };
  tick();
  const intervalId = setInterval(tick, INFRA_TICK_MS);
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

function applyRenderers(hdrs: readonly HeaderObject[], map: Record<string, CellRenderer>): HeaderObject[] {
  return hdrs.map((h) => {
    const renderer = map[h.accessor as string];
    const clone: HeaderObject = renderer ? { ...h, cellRenderer: renderer } : { ...h };
    if (h.children) clone.children = applyRenderers(h.children, map);
    return clone;
  });
}

const headers = computed((): HeaderObject[] => {
  const t = props.theme || "light";

  const serverIdRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as InfrastructureServer;
    const span = document.createElement("span");
    Object.assign(span.style, { fontFamily: "monospace", fontSize: "0.85rem" });
    span.textContent = d.serverId;
    return span;
  };

  const cpuRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const cpu = d.cpuUsage;
    const s = getInfraMetricColorStyles(cpu, theme || t, "cpu");
    const outer = document.createElement("div");
    outer.style.display = "flex";
    outer.style.justifyContent = "end";
    const badge = document.createElement("div");
    Object.assign(badge.style, { padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    badge.textContent = `${cpu.toFixed(1)}%`;
    outer.appendChild(badge);
    return outer;
  };

  const memoryRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const mem = d.memoryUsage;
    const s = getInfraMetricColorStyles(mem, theme || t, "memory");
    const outer = document.createElement("div");
    outer.style.display = "flex";
    outer.style.justifyContent = "end";
    const badge = document.createElement("div");
    Object.assign(badge.style, { padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    badge.textContent = `${mem.toFixed(1)}%`;
    outer.appendChild(badge);
    return outer;
  };

  const diskRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as InfrastructureServer;
    return `${d.diskUsage.toFixed(1)}%`;
  };

  const responseRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const rt = d.responseTime;
    const s = getInfraMetricColorStyles(rt, theme || t, "response");
    const span = document.createElement("span");
    Object.assign(span.style, { fontWeight: "500", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    span.textContent = rt.toFixed(1);
    return span;
  };

  const statusRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const status = d.status;
    const s = getInfraStatusColors(status, theme || t);
    const div = document.createElement("div");
    Object.assign(div.style, { ...s, padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" });
    div.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    return div;
  };

  return applyRenderers(infrastructureConfig.headers, {
    serverId: serverIdRenderer,
    cpuUsage: cpuRenderer,
    memoryUsage: memoryRenderer,
    diskUsage: diskRenderer,
    responseTime: responseRenderer,
    status: statusRenderer,
  });
});

let stopLiveUpdates: (() => void) | undefined;

onMounted(() => {
  stopLiveUpdates = startInfraDemoLiveUpdates(
    () => tableRef.value?.getAPI() ?? null,
    infrastructureData,
  );
});

onUnmounted(() => {
  stopLiveUpdates?.();
});
</script>
