/**
 * Leads example headers – ported from React leads-headers (vanilla-compatible).
 * Cell renderers return strings; no React-specific components.
 */
import type { CellRendererProps, ColumnDef } from "../../../src/index";

export interface LeadRow {
  id: string;
  name: string;
  title: string;
  company: string;
  signal: string;
  aiScore: number;
  emailStatus: string;
  timeAgo: string;
  list: string;
  linkedin: boolean;
}

export const LEADS_HEADERS: ColumnDef<LeadRow>[] = [
  {
    accessor: "name",
    label: "CONTACT",
    width: 290,
    minWidth: 290,
    sortable: true,
    editable: true,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) =>
      `${row.name ?? ""} | ${row.title ?? ""} @ ${row.company ?? ""}`.trim(),
  },
  {
    accessor: "signal",
    label: "SIGNAL",
    width: 340,
    minWidth: 340,
    sortable: true,
    editable: true,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) =>
      `Keyword: ${String(row.signal ?? "")}`,
  },
  {
    accessor: "aiScore",
    label: "AI SCORE",
    width: 100,
    minWidth: 100,
    sortable: true,
    align: "center",
    type: "number",
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) => {
      const score = Number(row.aiScore ?? 0);
      return "🔥".repeat(score) || "—";
    },
  },
  {
    accessor: "emailStatus",
    label: "EMAIL",
    width: 210,
    minWidth: 210,
    sortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Enrich", value: "Enrich" },
      { label: "Verified", value: "Verified" },
      { label: "Pending", value: "Pending" },
      { label: "Bounced", value: "Bounced" },
    ],
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) =>
      String(row.emailStatus ?? "—"),
  },
  {
    accessor: "timeAgo",
    label: "IMPORT",
    width: 100,
    minWidth: 100,
    sortable: true,
    align: "center",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) =>
      String(row.timeAgo ?? "—"),
  },
  {
    accessor: "list",
    label: "LIST",
    width: 160,
    minWidth: 160,
    sortable: true,
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
    cellRenderer: ({ row }: CellRendererProps<LeadRow>) =>
      String(row.list ?? "—"),
  },
  {
    accessor: "_fit",
    label: "Fit",
    width: 120,
    minWidth: 120,
    cellRenderer: () => "—",
  },
  {
    accessor: "_contactNow",
    label: "",
    width: 160,
    minWidth: 160,
    cellRenderer: () => "Contact Now",
  },
];
