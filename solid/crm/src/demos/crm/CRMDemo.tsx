import { createSignal, For } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { SolidHeaderObject, FooterRendererProps, CellChangeProps } from "@simple-table/solid";
import {
  crmData,
  CRM_THEME_COLORS_LIGHT,
  CRM_THEME_COLORS_DARK,
  CRM_FOOTER_COLORS_LIGHT,
  CRM_FOOTER_COLORS_DARK,
  generateVisiblePages,
} from "./crm.demo-data";
import type { CRMLead, CrmShellTheme } from "./crm.demo-data";
import "@simple-table/solid/styles.css";
import "./crm-custom-theme.css";

const EmailEnrich = (props: { colors: typeof CRM_THEME_COLORS_LIGHT }) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [email, setEmail] = createSignal<string | null>(null);

  const handleClick = () => {
    if (isLoading() || email()) return;
    setIsLoading(true);
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    setTimeout(() => {
      setEmail(`${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {email() ? (
        <span style={{ "margin-right": "8px", display: "inline-flex", cursor: "default", "align-items": "center", "column-gap": "6px", "border-radius": "9999px", "background-color": props.colors.tagBg, "padding-inline": "8px", "padding-block": "4px", "font-size": "12px", "font-weight": "500", color: props.colors.tagText }}>
          {email()}
        </span>
      ) : isLoading() ? (
        <span style={{ "margin-right": "8px", display: "inline-flex", cursor: "default", "align-items": "center", "column-gap": "6px", "border-radius": "9999px", "background-color": props.colors.tagBg, "padding-inline": "8px", "padding-block": "4px", "font-size": "12px", "font-weight": "500", color: props.colors.tagText }}>
          <div style={{ width: "12px", height: "12px", border: `2px solid ${props.colors.buttonHoverBg}`, "border-top": `2px solid ${props.colors.accent}`, "border-radius": "50%", animation: "spin 1s linear infinite" }} />
          Enriching...
        </span>
      ) : (
        <span onClick={handleClick} style={{ cursor: "pointer", "align-items": "center", "column-gap": "6px", "border-radius": "9999px", "background-color": "color-mix(in oklab, oklch(62.3% .214 259.815) 10%, transparent)", "padding-inline": "8px", "padding-block": "4px", "font-size": "12px", "font-weight": "500", color: props.colors.tagText }}>
          Enrich
        </span>
      )}
    </>
  );
};

const FitButtons = (props: { colors: typeof CRM_THEME_COLORS_LIGHT }) => {
  const [selected, setSelected] = createSignal<string | null>(null);
  const btnStyle = { flex: "1", padding: "4px 8px", "font-size": "0.75rem", "font-weight": "500", border: "none", cursor: "pointer", display: "flex", "align-items": "center", "justify-content": "center", transition: "background-color 0.2s", color: props.colors.buttonText } as const;
  return (
    <div style={{ display: "flex", "align-items": "center" }}>
      <button onClick={() => setSelected(selected() === "fit" ? null : "fit")} style={{ ...btnStyle, "background-color": selected() === "fit" ? "oklch(62.7% .194 149.214)" : "oklch(92.5% .084 155.995)", "border-top-left-radius": "6px", "border-bottom-left-radius": "6px" }}>✓</button>
      <button onClick={() => setSelected(selected() === "partial" ? null : "partial")} style={{ ...btnStyle, "background-color": selected() === "partial" ? props.colors.buttonHoverBg : props.colors.buttonBg }}>?</button>
      <button onClick={() => setSelected(selected() === "no" ? null : "no")} style={{ ...btnStyle, "background-color": selected() === "no" ? "oklch(64.6% .222 41.116)" : "oklch(90.1% .076 70.697)", "border-top-right-radius": "6px", "border-bottom-right-radius": "6px" }}>X</button>
    </div>
  );
};

function getCRMHeaders(isDark: boolean): SolidHeaderObject[] {
  const colors = isDark ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT;
  return [
    {
      accessor: "name", label: "CONTACT", width: "2fr", minWidth: 290, isSortable: true, isEditable: true, type: "string",
      cellRenderer: ({ row }) => {
        const d = row as unknown as CRMLead;
        const initials = d.name.split(" ").map((n) => n[0]).join("").toUpperCase();
        return (
          <div style={{ display: "flex", "align-items": "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", "border-radius": "50%", background: "linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216))", color: "white", display: "flex", "align-items": "center", "justify-content": "center", "font-size": "12px", "font-weight": "600", "flex-shrink": "0" }}>{initials}</div>
            <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
              <span style={{ cursor: "pointer", "font-size": "14px", "font-weight": "600", color: colors.link }}>{d.name}</span>
              <div style={{ "font-size": "12px", color: colors.textSecondary }}>{d.title}</div>
              <div style={{ "font-size": "12px", color: colors.textSecondary }}><span style={{ "font-size": "12px", color: colors.textTertiary }}>@</span> {d.company}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessor: "signal", label: "SIGNAL", width: "3fr", minWidth: 340, isSortable: true, isEditable: true, type: "string",
      cellRenderer: ({ row }) => (
        <div>
          <div style={{ color: colors.textSecondary, "margin-bottom": "4px", "font-size": "0.875rem" }}>🧠 Just engaged with a <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#0077b5", "text-decoration": "underline" }}>post</a></div>
          <div style={{ "font-size": "12px", color: colors.textTertiary }}><span style={{ "font-weight": "600" }}>Keyword:</span> {(row as unknown as CRMLead).signal}</div>
        </div>
      ),
    },
    {
      accessor: "aiScore", label: "AI SCORE", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "number",
      cellRenderer: ({ row }) => <div style={{ "font-size": "0.875rem" }}>{"🔥".repeat((row as unknown as CRMLead).aiScore)}</div>,
    },
    {
      accessor: "emailStatus", label: "EMAIL", width: "1.5fr", minWidth: 210, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Enrich", value: "Enrich" }, { label: "Verified", value: "Verified" }, { label: "Pending", value: "Pending" }, { label: "Bounced", value: "Bounced" }],
      cellRenderer: () => <EmailEnrich colors={colors} />,
    },
    {
      accessor: "timeAgo", label: "IMPORT", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "string",
      cellRenderer: ({ row }) => <div style={{ "font-size": "13px", color: colors.textSecondary }}>{(row as unknown as CRMLead).timeAgo}</div>,
    },
    {
      accessor: "list", label: "LIST", width: "1.2fr", minWidth: 160, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Leads", value: "Leads" }, { label: "Hot Leads", value: "Hot Leads" }, { label: "Warm Leads", value: "Warm Leads" }, { label: "Cold Leads", value: "Cold Leads" }, { label: "Enterprise", value: "Enterprise" }, { label: "SMB", value: "SMB" }, { label: "Nurture", value: "Nurture" }],
      valueGetter: ({ row }) => { const list = String(row.list); const m: Record<string, number> = { "Hot Leads": 1, "Warm Leads": 2, Enterprise: 3, Leads: 4, SMB: 5, "Cold Leads": 6, Nurture: 7 }; return m[list] || 999; },
      cellRenderer: ({ row }) => <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: "pointer", "font-size": "0.875rem", color: colors.link, "text-decoration": "none", "font-weight": "600" }}>{(row as unknown as CRMLead).list}</a>,
    },
    { accessor: "_fit", label: "Fit", width: "1fr", align: "center", minWidth: 120, cellRenderer: () => <FitButtons colors={colors} /> },
    { accessor: "_contactNow", label: "", width: "1.2fr", minWidth: 160, cellRenderer: () => <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: "pointer", "font-size": "0.875rem", color: colors.link, "text-decoration": "none", "font-weight": "600" }}>Contact Now</a> },
  ];
}

export default function CRMDemo(props: { height?: string | number; theme?: CrmShellTheme }) {
  const isDark = () => props.theme === "custom-dark" || props.theme === "dark" || props.theme === "modern-dark";
  const [data, setData] = createSignal([...crmData]);
  const [rowsPerPage, setRowsPerPage] = createSignal(100);
  const footerColors = () => isDark() ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT;

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) => prev.map((item) => item.id === row.id ? { ...item, [accessor]: newValue } : item));
  };

  return (
    <div class={`custom-theme-container theme-${isDark() ? "custom-dark" : "custom-light"}`}>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={getCRMHeaders(isDark())}
        enableRowSelection
        customTheme={{ headerHeight: 48, rowHeight: 92 }}
        height={props.height ?? "400px"}
        onCellEdit={handleCellEdit}
        rows={data()}
        rowsPerPage={rowsPerPage()}
        shouldPaginate
        theme="custom"
        footerRenderer={(fp: FooterRendererProps) => {
          const c = footerColors();
          const visiblePages = generateVisiblePages(fp.currentPage, fp.totalPages);
          return (
            <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", padding: "12px 16px", "border-top": `1px solid ${c.border}`, "background-color": c.bg }}>
              <p style={{ "font-size": "14px", color: c.text, margin: "0" }}>Showing <span style={{ "font-weight": "500" }}>{fp.startRow}</span> to <span style={{ "font-weight": "500" }}>{fp.endRow}</span> of <span style={{ "font-weight": "500" }}>{fp.totalRows}</span> results</p>
              <div style={{ display: "flex", "align-items": "center", gap: "16px" }}>
                <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                  <label for="itemsPerPage" style={{ "font-size": "14px", color: c.text }}>Show:</label>
                  <select id="itemsPerPage" value={rowsPerPage()} onChange={(e) => { setRowsPerPage(parseInt(e.currentTarget.value, 10)); fp.onPageChange(1); }} style={{ border: `1px solid ${c.inputBorder}`, "border-radius": "6px", padding: "4px 8px", "font-size": "14px", "background-color": c.inputBg, color: c.text, cursor: "pointer" }}>
                    <option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="10000">all</option>
                  </select>
                  <span style={{ "font-size": "14px", color: c.text }}>per page</span>
                </div>
                <nav style={{ display: "inline-flex", "border-radius": "6px", "box-shadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
                  <button onClick={fp.onPrevPage} disabled={!fp.hasPrevPage} style={{ display: "inline-flex", "align-items": "center", padding: "8px", "border-top-left-radius": "6px", "border-bottom-left-radius": "6px", border: `1px solid ${c.buttonBorder}`, "background-color": c.buttonBg, "font-size": "14px", "font-weight": "500", color: c.buttonText, cursor: fp.hasPrevPage ? "pointer" : "not-allowed", opacity: fp.hasPrevPage ? 1 : 0.5 }}>‹</button>
                  <For each={visiblePages}>
                    {(page) => (
                      <button onClick={() => fp.onPageChange(page)} style={{ display: "inline-flex", "align-items": "center", padding: "8px 16px", border: `1px solid ${c.buttonBorder}`, "background-color": fp.currentPage === page ? c.activeBg : c.buttonBg, "font-size": "14px", "font-weight": "500", color: fp.currentPage === page ? c.activeText : c.text, cursor: "pointer", "margin-left": "-1px" }}>{page}</button>
                    )}
                  </For>
                  <button onClick={fp.onNextPage} disabled={!fp.hasNextPage} style={{ display: "inline-flex", "align-items": "center", padding: "8px", "border-top-right-radius": "6px", "border-bottom-right-radius": "6px", border: `1px solid ${c.buttonBorder}`, "background-color": c.buttonBg, "font-size": "14px", "font-weight": "500", color: c.buttonText, cursor: fp.hasNextPage ? "pointer" : "not-allowed", opacity: fp.hasNextPage ? 1 : 0.5, "margin-left": "-1px" }}>›</button>
                </nav>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
