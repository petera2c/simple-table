<script setup lang="ts">
import { h, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueHeaderObject, CellRendererProps } from "@simple-table/vue";
import { cellRendererConfig } from "./cell-renderer.demo-data";
import type { CellRendererEmployee } from "./cell-renderer.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const TeamCell = ({ row }: CellRendererProps) => {
  const members = (row as CellRendererEmployee).teamMembers;
  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "6px" } },
    members.map((m) =>
      h("div", { key: m.name, style: { display: "flex", alignItems: "center", gap: "4px" } }, [
        h(
          "div",
          {
            style: {
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#DBEAFE",
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "600",
              flexShrink: "0",
            },
          },
          getInitials(m.name),
        ),
        h("span", { style: { fontSize: "13px", whiteSpace: "nowrap" } }, m.name),
      ]),
    ),
  );
};

const WebsiteCell = ({ value }: CellRendererProps) => {
  const url = String(value);
  return h("span", [
    "🌐 ",
    h(
      "a",
      {
        href: `https://${url}`,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { color: "#2563EB", textDecoration: "none" },
        onMouseenter: (e: MouseEvent) => {
          (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline";
        },
        onMouseleave: (e: MouseEvent) => {
          (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none";
        },
      },
      url,
    ),
  ]);
};

const StatusCell = ({ value }: CellRendererProps) => {
  const status = String(value);
  const map: Record<string, { icon: string; color: string }> = {
    active: { icon: "✓", color: "#10B981" },
    inactive: { icon: "✕", color: "#EF4444" },
    pending: { icon: "!", color: "#F59E0B" },
  };
  const { icon, color } = map[status] ?? { icon: "?", color: "#6b7280" };
  return h(
    "span",
    { style: { color, fontWeight: "600", textTransform: "capitalize" } },
    `${icon} ${status}`,
  );
};

const ProgressCell = ({ value }: CellRendererProps) => {
  const pct = Number(value) || 0;
  const color = pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";
  return h("div", [
    h("div", { style: { fontSize: "12px", marginBottom: "2px" } }, `${pct}%`),
    h(
      "div",
      {
        style: {
          height: "10px",
          background: "#E5E7EB",
          borderRadius: "5px",
          overflow: "hidden",
        },
      },
      [
        h("div", {
          style: {
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "5px",
            transition: "width 0.3s",
          },
        }),
      ],
    ),
  ]);
};

const RatingCell = ({ value }: CellRendererProps) => {
  const rating = Number(value) || 0;
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return h("span", { style: { display: "flex", alignItems: "center", gap: "4px" } }, [
    h(
      "span",
      { style: { color: "#F59E0B", letterSpacing: "1px" } },
      [
        "★".repeat(full),
        hasHalf ? h("span", { style: { opacity: 0.5 } }, "★") : null,
        "☆".repeat(Math.max(0, empty)),
      ],
    ),
    h("span", { style: { fontSize: "12px", color: "#6b7280" } }, String(rating)),
  ]);
};

const VerifiedCell = ({ value }: CellRendererProps) => {
  const yes = Boolean(value);
  return h(
    "span",
    { style: { color: yes ? "#10B981" : "#EF4444", fontWeight: "600" } },
    yes ? "✓ Yes" : "✕ No",
  );
};

const TagsCell = ({ value }: CellRendererProps) => {
  const raw = Array.isArray(value) ? value : [];
  const tags = raw.filter((t): t is string => typeof t === "string");
  return h(
    "div",
    { style: { display: "flex", gap: "4px", flexWrap: "nowrap", overflow: "hidden" } },
    tags.map((tag) =>
      h(
        "span",
        {
          key: tag,
          style: {
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            background: "#DBEAFE",
            color: "#1E40AF",
            whiteSpace: "nowrap",
          },
        },
        tag,
      ),
    ),
  );
};

const RENDERERS: Record<string, (p: CellRendererProps) => ReturnType<typeof h>> = {
  teamMembers: TeamCell,
  website: WebsiteCell,
  status: StatusCell,
  progress: ProgressCell,
  rating: RatingCell,
  verified: VerifiedCell,
  tags: TagsCell,
};

const headers = computed(() =>
  cellRendererConfig.headers.map((col) => {
    const r = RENDERERS[col.accessor as string];
    return r ? { ...col, cellRenderer: r } : { ...col };
  }),
);
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="cellRendererConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-cells="cellRendererConfig.tableProps.selectableCells"
    :custom-theme="cellRendererConfig.tableProps.customTheme"
  />
</template>
