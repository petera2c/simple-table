<script lang="ts">
  import { DEMO_LIST } from "@simple-table/examples-shared";
  import { onMount } from "svelte";

  const params = new URLSearchParams(window.location.search);
  const height = params.get("height") || undefined;
  const theme = params.get("theme") || undefined;

  let activeDemo = $state(params.get("demo") || "quick-start");

  const registry: Record<string, () => Promise<any>> = {
    "quick-start": () => import("./demos/quick-start/QuickStartDemo.svelte"),
    "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo.svelte"),
    "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo.svelte"),
    "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo.svelte"),
    "pagination": () => import("./demos/pagination/PaginationDemo.svelte"),
  };

  let loader = $derived(registry[activeDemo]);

  function selectDemo(id: string) {
    activeDemo = id;
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
  }

  onMount(() => {
    const handlePopState = () => {
      activeDemo =
        new URLSearchParams(window.location.search).get("demo") || "quick-start";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });
</script>

<div class="examples-shell">
  <aside class="examples-sidebar">
    <div class="examples-sidebar-header">Svelte Examples</div>
    <nav>
      <ul class="examples-sidebar-nav">
        {#each DEMO_LIST as demo}
          <li>
            <button
              class="examples-sidebar-link"
              class:active={activeDemo === demo.id}
              onclick={() => selectDemo(demo.id)}
            >
              {demo.label}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <main class="examples-content">
    {#key activeDemo}
      {#if loader}
        {#await loader() then mod}
          <mod.default {height} {theme} />
        {/await}
      {:else}
        <h2>Unknown demo: {activeDemo}</h2>
      {/if}
    {/key}
  </main>
</div>
