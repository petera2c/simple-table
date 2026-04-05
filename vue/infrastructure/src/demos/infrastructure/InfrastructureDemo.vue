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
import type { Theme, TableAPI, HeaderObject, CellRenderer, Row } from "@simple-table/vue";
import {
  infrastructureConfig,
  infrastructureData,
  INFRA_UPDATE_CONFIG,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/vue/styles.css";

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

const currentData = JSON.parse(JSON.stringify(infrastructureData));
const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
let isActive = true;
let syncInt: ReturnType<typeof setInterval> | null = null;

const createRowTimer = (rowId: string) => {
  const scheduleUpdate = () => {
    if (!isActive) return;
    const interval = INFRA_UPDATE_CONFIG.minInterval + Math.random() * (INFRA_UPDATE_CONFIG.maxInterval - INFRA_UPDATE_CONFIG.minInterval);
    const timerId = setTimeout(() => {
      if (!isActive) return;
      const api = tableRef.value?.getAPI();
      if (!api) return;
      const idx = currentData.findIndex((r: Row) => r.id === rowId);
      if (idx === -1) return;
      const server = currentData[idx] as InfrastructureServer;

      const cpu = server.cpuUsage;
      if (typeof cpu === "number") {
        const newCpu = Math.round(Math.min(100, Math.max(0, cpu + (Math.random() - 0.5) * 8)) * 10) / 10;
        currentData[idx].cpuUsage = newCpu;
        api.updateData({ accessor: "cpuUsage", rowIndex: idx, newValue: newCpu });
        const hist = server.cpuHistory;
        if (Array.isArray(hist) && hist.length > 0) {
          const updated = [...hist.slice(1), newCpu];
          currentData[idx].cpuHistory = updated;
          api.updateData({ accessor: "cpuHistory", rowIndex: idx, newValue: updated });
        }
      }
      if (Math.random() < 0.4) {
        const mem = server.memoryUsage;
        if (typeof mem === "number") {
          const n = Math.round(Math.min(100, Math.max(0, mem + (Math.random() - 0.5) * 5)) * 10) / 10;
          currentData[idx].memoryUsage = n;
          api.updateData({ accessor: "memoryUsage", rowIndex: idx, newValue: n });
        }
      }
      if (Math.random() < 0.5) {
        const rt = server.responseTime;
        if (typeof rt === "number") {
          const n = Math.round(Math.max(10, rt + (Math.random() - 0.5) * 100) * 10) / 10;
          currentData[idx].responseTime = n;
          api.updateData({ accessor: "responseTime", rowIndex: idx, newValue: n });
        }
      }
      scheduleUpdate();
    }, interval);
    timerMap.set(rowId, timerId);
  };
  scheduleUpdate();
};

const syncTimers = () => {
  const api = tableRef.value?.getAPI();
  if (!api) return;
  const visibleRows = api.getVisibleRows();
  const visibleIds = new Set(visibleRows.map((vr) => String(vr.row.id)));
  timerMap.forEach((tid, rid) => {
    if (!visibleIds.has(rid)) {
      clearTimeout(tid);
      timerMap.delete(rid);
    }
  });
  visibleRows.forEach((vr) => {
    const rid = String(vr.row.id);
    if (!timerMap.has(rid)) createRowTimer(rid);
  });
};

onMounted(() => {
  syncTimers();
  syncInt = setInterval(syncTimers, 500);
});

onUnmounted(() => {
  isActive = false;
  if (syncInt) clearInterval(syncInt);
  timerMap.forEach((t) => clearTimeout(t));
  timerMap.clear();
});
</script>
