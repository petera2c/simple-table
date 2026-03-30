import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellChangeProps, CellRenderer, FooterRendererProps, Theme } from "@simple-table/angular";
import {
  crmData,
  CRM_THEME_COLORS_LIGHT,
  CRM_THEME_COLORS_DARK,
  CRM_FOOTER_COLORS_LIGHT,
  CRM_FOOTER_COLORS_DARK,
  generateVisiblePages,
} from "@simple-table/examples-shared";
import type { CRMLead } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";
import "../../../../shared/src/styles/crm-custom-theme.css";

function el(tag: string, styles?: Partial<CSSStyleDeclaration>, text?: string): HTMLElement {
  const e = document.createElement(tag);
  if (styles) Object.assign(e.style, styles);
  if (text !== undefined) e.textContent = text;
  return e;
}

function createEmailEnrich(colors: typeof CRM_THEME_COLORS_LIGHT): HTMLElement {
  const wrapper = el("span", {
    cursor: "pointer", alignItems: "center", columnGap: "6px", borderRadius: "9999px",
    backgroundColor: "color-mix(in oklab, oklch(62.3% .214 259.815) 10%, transparent)",
    paddingInline: "8px", paddingBlock: "4px", fontSize: "12px", fontWeight: "500", color: colors.tagText,
  }, "Enrich");

  let isLoading = false;
  let email: string | null = null;

  wrapper.addEventListener("click", () => {
    if (isLoading || email) return;
    isLoading = true;
    wrapper.textContent = "";
    const spinner = el("div", {
      width: "12px", height: "12px",
      border: `2px solid ${colors.buttonHoverBg}`, borderTop: `2px solid ${colors.accent}`,
      borderRadius: "50%", animation: "spin 1s linear infinite",
      display: "inline-block", verticalAlign: "middle", marginRight: "6px",
    });
    wrapper.appendChild(spinner);
    wrapper.appendChild(document.createTextNode("Enriching..."));
    Object.assign(wrapper.style, { cursor: "default", backgroundColor: colors.tagBg });

    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    setTimeout(() => {
      email = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`;
      isLoading = false;
      wrapper.textContent = email;
      Object.assign(wrapper.style, { cursor: "default", backgroundColor: colors.tagBg });
    }, 2000);
  });

  return wrapper;
}

function createFitButtons(colors: typeof CRM_THEME_COLORS_LIGHT): HTMLElement {
  const container = el("div", { display: "flex", alignItems: "center" });
  let selected: string | null = null;

  const btnBase: Partial<CSSStyleDeclaration> = {
    flex: "1", padding: "4px 8px", fontSize: "0.75rem", fontWeight: "500",
    border: "none", cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", transition: "background-color 0.2s", color: colors.buttonText,
  };

  const buttons: Array<{ key: string; label: string; activeBg: string; normalBg: string; radius?: Partial<CSSStyleDeclaration> }> = [
    { key: "fit", label: "✓", activeBg: "oklch(62.7% .194 149.214)", normalBg: "oklch(92.5% .084 155.995)", radius: { borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" } },
    { key: "partial", label: "?", activeBg: colors.buttonHoverBg, normalBg: colors.buttonBg },
    { key: "no", label: "X", activeBg: "oklch(64.6% .222 41.116)", normalBg: "oklch(90.1% .076 70.697)", radius: { borderTopRightRadius: "6px", borderBottomRightRadius: "6px" } },
  ];

  const btnEls: HTMLButtonElement[] = [];
  for (const b of buttons) {
    const btn = document.createElement("button");
    Object.assign(btn.style, btnBase, b.radius ?? {});
    btn.style.backgroundColor = b.normalBg;
    btn.textContent = b.label;
    btn.addEventListener("click", () => {
      selected = selected === b.key ? null : b.key;
      btnEls.forEach((be, i) => {
        be.style.backgroundColor = selected === buttons[i].key ? buttons[i].activeBg : buttons[i].normalBg;
      });
    });
    btnEls.push(btn);
    container.appendChild(btn);
  }

  return container;
}

function getCRMHeaders(isDark: boolean): AngularHeaderObject[] {
  const colors = isDark ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT;

  const contactRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as CRMLead;
    const initials = d.name.split(" ").map((n) => n[0]).join("").toUpperCase();

    const wrapper = el("div", { display: "flex", alignItems: "center", gap: "12px" });
    const avatar = el("div", {
      width: "40px", height: "40px", borderRadius: "50%",
      background: "linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216))",
      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "12px", fontWeight: "600", flexShrink: "0",
    }, initials);

    const info = el("div", { display: "flex", flexDirection: "column", gap: "2px" });
    const nameEl = el("span", { cursor: "pointer", fontSize: "14px", fontWeight: "600", color: colors.link }, d.name);
    const titleEl = el("div", { fontSize: "12px", color: colors.textSecondary }, d.title);
    const companyEl = el("div", { fontSize: "12px", color: colors.textSecondary });
    const atSign = el("span", { fontSize: "12px", color: colors.textTertiary }, "@");
    companyEl.appendChild(atSign);
    companyEl.appendChild(document.createTextNode(` ${d.company}`));

    info.append(nameEl, titleEl, companyEl);
    wrapper.append(avatar, info);
    return wrapper;
  };

  const signalRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as CRMLead;
    const wrapper = el("div");
    const line1 = el("div", { color: colors.textSecondary, marginBottom: "4px", fontSize: "0.875rem" });
    line1.textContent = "🧠 Just engaged with a ";
    const link = el("a", { color: "#0077b5", textDecoration: "underline", cursor: "pointer" }, "post");
    (link as HTMLAnchorElement).href = "#";
    link.addEventListener("click", (e) => e.preventDefault());
    line1.appendChild(link);
    const line2 = el("div", { fontSize: "12px", color: colors.textTertiary });
    const kw = el("span", { fontWeight: "600" }, "Keyword:");
    line2.appendChild(kw);
    line2.appendChild(document.createTextNode(` ${d.signal}`));
    wrapper.append(line1, line2);
    return wrapper;
  };

  const aiScoreRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as CRMLead;
    return el("div", { fontSize: "0.875rem" }, "🔥".repeat(d.aiScore));
  };
  const emailRenderer: CellRenderer = () => createEmailEnrich(colors);
  const timeAgoRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as CRMLead;
    return el("div", { fontSize: "13px", color: colors.textSecondary }, d.timeAgo);
  };

  const listRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as CRMLead;
    const link = el("a", { cursor: "pointer", fontSize: "0.875rem", color: colors.link, textDecoration: "none", fontWeight: "600" }, d.list);
    (link as HTMLAnchorElement).href = "#";
    link.addEventListener("click", (e) => e.preventDefault());
    return link;
  };

  const fitRenderer: CellRenderer = () => createFitButtons(colors);

  const contactNowRenderer: CellRenderer = () => {
    const link = el("a", { cursor: "pointer", fontSize: "0.875rem", color: colors.link, textDecoration: "none", fontWeight: "600" }, "Contact Now");
    (link as HTMLAnchorElement).href = "#";
    link.addEventListener("click", (e) => e.preventDefault());
    return link;
  };

  return [
    { accessor: "name", label: "CONTACT", width: "2fr", minWidth: 290, isSortable: true, isEditable: true, type: "string", cellRenderer: contactRenderer },
    { accessor: "signal", label: "SIGNAL", width: "3fr", minWidth: 340, isSortable: true, isEditable: true, type: "string", cellRenderer: signalRenderer },
    { accessor: "aiScore", label: "AI SCORE", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "number", cellRenderer: aiScoreRenderer },
    {
      accessor: "emailStatus", label: "EMAIL", width: "1.5fr", minWidth: 210, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Enrich", value: "Enrich" }, { label: "Verified", value: "Verified" }, { label: "Pending", value: "Pending" }, { label: "Bounced", value: "Bounced" }],
      cellRenderer: emailRenderer,
    },
    { accessor: "timeAgo", label: "IMPORT", width: "1fr", minWidth: 100, isSortable: true, align: "center", type: "string", cellRenderer: timeAgoRenderer },
    {
      accessor: "list", label: "LIST", width: "1.2fr", minWidth: 160, isSortable: true, align: "center", type: "enum",
      enumOptions: [{ label: "Leads", value: "Leads" }, { label: "Hot Leads", value: "Hot Leads" }, { label: "Warm Leads", value: "Warm Leads" }, { label: "Cold Leads", value: "Cold Leads" }, { label: "Enterprise", value: "Enterprise" }, { label: "SMB", value: "SMB" }, { label: "Nurture", value: "Nurture" }],
      valueGetter: ({ row }) => {
        const m: Record<string, number> = { "Hot Leads": 1, "Warm Leads": 2, Enterprise: 3, Leads: 4, SMB: 5, "Cold Leads": 6, Nurture: 7 };
        return m[String(row.list)] || 999;
      },
      cellRenderer: listRenderer,
    },
    { accessor: "_fit", label: "Fit", width: "1fr", align: "center", minWidth: 120, cellRenderer: fitRenderer },
    { accessor: "_contactNow", label: "", width: "1.2fr", minWidth: 160, cellRenderer: contactNowRenderer },
  ];
}

function createCRMFooter(
  props: FooterRendererProps,
  footerColors: typeof CRM_FOOTER_COLORS_LIGHT,
  rowsPerPage: number,
  onRowsPerPageChange: (n: number) => void,
): HTMLElement {
  const c = footerColors;
  const wrapper = el("div", {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderTop: `1px solid ${c.border}`, backgroundColor: c.bg,
  });

  const info = el("p", { fontSize: "14px", color: c.text, margin: "0" });
  info.innerHTML = `Showing <span style="font-weight:500">${props.startRow}</span> to <span style="font-weight:500">${props.endRow}</span> of <span style="font-weight:500">${props.totalRows}</span> results`;
  wrapper.appendChild(info);

  const right = el("div", { display: "flex", alignItems: "center", gap: "16px" });

  const perPageContainer = el("div", { display: "flex", alignItems: "center", gap: "8px" });
  perPageContainer.appendChild(el("label", { fontSize: "14px", color: c.text }, "Show:"));

  const select = document.createElement("select");
  Object.assign(select.style, {
    border: `1px solid ${c.inputBorder}`, borderRadius: "6px", padding: "4px 8px",
    fontSize: "14px", backgroundColor: c.inputBg, color: c.text, cursor: "pointer",
  });
  for (const opt of [25, 50, 100, 200, 10000]) {
    const option = document.createElement("option");
    option.value = String(opt);
    option.textContent = opt === 10000 ? "all" : String(opt);
    if (opt === rowsPerPage) option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener("change", () => {
    onRowsPerPageChange(parseInt(select.value, 10));
    props.onPageChange(1);
  });
  perPageContainer.appendChild(select);
  perPageContainer.appendChild(el("span", { fontSize: "14px", color: c.text }, "per page"));
  right.appendChild(perPageContainer);

  const nav = el("nav", { display: "inline-flex", borderRadius: "6px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" });

  const makePageBtn = (label: string, onClick: () => void, disabled: boolean, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    Object.assign(btn.style, {
      display: "inline-flex", alignItems: "center", padding: "8px",
      border: `1px solid ${c.buttonBorder}`, backgroundColor: active ? c.activeBg : c.buttonBg,
      fontSize: "14px", fontWeight: "500", color: active ? c.activeText : disabled ? c.buttonText : c.text,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? "0.5" : "1",
    });
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  };

  const prevBtn = makePageBtn("‹", () => props.onPrevPage(), !props.hasPrevPage);
  Object.assign(prevBtn.style, { borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" });
  nav.appendChild(prevBtn);

  const visiblePages = generateVisiblePages(props.currentPage, props.totalPages);
  for (const page of visiblePages) {
    const btn = makePageBtn(String(page), () => props.onPageChange(page), false, page === props.currentPage);
    btn.style.padding = "8px 16px";
    btn.style.marginLeft = "-1px";
    nav.appendChild(btn);
  }

  const nextBtn = makePageBtn("›", () => props.onNextPage(), !props.hasNextPage);
  Object.assign(nextBtn.style, { borderTopRightRadius: "6px", borderBottomRightRadius: "6px", marginLeft: "-1px" });
  nav.appendChild(nextBtn);

  right.appendChild(nav);
  wrapper.appendChild(right);
  return wrapper;
}

@Component({
  selector: "crm-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div [class]="'custom-theme-container theme-' + (isDark ? 'custom-dark' : 'custom-light')">
      <simple-table
        #simpleTable
        [columnReordering]="true"
        [columnResizing]="true"
        [defaultHeaders]="headers"
        [enableRowSelection]="true"
        [customTheme]="{ headerHeight: 48, rowHeight: 92 }"
        [height]="height"
        [rows]="data"
        [rowsPerPage]="rowsPerPage"
        [shouldPaginate]="true"
        [theme]="'custom'"
        [footerRenderer]="footerFn"
        (cellEdit)="onCellEdit($event)"
      ></simple-table>
    </div>
  `,
})
export class CRMDemoComponent implements OnInit {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  isDark = false;
  data = [...crmData];
  headers: AngularHeaderObject[] = getCRMHeaders(false);
  rowsPerPage = 100;

  footerFn = (props: FooterRendererProps) => {
    const footerColors = this.isDark ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT;
    return createCRMFooter(props, footerColors, this.rowsPerPage, (n) => {
      this.rowsPerPage = n;
    });
  };

  ngOnInit(): void {
    this.isDark = this.theme === "custom-dark" || this.theme === "dark" || this.theme === "modern-dark";
    this.headers = getCRMHeaders(this.isDark);
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item,
    );
  }
}
