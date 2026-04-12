<script lang="ts">
  import { get } from "svelte/store";
  import type { FooterRendererProps, Theme } from "@simple-table/svelte";
  import { footerDemoTheme } from "./footer-demo-theme";

  let fp: FooterRendererProps = $props();

  function getFooterColors(t?: Theme) {
    switch (t) {
      case "modern-dark":
      case "dark":
        return {
          background: "#1f2937",
          border: "#374151",
          text: "#d1d5db",
          buttonBg: "#374151",
          buttonBorder: "#4b5563",
          buttonActive: "#3b82f6",
          buttonDisabled: "#6b7280",
        };
      case "light":
      case "modern-light":
        return {
          background: "white",
          border: "#f3f4f6",
          text: "#6b7280",
          buttonBg: "white",
          buttonBorder: "#e5e7eb",
          buttonActive: "#3b82f6",
          buttonDisabled: "#d1d5db",
        };
      default:
        return {
          background: "#f8fafc",
          border: "#e2e8f0",
          text: "#475569",
          buttonBg: "white",
          buttonBorder: "#e2e8f0",
          buttonActive: "#3b82f6",
          buttonDisabled: "#cbd5e1",
        };
    }
  }

  let c = $state(getFooterColors(get(footerDemoTheme)));
  $effect(() => {
    c = getFooterColors($footerDemoTheme);
  });

  function btnStyle(disabled: boolean, active = false): string {
    const color = active ? "white" : disabled ? c.buttonDisabled : c.buttonActive;
    const bg = active ? c.buttonActive : c.buttonBg;
    return [
      `padding:8px 16px`,
      `font-size:14px`,
      `font-weight:500`,
      `color:${color}`,
      `background-color:${bg}`,
      `border:1px solid ${c.buttonBorder}`,
      `border-radius:6px`,
      `cursor:${disabled ? "not-allowed" : "pointer"}`,
      `transition:all 0.2s`,
      `min-width:40px`,
    ].join(";");
  }
</script>

<div
  style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background-color:{c.background};border-top:2px solid {c.border};"
>
  <span style="font-size:14px;font-weight:600;color:{c.text};">
    Showing {fp.startRow}–{fp.endRow} of {fp.totalRows} items
  </span>
  <div style="display:flex;align-items:center;gap:8px;">
    <button type="button" style={btnStyle(!fp.hasPrevPage)} disabled={!fp.hasPrevPage} onclick={() => fp.onPrevPage()}>
      Previous
    </button>
    <div style="display:flex;gap:4px;">
      {#each Array.from({ length: fp.totalPages }, (_, i) => i + 1) as page (page)}
        <button
          type="button"
          style="{btnStyle(false, page === fp.currentPage)};padding:8px 12px;"
          onclick={() => fp.onPageChange(page)}
        >
          {page}
        </button>
      {/each}
    </div>
    <button
      type="button"
      style={btnStyle(!fp.hasNextPage)}
      disabled={!fp.hasNextPage}
      onclick={() => void fp.onNextPage()}
    >
      Next
    </button>
  </div>
</div>
