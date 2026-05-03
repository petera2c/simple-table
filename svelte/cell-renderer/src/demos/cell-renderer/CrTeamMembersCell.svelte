<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CellRendererEmployee } from "./cell-renderer.demo-data";

  let { row }: CellRendererProps = $props();
  const members = $derived((row as unknown as CellRendererEmployee).teamMembers);

  function initials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  }
</script>

<div style="display:flex;align-items:center;gap:6px;">
  {#each members as m (m.name)}
    <div style="display:flex;align-items:center;gap:4px;">
      <div
        style="width:24px;height:24px;border-radius:50%;background:#DBEAFE;color:#1E40AF;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;"
      >
        {initials(m.name)}
      </div>
      <span style="font-size:13px;white-space:nowrap;">{m.name}</span>
    </div>
  {/each}
</div>
