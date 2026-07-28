/**
 * Docs & Examples / Icons – visual audit of default table icons.
 * Use this to inspect crispness at real header size vs enlarged.
 */
import type { Meta } from "@storybook/html";
import {
  createAngleDownIcon,
  createAngleLeftIcon,
  createAngleRightIcon,
  createAngleUpIcon,
  createAscIcon,
  createCheckIcon,
  createDescIcon,
  createDragIcon,
  createFilterIcon,
  createMinusIcon,
  createSelectIcon,
} from "../../src/icons";
import { ColumnDef } from "../../src/index";
import { renderVanillaTable } from "../utils";
import {
  createLegacyAngleDownIcon,
  createLegacyAngleLeftIcon,
  createLegacyAngleRightIcon,
  createLegacyAngleUpIcon,
  createLegacyAscIcon,
  createLegacyCheckIcon,
  createLegacyDescIcon,
  createLegacyDragIcon,
  createLegacyFilterIcon,
  createLegacySelectIcon,
} from "./legacyIcons";
import { FILTER_COMPARISON, type FilterVariant } from "./filterVariants";

const meta: Meta = {
  title: "Docs & Examples/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Default Simple Table icons at real usage size and enlarged. Stroke icons on a 24×24 grid.",
      },
    },
  },
};

export default meta;

type IconFactory = (className?: string) => SVGSVGElement;

interface IconEntry {
  name: string;
  role: string;
  factory: IconFactory | (() => SVGSVGElement);
  sizeNote: string;
  viewBox: string;
  crispRisk: "high" | "medium" | "low";
  notes: string;
  className?: string;
}

const ICONS: IconEntry[] = [
  {
    name: "Filter",
    role: "icons.filter (header)",
    factory: createFilterIcon,
    sizeNote: "20×20 · list filter",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke narrowing bars — matches sort/chevron set.",
    className: "st-header-icon",
  },
  {
    name: "Sort Asc",
    role: "icons.sortUp (header)",
    factory: createAscIcon,
    sizeNote: "20×20 · arrow-up",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke arrow for ascending sort.",
    className: "st-header-icon",
  },
  {
    name: "Sort Desc",
    role: "icons.sortDown (header)",
    factory: createDescIcon,
    sizeNote: "20×20 · arrow-down",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke arrow for descending sort.",
    className: "st-header-icon",
  },
  {
    name: "Angle Right",
    role: "expand / next / headerCollapse",
    factory: createAngleRightIcon,
    sizeNote: "20×20 · chevron-right",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke chevron. Rotates 90° when expanded.",
    className: "st-expand-icon",
  },
  {
    name: "Angle Left",
    role: "prev / headerExpand",
    factory: createAngleLeftIcon,
    sizeNote: "20×20 · chevron-left",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Mirror of Angle Right.",
    className: "st-next-prev-icon",
  },
  {
    name: "Angle Down",
    role: "exported, unused by defaults",
    factory: createAngleDownIcon,
    sizeNote: "20×20 · chevron-down",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "In /icons but not wired into TableInitializer defaults.",
  },
  {
    name: "Angle Up",
    role: "exported, unused by defaults",
    factory: createAngleUpIcon,
    sizeNote: "20×20 · chevron-up",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "In /icons but not wired into TableInitializer defaults.",
  },
  {
    name: "Drag",
    role: "icons.drag (column editor)",
    factory: createDragIcon,
    sizeNote: "16×10 · r=1.5 dots",
    viewBox: "0 0 16 10",
    crispRisk: "medium",
    notes: "Six-dot drag grip.",
    className: "st-drag-icon",
  },
  {
    name: "Check",
    role: "checkbox checkmark",
    factory: createCheckIcon,
    sizeNote: "12×12 · check",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke check via createCheckIcon → createCheckbox.",
    className: "st-checkbox-checkmark",
  },
  {
    name: "Minus",
    role: "checkbox indeterminate",
    factory: createMinusIcon,
    sizeNote: "12×12 · minus",
    viewBox: "0 0 24 24",
    crispRisk: "low",
    notes: "Stroke minus via createMinusIcon → indeterminate createCheckbox.",
    className: "st-checkbox-minus",
  },
  {
    name: "Select",
    role: "filter/select dropdown arrow",
    factory: createSelectIcon,
    sizeNote: "12×12 · soft stroke",
    viewBox: "0 0 12 12",
    crispRisk: "low",
    notes: "Softer chevron (not the expand angle) — open rotates 180°.",
  },
];

