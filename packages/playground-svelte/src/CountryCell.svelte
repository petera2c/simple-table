<script lang="ts">
  import type { CellRendererProps } from "simple-table-svelte";

  const FLAG_MAP: Record<string, string> = {
    USA: "🇺🇸", China: "🇨🇳", Russia: "🇷🇺", UK: "🇬🇧",
    Brazil: "🇧🇷", Australia: "🇦🇺", Japan: "🇯🇵",
  };

  let { value }: CellRendererProps = $props();

  const flag = $derived(FLAG_MAP[String(value)] ?? "🏳️");
</script>

<span>{flag} {String(value)}</span>
