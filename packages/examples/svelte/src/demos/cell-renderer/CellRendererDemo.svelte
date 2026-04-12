<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject } from "@simple-table/svelte";
  import { cellRendererConfig } from "./cell-renderer.demo-data";
  import CrTeamMembersCell from "./CrTeamMembersCell.svelte";
  import CrWebsiteCell from "./CrWebsiteCell.svelte";
  import CrStatusCell from "./CrStatusCell.svelte";
  import CrProgressCell from "./CrProgressCell.svelte";
  import CrRatingCell from "./CrRatingCell.svelte";
  import CrVerifiedCell from "./CrVerifiedCell.svelte";
  import CrTagsCell from "./CrTagsCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const RENDERERS: Record<string, unknown> = {
    teamMembers: CrTeamMembersCell,
    website: CrWebsiteCell,
    status: CrStatusCell,
    progress: CrProgressCell,
    rating: CrRatingCell,
    verified: CrVerifiedCell,
    tags: CrTagsCell,
  };

  const headers: HeaderObject[] = cellRendererConfig.headers.map((h) => {
    const cellRenderer = RENDERERS[h.accessor as string];
    return cellRenderer ? { ...h, cellRenderer } : { ...h };
  });
</script>

<SimpleTable
  defaultHeaders={headers}
  rows={cellRendererConfig.rows}
  {height}
  {theme}
  selectableCells={cellRendererConfig.tableProps.selectableCells}
  customTheme={cellRendererConfig.tableProps.customTheme}
/>