const RISK_COLOR: Record<IconEntry["crispRisk"], string> = {
  high: "#b45309",
  medium: "#64748b",
  low: "#15803d",
};

function applyIconColor(svg: SVGSVGElement): void {
  svg.style.color = "#475569";
}

function createIconCard(entry: IconEntry): HTMLElement {
  const card = document.createElement("article");
  card.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:12px",
    "padding:16px",
    "border:1px solid #e2e8f0",
    "border-radius:8px",
    "background:#fff",
    "min-width:0",
  ].join(";");

  const title = document.createElement("div");
  title.style.cssText = "display:flex;align-items:baseline;justify-content:space-between;gap:8px;";
  const name = document.createElement("strong");
  name.textContent = entry.name;
  name.style.fontSize = "14px";
  const risk = document.createElement("span");
  risk.textContent = entry.crispRisk;
  risk.style.cssText = `font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:${RISK_COLOR[entry.crispRisk]};`;
  title.append(name, risk);

  const metaLine = document.createElement("div");
  metaLine.style.cssText = "font-size:12px;color:#64748b;line-height:1.4;";
  metaLine.innerHTML = [
    `<div><code>${entry.role}</code></div>`,
    `<div>viewBox <code>${entry.viewBox}</code> · ${entry.sizeNote}</div>`,
  ].join("");

  const stages = document.createElement("div");
  stages.style.cssText =
    "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-items:end;";

  const stageDefs: { label: string; size: number }[] = [
    { label: "Actual", size: 14 },
    { label: "2×", size: 28 },
    { label: "4×", size: 56 },
  ];

  for (const stage of stageDefs) {
    const cell = document.createElement("div");
    cell.style.cssText =
      "display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;background:#f8fafc;border-radius:6px;";

    const swatch = document.createElement("div");
    swatch.style.cssText =
      "display:flex;align-items:center;justify-content:center;min-height:64px;line-height:1;color:#475569;";

    const icon = entry.factory(entry.className);
    applyIconColor(icon);
    // Scale for gallery preview while keeping aspect (fixed-px icons ignore font-size).
    const nativeW = Number(icon.getAttribute("width") || 14);
    const nativeH = Number(icon.getAttribute("height") || 14);
    const scale = stage.size / Math.max(nativeW, nativeH);
    icon.setAttribute("width", String(Math.round(nativeW * scale)));
    icon.setAttribute("height", String(Math.round(nativeH * scale)));
    swatch.appendChild(icon);

    const label = document.createElement("span");
    label.textContent = stage.label;
    label.style.cssText = "font-size:10px;color:#94a3b8;";

    cell.append(swatch, label);
    stages.appendChild(cell);
  }

  const notes = document.createElement("p");
  notes.textContent = entry.notes;
  notes.style.cssText = "margin:0;font-size:12px;color:#334155;line-height:1.45;";

  card.append(title, metaLine, stages, notes);
  return card;
}

