<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const status = $derived(String(value));
  const meta = $derived.by(() => {
    const map: Record<string, { icon: string; color: string }> = {
      active: { icon: "✓", color: "#10B981" },
      inactive: { icon: "✕", color: "#EF4444" },
      pending: { icon: "!", color: "#F59E0B" },
    };
    return map[status] ?? { icon: "?", color: "#6b7280" };
  });
</script>

<span style="color:{meta.color};font-weight:600;text-transform:capitalize;">{meta.icon} {status}</span>
