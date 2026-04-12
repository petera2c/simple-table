<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const url = $derived(String(value));
</script>

<span>🌐 <a class="crw" href="https://{url}" target="_blank" rel="noopener noreferrer">{url}</a></span>

<style>
  .crw {
    color: #2563eb;
    text-decoration: none;
  }
  .crw:hover {
    text-decoration: underline;
  }
</style>