function createGalleryRoot(): HTMLElement {
  const root = document.createElement("div");
  root.style.cssText = [
    "font-family:ui-sans-serif,system-ui,sans-serif",
    "color:#0f172a",
    "max-width:1100px",
    "margin:0 auto",
    "padding:8px",
  ].join(";");

  const heading = document.createElement("h2");
  heading.textContent = "Default table icons";
  heading.style.cssText = "margin:0 0 4px;font-size:20px;font-weight:600;";

  const blurb = document.createElement("p");
  blurb.style.cssText = "margin:0 0 20px;font-size:13px;color:#64748b;max-width:70ch;line-height:1.5;";
  blurb.textContent =
    "Header icons at 20px. Stroke icons for filter/sort/angles/check; soft select; drag dots.";

  const grid = document.createElement("div");
  grid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;";

  for (const entry of ICONS) {
    grid.appendChild(createIconCard(entry));
  }

  const compare = document.createElement("section");
  compare.style.cssText = "margin-top:28px;";
  const compareTitle = document.createElement("h3");
  compareTitle.textContent = "Filter at true size — light / dark";
  compareTitle.style.cssText = "margin:0 0 12px;font-size:16px;font-weight:600;";

  const compareRow = document.createElement("div");
  compareRow.style.cssText = "display:flex;gap:16px;flex-wrap:wrap;";

  for (const bg of [
    { label: "Light header", background: "#f1f5f9", fill: "#64748b" },
    { label: "Dark header", background: "#1e293b", fill: "#94a3b8" },
    { label: "Active (accent)", background: "#f1f5f9", fill: "#2563eb" },
  ]) {
    const box = document.createElement("div");
    box.style.cssText = [
      "display:flex",
      "flex-direction:column",
      "align-items:center",
      "gap:8px",
      "padding:20px 28px",
      `background:${bg.background}`,
      "border-radius:8px",
      "border:1px solid #e2e8f0",
    ].join(";");
    const icon = createFilterIcon("st-header-icon");
    icon.style.color = bg.fill;
    box.appendChild(icon);
    const label = document.createElement("span");
    label.textContent = bg.label;
    label.style.cssText = `font-size:11px;color:${bg.background === "#1e293b" ? "#cbd5e1" : "#64748b"};`;
    box.appendChild(label);
    compareRow.appendChild(box);
  }

  compare.append(compareTitle, compareRow);
  root.append(heading, blurb, grid, compare);
  return root;
}

export const IconGallery = {
  render: () => createGalleryRoot(),
};

type ComparePair = {
  name: string;
  oldFactory: () => SVGSVGElement;
  newFactory: () => SVGSVGElement;
  /** Old icons that size via 1em need a font-size context. */
  oldUsesEm?: boolean;
};

const COMPARE_PAIRS: ComparePair[] = [
  {
    name: "Filter",
    oldFactory: () => createLegacyFilterIcon(),
    newFactory: () => createFilterIcon(),
    oldUsesEm: true,
  },
  {
    name: "Sort Asc",
    oldFactory: () => createLegacyAscIcon(),
    newFactory: () => createAscIcon(),
    oldUsesEm: true,
  },
  {
    name: "Sort Desc",
    oldFactory: () => createLegacyDescIcon(),
    newFactory: () => createDescIcon(),
    oldUsesEm: true,
  },
  {
    name: "Angle Right",
    oldFactory: () => createLegacyAngleRightIcon(),
    newFactory: () => createAngleRightIcon(),
  },
  {
    name: "Angle Left",
    oldFactory: () => createLegacyAngleLeftIcon(),
    newFactory: () => createAngleLeftIcon(),
  },
  {
    name: "Angle Down",
    oldFactory: () => createLegacyAngleDownIcon(),
    newFactory: () => createAngleDownIcon(),
  },
  {
    name: "Angle Up",
    oldFactory: () => createLegacyAngleUpIcon(),
    newFactory: () => createAngleUpIcon(),
  },
  {
    name: "Drag",
    oldFactory: () => createLegacyDragIcon(),
    newFactory: () => createDragIcon(),
  },
  {
    name: "Check",
    oldFactory: () => createLegacyCheckIcon(),
    newFactory: () => createCheckIcon(),
  },
  {
    name: "Select",
    oldFactory: () => createLegacySelectIcon(),
    newFactory: () => createSelectIcon(),
  },
];

