<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { FooterRendererProps } from "simple-table-core";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function getFooterColors(theme?: Theme) {
  switch (theme) {
    case "modern-dark":
    case "dark":
      return {
        background: "#1f2937",
        border: "#374151",
        text: "#d1d5db",
        buttonBg: "#374151",
        buttonBorder: "#4b5563",
        buttonActive: "#3b82f6",
        buttonText: "#d1d5db",
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
        buttonText: "#374151",
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
        buttonText: "#64748b",
        buttonDisabled: "#cbd5e1",
      };
  }
}

function footerRenderer(fp: FooterRendererProps): HTMLElement {
  const c = getFooterColors(props.theme);

  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    backgroundColor: c.background,
    borderTop: `2px solid ${c.border}`,
  });

  const info = document.createElement("span");
  Object.assign(info.style, { fontSize: "14px", fontWeight: "600", color: c.text });
  info.textContent = `Showing ${fp.startRow}–${fp.endRow} of ${fp.totalRows} items`;
  wrapper.appendChild(info);

  const controls = document.createElement("div");
  Object.assign(controls.style, { display: "flex", alignItems: "center", gap: "8px" });

  function makeBtn(label: string, onClick: () => void, disabled: boolean, active = false) {
    const btn = document.createElement("button");
    btn.textContent = label;
    Object.assign(btn.style, {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      color: active ? "white" : disabled ? c.buttonDisabled : c.buttonActive,
      backgroundColor: active ? c.buttonActive : c.buttonBg,
      border: `1px solid ${c.buttonBorder}`,
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      minWidth: "40px",
    });
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  }

  controls.appendChild(makeBtn("Previous", fp.onPrevPage, !fp.hasPrevPage));

  const pages = document.createElement("div");
  Object.assign(pages.style, { display: "flex", gap: "4px" });
  for (let p = 1; p <= fp.totalPages; p++) {
    const isActive = p === fp.currentPage;
    const btn = makeBtn(String(p), () => fp.onPageChange(p), false, isActive);
    btn.style.padding = "8px 12px";
    pages.appendChild(btn);
  }
  controls.appendChild(pages);

  controls.appendChild(makeBtn("Next", () => fp.onNextPage(), !fp.hasNextPage));

  wrapper.appendChild(controls);
  return wrapper;
}
</script>

<template>
  <SimpleTable
    :default-headers="footerRendererConfig.headers"
    :rows="footerRendererConfig.rows"
    :footer-renderer="footerRenderer"
    :should-paginate="true"
    :rows-per-page="10"
    :hide-footer="false"
    :height="props.height"
    :theme="props.theme"
  />
</template>
