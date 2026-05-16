<script setup lang="ts">
import { defineComponent, h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, FooterRendererProps } from "@simple-table/vue";
import { footerRendererConfig } from "./footer-renderer.demo-data";
import "@simple-table/vue/styles.css";

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

const FooterBar = defineComponent({
  name: "FooterBar",
  setup(fp: FooterRendererProps) {
    return () => {
      const c = getFooterColors(props.theme);
      const btnStyle = (disabled: boolean, active = false) => ({
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
        color: active ? "white" : disabled ? c.buttonDisabled : c.buttonActive,
        backgroundColor: active ? c.buttonActive : c.buttonBg,
        border: `1px solid ${c.buttonBorder}`,
        borderRadius: "6px",
        cursor: disabled ? ("not-allowed" as const) : ("pointer" as const),
        transition: "all 0.2s",
        minWidth: "40px",
      });
      return h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            backgroundColor: c.background,
            borderTop: `2px solid ${c.border}`,
          },
        },
        [
          h(
            "span",
            { style: { fontSize: "14px", fontWeight: "600", color: c.text } },
            `Showing ${fp.startRow}–${fp.endRow} of ${fp.totalRows} items`,
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px" } },
            [
              h("button", {
                style: btnStyle(!fp.hasPrevPage),
                disabled: !fp.hasPrevPage,
                onClick: fp.onPrevPage,
              }, "Previous"),
              h(
                "div",
                { style: { display: "flex", gap: "4px" } },
                Array.from({ length: fp.totalPages }, (_, i) => i + 1).map((page) =>
                  h("button", {
                    key: page,
                    style: { ...btnStyle(false, page === fp.currentPage), padding: "8px 12px" },
                    onClick: () => fp.onPageChange(page),
                  }, String(page)),
                ),
              ),
              h("button", {
                style: btnStyle(!fp.hasNextPage),
                disabled: !fp.hasNextPage,
                onClick: () => {
                  void fp.onNextPage();
                },
              }, "Next"),
            ],
          ),
        ],
      );
    };
  },
});
</script>

<template>
  <SimpleTable
    :default-headers="footerRendererConfig.headers"
    :rows="footerRendererConfig.rows"
    :footer-renderer="FooterBar"
    :should-paginate="true"
    :rows-per-page="10"
    :hide-footer="false"
    :height="props.height"
    :theme="props.theme"
  />
</template>