function createSideBySideRoot(): HTMLElement {
  const root = document.createElement("div");
  root.style.cssText =
    "font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a;max-width:900px;margin:0 auto;padding:8px;";

  const heading = document.createElement("h2");
  heading.textContent = "Old vs new icons";
  heading.style.cssText = "margin:0 0 4px;font-size:20px;font-weight:600;";

  const blurb = document.createElement("p");
  blurb.style.cssText = "margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.5;";
  blurb.textContent =
    "Left = original defaults. Right = current defaults. Header size + 3×.";

  const headerRow = document.createElement("div");
  headerRow.style.cssText =
    "display:grid;grid-template-columns:120px 1fr 1fr;gap:8px;padding:0 12px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#94a3b8;";
  headerRow.innerHTML = "<span></span><span>Old</span><span>New</span>";

  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-direction:column;gap:8px;";

  for (const pair of COMPARE_PAIRS) {
    const row = document.createElement("div");
    row.style.cssText =
      "display:grid;grid-template-columns:120px 1fr 1fr;gap:8px;align-items:center;padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;";

    const name = document.createElement("strong");
    name.textContent = pair.name;
    name.style.fontSize = "13px";

    const makeCell = (factory: () => SVGSVGElement, usesEm?: boolean) => {
      const cell = document.createElement("div");
      cell.style.cssText = "display:flex;align-items:center;gap:20px;";

      const actual = document.createElement("div");
      actual.style.cssText =
        "display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#f8fafc;border-radius:6px;color:#475569;" +
        (usesEm ? "font-size:14px;" : "");
      const a = factory();
      a.style.color = "#475569";
      actual.appendChild(a);

      const big = document.createElement("div");
      big.style.cssText =
        "display:flex;align-items:center;justify-content:center;width:72px;height:72px;background:#f8fafc;border-radius:6px;color:#475569;" +
        (usesEm ? "font-size:42px;" : "");
      const b = factory();
      b.style.color = "#475569";
      if (!usesEm) {
        const w = Number(b.getAttribute("width") || 14);
        const h = Number(b.getAttribute("height") || 14);
        const scale = 42 / Math.max(w, h);
        b.setAttribute("width", String(Math.round(w * scale)));
        b.setAttribute("height", String(Math.round(h * scale)));
      }
      big.appendChild(b);

      cell.append(actual, big);
      return cell;
    };

    row.append(name, makeCell(pair.oldFactory, pair.oldUsesEm), makeCell(pair.newFactory));
    list.appendChild(row);
  }

  root.append(heading, blurb, headerRow, list);
  return root;
}

export const OldVsNew = {
  name: "Old vs new",
  render: () => createSideBySideRoot(),
};

function createFilterVariantCard(variant: FilterVariant): HTMLElement {
  const card = document.createElement("article");
  card.style.cssText =
    "display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;";

  const title = document.createElement("strong");
  title.textContent = variant.name;
  title.style.fontSize = "13px";

  const note = document.createElement("p");
  note.textContent = variant.note;
  note.style.cssText = "margin:0;font-size:11px;color:#64748b;line-height:1.4;min-height:2.8em;";

  const swatches = document.createElement("div");
  swatches.style.cssText = "display:flex;gap:8px;";

  for (const bg of [
    { background: "#f1f5f9", color: "#475569", label: "Light" },
    { background: "#1e293b", color: "#94a3b8", label: "Dark" },
  ]) {
    const col = document.createElement("div");
    col.style.cssText = "display:flex;flex-direction:column;gap:6px;flex:1;";

    const actual = document.createElement("div");
    actual.style.cssText = `display:flex;align-items:center;justify-content:center;height:44px;background:${bg.background};border-radius:6px;color:${bg.color};`;
    const a = variant.create();
    a.style.color = bg.color;
    actual.appendChild(a);

    const big = document.createElement("div");
    big.style.cssText = `display:flex;align-items:center;justify-content:center;height:72px;background:${bg.background};border-radius:6px;color:${bg.color};`;
    const b = variant.create();
    b.style.color = bg.color;
    const w = Number(b.getAttribute("width") || 14);
    const h = Number(b.getAttribute("height") || 14);
    const scale = 42 / Math.max(w, h);
    b.setAttribute("width", String(Math.round(w * scale)));
    b.setAttribute("height", String(Math.round(h * scale)));
    big.appendChild(b);

    const cap = document.createElement("span");
    cap.textContent = bg.label;
    cap.style.cssText = "font-size:10px;color:#94a3b8;text-align:center;";

    col.append(actual, big, cap);
    swatches.appendChild(col);
  }

  card.append(title, note, swatches);
  return card;
}

