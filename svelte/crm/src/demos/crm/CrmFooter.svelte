<script lang="ts">
  import type { FooterRendererProps } from "@simple-table/svelte";
  import { generateVisiblePages } from "./crm.demo-data";
  import { crmFooterColors, crmRowsPerPage } from "./crm-demo-stores";

  let fp: FooterRendererProps = $props();

  const c = $derived($crmFooterColors);
  const visiblePages = $derived(generateVisiblePages(fp.currentPage, fp.totalPages));
  const perPageOptions = [25, 50, 100, 200, 10000] as const;

  function baseBtn(disabled: boolean, active: boolean, padding: string, extra = ""): string {
    const color = active ? c.activeText : disabled ? c.buttonText : c.text;
    const bg = active ? c.activeBg : c.buttonBg;
    return `display:inline-flex;align-items:center;padding:${padding};border:1px solid ${c.buttonBorder};background-color:${bg};font-size:14px;font-weight:500;color:${color};cursor:${disabled ? "not-allowed" : "pointer"};opacity:${disabled ? "0.5" : "1"};${extra}`;
  }

  function onRowsChange(ev: Event) {
    const v = parseInt((ev.target as HTMLSelectElement).value, 10);
    crmRowsPerPage.set(v);
    fp.onPageChange(1);
  }
</script>

<div
  style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid {c.border};background-color:{c.bg};"
>
  <p style="font-size:14px;color:{c.text};margin:0;">
    Showing <span style="font-weight:500;">{fp.startRow}</span> to
    <span style="font-weight:500;">{fp.endRow}</span> of
    <span style="font-weight:500;">{fp.totalRows}</span> results
  </p>
  <div style="display:flex;align-items:center;gap:16px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <label style="font-size:14px;color:{c.text};" for="crm-rpp">Show:</label>
      <select
        id="crm-rpp"
        style="border:1px solid {c.inputBorder};border-radius:6px;padding:4px 8px;font-size:14px;background-color:{c.inputBg};color:{c.text};cursor:pointer;"
        value={$crmRowsPerPage}
        onchange={onRowsChange}
      >
        {#each perPageOptions as opt (opt)}
          <option value={String(opt)}>{opt === 10000 ? "all" : String(opt)}</option>
        {/each}
      </select>
      <span style="font-size:14px;color:{c.text};">per page</span>
    </div>
    <nav style="display:inline-flex;border-radius:6px;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);">
      <button
        type="button"
        style="{baseBtn(!fp.hasPrevPage, false, '8px', 'border-top-left-radius:6px;border-bottom-left-radius:6px;')}"
        disabled={!fp.hasPrevPage}
        onclick={() => fp.onPrevPage()}>‹</button>
      {#each visiblePages as page, idx (page)}
        <button
          type="button"
          style="{baseBtn(false, page === fp.currentPage, '8px 16px', idx === 0 ? '' : 'margin-left:-1px;')}"
          onclick={() => fp.onPageChange(page)}>{page}</button>
      {/each}
      <button
        type="button"
        style="{baseBtn(!fp.hasNextPage, false, '8px', 'border-top-right-radius:6px;border-bottom-right-radius:6px;margin-left:-1px;')}"
        disabled={!fp.hasNextPage}
        onclick={() => void fp.onNextPage()}>›</button>
    </nav>
  </div>
</div>
