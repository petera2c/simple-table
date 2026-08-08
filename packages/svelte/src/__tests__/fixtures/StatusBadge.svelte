<script lang="ts">
  let { value }: { value?: unknown } = $props();
</script>

<span class="status-badge">status:{String(value)}</span>
