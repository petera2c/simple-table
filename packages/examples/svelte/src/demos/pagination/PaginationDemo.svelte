<script lang="ts">
  import { SimpleTable } from "simple-table-svelte";
  import type { Theme } from "simple-table-svelte";
  import { paginationConfig, paginationData, PAGINATION_ROWS_PER_PAGE } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height, theme }: { height?: string | number; theme?: Theme } = $props();

  let rows = $state(paginationData.slice(0, PAGINATION_ROWS_PER_PAGE));
  let isLoading = $state(false);

  const onNextPage = async (pageIndex: number) => {
    const startIndex = pageIndex * PAGINATION_ROWS_PER_PAGE;
    const endIndex = startIndex + PAGINATION_ROWS_PER_PAGE;

    isLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPageData = paginationData.slice(startIndex, endIndex);

    if (newPageData.length === 0 || rows.length > startIndex) {
      isLoading = false;
      return false;
    }

    rows = [...rows, ...newPageData];
    isLoading = false;
    return true;
  };
</script>

<SimpleTable
  defaultHeaders={paginationConfig.headers}
  height={height ?? "auto"}
  {isLoading}
  {onNextPage}
  {rows}
  rowsPerPage={PAGINATION_ROWS_PER_PAGE}
  shouldPaginate={true}
  {theme}
/>
