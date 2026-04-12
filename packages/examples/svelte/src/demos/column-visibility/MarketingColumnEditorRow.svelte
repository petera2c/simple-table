<script lang="ts">
  import type { ColumnEditorRowRendererProps } from "@simple-table/svelte";

  let { components }: ColumnEditorRowRendererProps = $props();

  let expandHost: HTMLSpanElement | undefined = $state();
  let checkboxHost: HTMLSpanElement | undefined = $state();
  let labelHost: HTMLSpanElement | undefined = $state();
  let dragHost: HTMLSpanElement | undefined = $state();

  function attach(slot: unknown, host: HTMLElement | undefined): void {
    if (!host) return;
    host.replaceChildren();
    if (slot == null) return;
    if (typeof slot === "string") {
      host.textContent = slot;
    } else if (slot instanceof Node) {
      host.appendChild(slot);
    }
  }

  $effect(() => {
    attach(components.expandIcon, expandHost);
  });
  $effect(() => {
    attach(components.checkbox, checkboxHost);
  });
  $effect(() => {
    attach(components.labelContent, labelHost);
  });
  $effect(() => {
    attach(components.dragIcon, dragHost);
  });
</script>

<div
  style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding-right:8px;"
>
  <div style="display:flex;align-items:center;gap:8px;">
    <span bind:this={expandHost}></span>
    <span bind:this={checkboxHost}></span>
    <span bind:this={labelHost}></span>
  </div>
  <span bind:this={dragHost}></span>
</div>
