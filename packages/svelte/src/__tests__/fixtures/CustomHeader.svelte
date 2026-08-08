<script lang="ts">
  let { header }: { header: { label?: string } } = $props();
</script>

<span class="custom-head">head:{String(header.label)}</span>
