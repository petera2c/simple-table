<script lang="ts">
  import type { ColumnEditorRowRendererProps } from "@simple-table/svelte";

  let { header, components }: ColumnEditorRowRendererProps = $props();

  let checkboxHost: HTMLSpanElement | undefined = $state(undefined);
  let dragHost: HTMLSpanElement | undefined = $state(undefined);

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
    attach(components.checkbox, checkboxHost);
  });

  $effect(() => {
    attach(components.dragIcon, dragHost);
  });
</script>

<div
  style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; background: #f8fafc; margin-bottom: 4px;"
>
  {#if components.checkbox}
    <span bind:this={checkboxHost}></span>
  {/if}
  <span style="flex: 1; font-size: 13px; font-weight: 500;">{header.label}</span>
  {#if components.dragIcon}
    <span bind:this={dragHost} style="cursor: grab; opacity: 0.5;"></span>
  {/if}
</div>
