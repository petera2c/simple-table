<script lang="ts">
  import { onMount } from "svelte";
  import type { HeaderRendererProps } from "../../index";

  let { header, components }: HeaderRendererProps = $props();

  let clicks = $state(0);
  let sortHost: HTMLSpanElement | undefined = $state();
  let filterHost: HTMLSpanElement | undefined = $state();
  let labelHost: HTMLSpanElement | undefined = $state();

  // Incremented by tests to assert the host is reused (not remounted).
  onMount(() => {
    (globalThis as any).__stHeaderMountCount =
      ((globalThis as any).__stHeaderMountCount ?? 0) + 1;
  });

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
    attach(components?.sortIcon, sortHost);
  });
  $effect(() => {
    attach(components?.filterIcon, filterHost);
  });
  $effect(() => {
    attach(components?.labelContent, labelHost);
  });
</script>

<span class="stateful-custom-head" data-st-test-header-clicks={String(clicks)}>
  {header.label ?? ""}
  <button
    type="button"
    data-st-test-header-toggle="true"
    onclick={(event) => {
      event.stopPropagation();
      clicks += 1;
    }}
  >
    toggle
  </button>
  <span bind:this={sortHost}></span>
  <span bind:this={filterHost}></span>
  <span bind:this={labelHost}></span>
</span>