function createVariantSection(titleText: string, blurbText: string, variants: FilterVariant[]): HTMLElement {
  const section = document.createElement("section");
  section.style.cssText = "margin-bottom:28px;";

  const title = document.createElement("h3");
  title.textContent = titleText;
  title.style.cssText = "margin:0 0 4px;font-size:16px;font-weight:600;";

  const blurb = document.createElement("p");
  blurb.textContent = blurbText;
  blurb.style.cssText = "margin:0 0 12px;font-size:12px;color:#64748b;line-height:1.45;";

  const grid = document.createElement("div");
  grid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;";

  for (const variant of variants) {
    grid.appendChild(createFilterVariantCard(variant));
  }

  section.append(title, blurb, grid);
  return section;
}

function createFilterVariantsRoot(): HTMLElement {
  const root = document.createElement("div");
  root.style.cssText =
    "font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a;max-width:960px;margin:0 auto;padding:8px;";

  const heading = document.createElement("h2");
  heading.textContent = "Filter variants";
  heading.style.cssText = "margin:0 0 4px;font-size:20px;font-weight:600;";

  const blurb = document.createElement("p");
  blurb.style.cssText = "margin:0 0 20px;font-size:13px;color:#64748b;line-height:1.5;max-width:70ch;";
  blurb.textContent =
    "Our two favorites, plus the glyphs major products and icon sets actually use. Header size + 3× on light/dark.";

  root.append(
    heading,
    blurb,
    createVariantSection(
      "Comparison",
      "List filter (current) and other common filter metaphors for comparison.",
      FILTER_COMPARISON,
    ),
  );
  return root;
}

export const FilterVariants = {
  name: "Filter variants",
  render: () => createFilterVariantsRoot(),
};

export const IconsInTableContext = {
  name: "In table context",
  render: () => {
    const headers: ColumnDef[] = [
      { accessor: "id", label: "ID", width: 72, type: "number", sortable: true },
      {
        accessor: "name",
        label: "Name",
        width: 180,
        type: "string",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "status",
        label: "Status",
        width: 140,
        type: "string",
        sortable: true,
        filterable: true,
      },
      { accessor: "amount", label: "Amount", width: 120, type: "number", sortable: true },
    ];
    const data = [
      { id: 1, name: "Alice", status: "Active", amount: 120 },
      { id: 2, name: "Bob", status: "Pending", amount: 80 },
      { id: 3, name: "Carol", status: "Active", amount: 210 },
    ];

    const shell = document.createElement("div");
    shell.style.cssText = "display:flex;flex-direction:column;gap:12px;";

    const note = document.createElement("p");
    note.style.cssText = "margin:0;font-size:13px;color:#64748b;";
    note.textContent =
      "Hover headers to reveal sort/filter icons at real density. Sort Name asc so the sort glyph is visible.";

    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "280px",
      enablePagination: true,
      rowsPerPage: 2,
      initialSortColumn: "name",
      initialSortDirection: "asc",
    });

    shell.append(note, wrapper);
    return shell;
  },
};
