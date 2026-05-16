<script setup lang="ts">
import { ref, computed, h, defineComponent } from "vue";
import type { Component } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { VueHeaderObject, CellChangeProps, CellRendererProps, FooterRendererProps } from "@simple-table/vue";
import {
  crmData,
  CRM_THEME_COLORS_LIGHT,
  CRM_THEME_COLORS_DARK,
  CRM_FOOTER_COLORS_LIGHT,
  CRM_FOOTER_COLORS_DARK,
  generateVisiblePages,
} from "./crm.demo-data";
import type { CRMLead, CrmShellTheme } from "./crm.demo-data";
import CrmEmailEnrich from "./CrmEmailEnrich.vue";
import CrmFitButtons from "./CrmFitButtons.vue";
import "@simple-table/vue/styles.css";
import "./crm-custom-theme.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: CrmShellTheme }>(), {
  height: "400px",
});

const isDark = computed(
  () =>
    props.theme === "custom-dark" ||
    props.theme === "dark" ||
    props.theme === "modern-dark",
);
const data = ref([...crmData]);
const rowsPerPage = ref(100);

type CrmColors = typeof CRM_THEME_COLORS_LIGHT;

function makeContactCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmContactCell",
    setup(raw) {
      return () => {
        const p = raw as unknown as CellRendererProps;
        const d = p.row as unknown as CRMLead;
        const initials = d.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        return h("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, [
          h(
            "div",
            {
              style: {
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "600",
                flexShrink: "0",
              },
            },
            initials,
          ),
          h("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } }, [
            h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.link,
                },
              },
              d.name,
            ),
            h("div", { style: { fontSize: "12px", color: colors.textSecondary } }, d.title),
            h("div", { style: { fontSize: "12px", color: colors.textSecondary } }, [
              h("span", { style: { fontSize: "12px", color: colors.textTertiary } }, "@"),
              ` ${d.company}`,
            ]),
          ]),
        ]);
      };
    },
  });
}

function makeSignalCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmSignalCell",
    setup(raw) {
      return () => {
        const p = raw as unknown as CellRendererProps;
        const d = p.row as unknown as CRMLead;
        return h("div", [
          h("div", { style: { color: colors.textSecondary, marginBottom: "4px", fontSize: "0.875rem" } }, [
            "🧠 Just engaged with a ",
            h(
              "a",
              {
                href: "#",
                style: { color: "#0077b5", textDecoration: "underline", cursor: "pointer" },
                onClick: (e: MouseEvent) => e.preventDefault(),
              },
              "post",
            ),
          ]),
          h("div", { style: { fontSize: "12px", color: colors.textTertiary } }, [
            h("span", { style: { fontWeight: "600" } }, "Keyword:"),
            ` ${d.signal}`,
          ]),
        ]);
      };
    },
  });
}

function makeAiScoreCell(): Component {
  return defineComponent({
    name: "CrmAiScoreCell",
    setup(raw) {
      return () => {
        const p = raw as unknown as CellRendererProps;
        const d = p.row as unknown as CRMLead;
        return h("div", { style: { fontSize: "0.875rem" } }, "🔥".repeat(d.aiScore));
      };
    },
  });
}

function makeEmailCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmEmailCell",
    setup() {
      return () => h(CrmEmailEnrich, { colors });
    },
  });
}

function makeTimeAgoCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmTimeAgoCell",
    setup(raw) {
      return () => {
        const p = raw as unknown as CellRendererProps;
        const d = p.row as unknown as CRMLead;
        return h("div", { style: { fontSize: "13px", color: colors.textSecondary } }, d.timeAgo);
      };
    },
  });
}

function makeListCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmListCell",
    setup(raw) {
      return () => {
        const p = raw as unknown as CellRendererProps;
        const d = p.row as unknown as CRMLead;
        return h(
          "a",
          {
            href: "#",
            style: {
              cursor: "pointer",
              fontSize: "0.875rem",
              color: colors.link,
              textDecoration: "none",
              fontWeight: "600",
            },
            onClick: (e: MouseEvent) => e.preventDefault(),
          },
          d.list,
        );
      };
    },
  });
}

function makeFitCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmFitCell",
    setup() {
      return () => h(CrmFitButtons, { colors });
    },
  });
}

function makeContactNowCell(colors: CrmColors): Component {
  return defineComponent({
    name: "CrmContactNowCell",
    setup() {
      return () =>
        h(
          "a",
          {
            href: "#",
            style: {
              cursor: "pointer",
              fontSize: "0.875rem",
              color: colors.link,
              textDecoration: "none",
              fontWeight: "600",
            },
            onClick: (e: MouseEvent) => e.preventDefault(),
          },
          "Contact Now",
        );
    },
  });
}

const CrmFooter = defineComponent({
  name: "CrmFooter",
  props: {
    currentPage: { type: Number, required: true },
    endRow: { type: Number, required: true },
    hasNextPage: { type: Boolean, required: true },
    hasPrevPage: { type: Boolean, required: true },
    onNextPage: { type: Function, required: true },
    onPageChange: { type: Function, required: true },
    onPrevPage: { type: Function, required: true },
    rowsPerPage: { type: Number, required: true },
    startRow: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalRows: { type: Number, required: true },
  },
  setup(footerProps) {
    return () => {
      const c = isDark.value ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT;
      const fp = footerProps as unknown as FooterRendererProps;
      const visiblePages = generateVisiblePages(fp.currentPage, fp.totalPages);

      const makePageBtn = (
        label: string,
        onClick: () => void,
        disabled: boolean,
        active: boolean,
        extraStyle?: Record<string, string>,
      ) =>
        h("button", {
          type: "button",
          disabled,
          style: {
            display: "inline-flex",
            alignItems: "center",
            padding: label.length > 1 ? "8px 16px" : "8px",
            border: `1px solid ${c.buttonBorder}`,
            backgroundColor: active ? c.activeBg : c.buttonBg,
            fontSize: "14px",
            fontWeight: "500",
            color: active ? c.activeText : disabled ? c.buttonText : c.text,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? "0.5" : "1",
            ...extraStyle,
          },
          onClick: disabled ? undefined : onClick,
        }, label);

      const perPageOptions = [25, 50, 100, 200, 10000] as const;

      return h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: `1px solid ${c.border}`,
            backgroundColor: c.bg,
          },
        },
        [
          h("p", { style: { fontSize: "14px", color: c.text, margin: "0" } }, [
            "Showing ",
            h("span", { style: { fontWeight: "500" } }, String(fp.startRow)),
            " to ",
            h("span", { style: { fontWeight: "500" } }, String(fp.endRow)),
            " of ",
            h("span", { style: { fontWeight: "500" } }, String(fp.totalRows)),
            " results",
          ]),
          h("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, [
            h("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, [
              h("label", { style: { fontSize: "14px", color: c.text } }, "Show:"),
              h(
                "select",
                {
                  style: {
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "14px",
                    backgroundColor: c.inputBg,
                    color: c.text,
                    cursor: "pointer",
                  },
                  value: rowsPerPage.value,
                  onChange: (e: Event) => {
                    const v = parseInt((e.target as HTMLSelectElement).value, 10);
                    rowsPerPage.value = v;
                    fp.onPageChange(1);
                  },
                },
                perPageOptions.map((opt) =>
                  h("option", { value: String(opt) }, opt === 10000 ? "all" : String(opt)),
                ),
              ),
              h("span", { style: { fontSize: "14px", color: c.text } }, "per page"),
            ]),
            h(
              "nav",
              {
                style: {
                  display: "inline-flex",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                },
              },
              [
                makePageBtn("‹", () => fp.onPrevPage(), !fp.hasPrevPage, false, {
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                }),
                ...visiblePages.map((page, idx) =>
                  makePageBtn(String(page), () => fp.onPageChange(page), false, page === fp.currentPage, {
                    padding: "8px 16px",
                    marginLeft: idx === 0 ? "0" : "-1px",
                  }),
                ),
                makePageBtn("›", () => void fp.onNextPage(), !fp.hasNextPage, false, {
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  marginLeft: "-1px",
                }),
              ],
            ),
          ]),
        ],
      );
    };
  },
});

