<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type {
    Theme,
    SvelteColumnDef,
    SvelteCellRenderer,
    TableAPI,
    CellValue,
    GetRowIdParams,
  } from "@simple-table/svelte";
  import { onMount } from "svelte";
  import { infrastructureData, infrastructureHeaders } from "./infrastructure.demo-data";
  import type { InfrastructureServer } from "./infrastructure.demo-data";
  import InfraServerIdCell from "./InfraServerIdCell.svelte";
  import InfraCpuCell from "./InfraCpuCell.svelte";
  import InfraMemoryCell from "./InfraMemoryCell.svelte";
  import InfraDiskCell from "./InfraDiskCell.svelte";
  import InfraResponseCell from "./InfraResponseCell.svelte";
  import InfraStatusCell from "./InfraStatusCell.svelte";
  import "@simple-table/svelte/styles.css";

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

  function infraApplyRowPatch(
    api: TableAPI<InfrastructureServer>,
    rowId: string | number,
    patch: Partial<InfrastructureServer>,
  ) {
    for (const accessor of Object.keys(patch) as Array<keyof InfrastructureServer>) {
      const newValue = patch[accessor];
      if (newValue === undefined) continue;
      api.updateData({ accessor, rowId, newValue: newValue as CellValue });
    }
  }

  function infraComputeMetricPatch(
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
        return { responseTime: Math.round(Math.max(10, row.responseTime + responseChange) * 10) / 10 };
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

  function startInfraDemoLiveUpdates(
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

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef = $state<{ getAPI: () => TableAPI<InfrastructureServer> | null } | null>(null);

  const rendererMap: Partial<Record<string, SvelteCellRenderer<InfrastructureServer>>> = {
    serverId: InfraServerIdCell,
    cpuUsage: InfraCpuCell,
    memoryUsage: InfraMemoryCell,
    diskUsage: InfraDiskCell,
    responseTime: InfraResponseCell,
    status: InfraStatusCell,
  };

  function applyInfraRenderers(
    hdrs: SvelteColumnDef<InfrastructureServer>[],
  ): SvelteColumnDef<InfrastructureServer>[] {
    return hdrs.map((h) => {
      const cellRenderer = rendererMap[String(h.accessor)];
      return {
        ...h,
        ...(cellRenderer ? { cellRenderer } : {}),
        ...(h.children ? { children: applyInfraRenderers(h.children) } : {}),
      };
    });
  }

  const headers = $derived(applyInfraRenderers(infrastructureHeaders));
  const getRowId = ({ row }: GetRowIdParams<InfrastructureServer>) => row.id;

  onMount(() => {
    return startInfraDemoLiveUpdates(() => tableRef?.getAPI() ?? null);
  });
</script>

<SimpleTable
  bind:this={tableRef}
  autoExpandColumns={true}
  columnReordering={true}
  columnResizing={true}
  columns={headers}
  enableColumnEditor={true}
  {getRowId}
  {height}
  rows={infrastructureData}
  selectableCells={true}
  {theme}
/>
