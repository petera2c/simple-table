import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, FooterRendererProps } from "@simple-table/react";
import type { CellChangeProps } from "simple-table-core";
import { crmData, CRM_THEME_COLORS_LIGHT, CRM_THEME_COLORS_DARK, CRM_FOOTER_COLORS_LIGHT, CRM_FOOTER_COLORS_DARK, generateVisiblePages } from "@simple-table/examples-shared";
import type { CRMLead } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "@simple-table/examples-shared/styles/crm-custom-theme.css";

const EmailEnrich = ({ colors }: { colors: typeof CRM_THEME_COLORS_LIGHT }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const handleClick = () => {
    if (isLoading || email) return;
    setIsLoading(true);
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    setTimeout(() => {
      setEmail(`${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`);
      setIsLoading(false);
    }, 2000);
  };

  if (email) {
    return (
      <span style={{ marginRight: "8px", display: "inline-flex", cursor: "default", alignItems: "center", columnGap: "6px", borderRadius: "9999px", backgroundColor: colors.tagBg, paddingInline: "8px", paddingBlock: "4px", fontSize: "12px", fontWeight: 500, color: colors.tagText }}>
        {email}
      </span>
    );
  }
  if (isLoading) {
    return (
      <span style={{ marginRight: "8px", display: "inline-flex", cursor: "default", alignItems: "center", columnGap: "6px", borderRadius: "9999px", backgroundColor: colors.tagBg, paddingInline: "8px", paddingBlock: "4px", fontSize: "12px", fontWeight: 500, color: colors.tagText }}>
        <div style={{ width: "12px", height: "12px", border: `2px solid ${colors.buttonHoverBg}`, borderTop: `2px solid ${colors.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        Enriching...
      </span>
    );
  }
  return (
    <span onClick={handleClick} style={{ cursor: "pointer", alignItems: "center", columnGap: "6px", borderRadius: "9999px", backgroundColor: "color-mix(in oklab, oklch(62.3% .214 259.815) 10%, transparent)", paddingInline: "8px", paddingBlock: "4px", fontSize: "12px", fontWeight: 500, color: colors.tagText }}>
      Enrich
    </span>
  );
};

const FitButtons = ({ colors }: { colors: typeof CRM_THEME_COLORS_LIGHT }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const btnStyle = { flex: 1, padding: "4px 8px", fontSize: "0.75rem", fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s", color: colors.buttonText } as const;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button onClick={() => setSelected(selected === "fit" ? null : "fit")} style={{ ...btnStyle, backgroundColor: selected === "fit" ? "oklch(62.7% .194 149.214)" : "oklch(92.5% .084 155.995)", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}>✓</button>
      <button onClick={() => setSelected(selected === "partial" ? null : "partial")} style={{ ...btnStyle, backgroundColor: selected === "partial" ? colors.buttonHoverBg : colors.buttonBg }}>?</button>
      <button onClick={() => setSelected(selected === "no" ? null : "no")} style={{ ...btnStyle, backgroundColor: selected === "no" ? "oklch(64.6% .222 41.116)" : "oklch(90.1% .076 70.697)", borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>X</button>
    </div>
  );
};

function getCRMHeaders(isDark: boolean): ReactHeaderObject[] {
  const colors = isDark ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT;
  return [
    {
      accessor: "name", label: "CONTACT", width: "2fr", minWidth: 290, isSortable: true, isEditable: true, type: "string",
      cellRenderer: ({ row: r }) => {
        const { name, title, company } = r as unknown as CRMLead;
        const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>{initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ cursor: "pointer", fontSize: "14px", fontWeight: "600", color: colors.link }}>{name}</span>
              <div style={{ fontSize: "12px", color: colors.textSecondary }}>{title}</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary }}><span style={{ fontSize: "12px", color: colors.textTertiary }}>@</span> {company}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessor: "signal", label: "SIGNAL", width: "3fr", minWidth: 340, isSortable: true, isEditable: true, type: "string",
      cellRenderer: ({ row: r }) => {
        const { signal } = r as unknown as CRMLead;
        return (
          <div>
            <div style={{ color: colors.textSecondary, marginBottom: "4px", fontSize: "0.875rem" }}>🧠 Just engaged with a <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#0077b5", textDecoration: "underline" }}>post</a></div>
            <div style={{ fontSize: "12px", color: colors.textTertiary }}><span style={{ fontWeight: "600" }}>Keyword:</span> {signal}</div>
          </div>
        );
      },
    },
    {
      accessor: "aiScore", label: "AI SCORE", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "number",
      cellRenderer: ({ row: r }) => {
        const { aiScore } = r as unknown as CRMLead;
        return <div style={{ fontSize: "0.875rem" }}>{"🔥".repeat(aiScore)}</div>;
      },
    },
    {
      accessor: "emailStatus", label: "EMAIL", width: "1.5fr", minWidth: 210, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Enrich", value: "Enrich" }, { label: "Verified", value: "Verified" }, { label: "Pending", value: "Pending" }, { label: "Bounced", value: "Bounced" }],
      cellRenderer: () => <EmailEnrich colors={colors} />,
    },
    {
      accessor: "timeAgo", label: "IMPORT", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "string",
      cellRenderer: ({ row: r }) => {
        const { timeAgo } = r as unknown as CRMLead;
        return <div style={{ fontSize: "13px", color: colors.textSecondary }}>{timeAgo}</div>;
      },
    },
    {
      accessor: "list", label: "LIST", width: "1.2fr", minWidth: 160, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Leads", value: "Leads" }, { label: "Hot Leads", value: "Hot Leads" }, { label: "Warm Leads", value: "Warm Leads" }, { label: "Cold Leads", value: "Cold Leads" }, { label: "Enterprise", value: "Enterprise" }, { label: "SMB", value: "SMB" }, { label: "Nurture", value: "Nurture" }],
      valueGetter: ({ row }) => { const m: Record<string, number> = { "Hot Leads": 1, "Warm Leads": 2, Enterprise: 3, Leads: 4, SMB: 5, "Cold Leads": 6, Nurture: 7 }; return m[String(row.list)] || 999; },
      cellRenderer: ({ row: r }) => {
        const { list } = r as unknown as CRMLead;
        return <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: "pointer", fontSize: "0.875rem", color: colors.link, textDecoration: "none", fontWeight: "600" }}>{list}</a>;
      },
    },
    { accessor: "_fit", label: "Fit", width: "1fr", align: "center", minWidth: 120, cellRenderer: () => <FitButtons colors={colors} /> },
    { accessor: "_contactNow", label: "", width: "1.2fr", minWidth: 160, cellRenderer: () => <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: "pointer", fontSize: "0.875rem", color: colors.link, textDecoration: "none", fontWeight: "600" }}>Contact Now</a> },
  ];
}

const CRMDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const isDark = theme === "custom-dark" || theme === "dark" || theme === "modern-dark";
  const [data, setData] = useState([...crmData]);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const footerColors = isDark ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT;

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) => prev.map((item) => item.id === row.id ? { ...item, [accessor]: newValue } : item));
  };

  return (
    <div className={`custom-theme-container theme-${isDark ? "custom-dark" : "custom-light"}`}>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={getCRMHeaders(isDark)}
        enableRowSelection
        customTheme={{ headerHeight: 48, rowHeight: 92 }}
        height={height}
        onCellEdit={handleCellEdit}
        rows={data}
        rowsPerPage={rowsPerPage}
        shouldPaginate
        theme="custom"
        footerRenderer={({ currentPage, totalPages, totalRows, startRow, endRow, onPageChange, onNextPage, onPrevPage, hasNextPage, hasPrevPage }: FooterRendererProps) => {
          const c = footerColors;
          const visiblePages = generateVisiblePages(currentPage, totalPages);
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${c.border}`, backgroundColor: c.bg }}>
              <p style={{ fontSize: "14px", color: c.text, margin: 0 }}>Showing <span style={{ fontWeight: "500" }}>{startRow}</span> to <span style={{ fontWeight: "500" }}>{endRow}</span> of <span style={{ fontWeight: "500" }}>{totalRows}</span> results</p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label htmlFor="itemsPerPage" style={{ fontSize: "14px", color: c.text }}>Show:</label>
                  <select id="itemsPerPage" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); onPageChange(1); }} style={{ border: `1px solid ${c.inputBorder}`, borderRadius: "6px", padding: "4px 8px", fontSize: "14px", backgroundColor: c.inputBg, color: c.text, cursor: "pointer" }}>
                    <option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="10000">all</option>
                  </select>
                  <span style={{ fontSize: "14px", color: c.text }}>per page</span>
                </div>
                <nav style={{ display: "inline-flex", borderRadius: "6px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
                  <button onClick={onPrevPage} disabled={!hasPrevPage} style={{ display: "inline-flex", alignItems: "center", padding: "8px", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px", border: `1px solid ${c.buttonBorder}`, backgroundColor: c.buttonBg, fontSize: "14px", fontWeight: "500", color: c.buttonText, cursor: hasPrevPage ? "pointer" : "not-allowed", opacity: hasPrevPage ? 1 : 0.5 }}>‹</button>
                  {visiblePages.map((page) => (
                    <button key={page} onClick={() => onPageChange(page)} style={{ display: "inline-flex", alignItems: "center", padding: "8px 16px", border: `1px solid ${c.buttonBorder}`, backgroundColor: currentPage === page ? c.activeBg : c.buttonBg, fontSize: "14px", fontWeight: "500", color: currentPage === page ? c.activeText : c.text, cursor: "pointer", marginLeft: "-1px" }}>{page}</button>
                  ))}
                  <button onClick={onNextPage} disabled={!hasNextPage} style={{ display: "inline-flex", alignItems: "center", padding: "8px", borderTopRightRadius: "6px", borderBottomRightRadius: "6px", border: `1px solid ${c.buttonBorder}`, backgroundColor: c.buttonBg, fontSize: "14px", fontWeight: "500", color: c.buttonText, cursor: hasNextPage ? "pointer" : "not-allowed", opacity: hasNextPage ? 1 : 0.5, marginLeft: "-1px" }}>›</button>
                </nav>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default CRMDemo;