const headers = computed((): VueHeaderObject[] => {
  const colors = isDark.value ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT;

  return [
    {
      accessor: "name",
      label: "CONTACT",
      width: "2fr",
      minWidth: 290,
      isSortable: true,
      isEditable: true,
      type: "string",
      cellRenderer: makeContactCell(colors),
    },
    {
      accessor: "signal",
      label: "SIGNAL",
      width: "3fr",
      minWidth: 340,
      isSortable: true,
      isEditable: true,
      type: "string",
      cellRenderer: makeSignalCell(colors),
    },
    {
      accessor: "aiScore",
      label: "AI SCORE",
      width: "1fr",
      minWidth: 100,
      isSortable: true,
      align: "center",
      type: "number",
      cellRenderer: makeAiScoreCell(),
    },
    {
      accessor: "emailStatus",
      label: "EMAIL",
      width: "1.5fr",
      minWidth: 210,
      isSortable: true,
      align: "center",
      type: "enum",
      enumOptions: [
        { label: "Enrich", value: "Enrich" },
        { label: "Verified", value: "Verified" },
        { label: "Pending", value: "Pending" },
        { label: "Bounced", value: "Bounced" },
      ],
      cellRenderer: makeEmailCell(colors),
    },
    {
      accessor: "timeAgo",
      label: "IMPORT",
      width: "1fr",
      minWidth: 100,
      isSortable: true,
      align: "center",
      type: "string",
      cellRenderer: makeTimeAgoCell(colors),
    },
    {
      accessor: "list",
      label: "LIST",
      width: "1.2fr",
      minWidth: 160,
      isSortable: true,
      align: "center",
      type: "enum",
      enumOptions: [
        { label: "Leads", value: "Leads" },
        { label: "Hot Leads", value: "Hot Leads" },
        { label: "Warm Leads", value: "Warm Leads" },
        { label: "Cold Leads", value: "Cold Leads" },
        { label: "Enterprise", value: "Enterprise" },
        { label: "SMB", value: "SMB" },
        { label: "Nurture", value: "Nurture" },
      ],
      valueGetter: ({ row }) => {
        const list = String(row.list);
        const m: Record<string, number> = {
          "Hot Leads": 1,
          "Warm Leads": 2,
          Enterprise: 3,
          Leads: 4,
          SMB: 5,
          "Cold Leads": 6,
          Nurture: 7,
        };
        return m[list] || 999;
      },
      cellRenderer: makeListCell(colors),
    },
    { accessor: "_fit", label: "Fit", width: "1fr", align: "center", minWidth: 120, cellRenderer: makeFitCell(colors) },
    {
      accessor: "_contactNow",
      label: "",
      width: "1.2fr",
      minWidth: 160,
      cellRenderer: makeContactNowCell(colors),
    },
  ];
});

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
  data.value = data.value.map((item) =>
    item.id === row.id ? { ...item, [accessor]: newValue } : item,
  );
};
</script>

<template>
  <div :class="`custom-theme-container theme-${isDark ? 'custom-dark' : 'custom-light'}`">
    <SimpleTable
      :default-headers="headers"
      :rows="data"
      :height="height"
      theme="custom"
      :column-reordering="true"
      :column-resizing="true"
      :enable-row-selection="true"
      :should-paginate="true"
      :rows-per-page="rowsPerPage"
      :custom-theme="{ headerHeight: 48, rowHeight: 92 }"
      :footer-renderer="CrmFooter"
      @cell-edit="handleCellEdit"
    />
  </div>
</template>
