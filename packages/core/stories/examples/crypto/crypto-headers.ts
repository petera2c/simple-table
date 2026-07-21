/**
 * Crypto example headers – vanilla port of the marketing crypto-headers.
 */
import type { CellRenderer, ColumnDef } from "../../../src/index";
import {
  formatCompactUsd,
  formatPrice,
  formatSignedPercent,
  type CryptoCoin,
} from "./crypto-data";

const UP = "#16a34a";
const DOWN = "#dc2626";
const MUTED = "#9ca3af";
const TEXT = "#374151";

function changeRenderer(accessor: keyof CryptoCoin): CellRenderer {
  return ({ row }) => {
    const value = row[accessor] as number;
    const isPositive = value >= 0;
    const span = document.createElement("span");
    Object.assign(span.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "3px",
      fontWeight: "600",
      fontSize: "13px",
      color: isPositive ? UP : DOWN,
    });
    span.textContent = `${isPositive ? "▲" : "▼"} ${formatSignedPercent(Math.abs(value))}`;
    return span;
  };
}

function assetRenderer(): CellRenderer {
  return ({ row }) => {
    const name = row.name as string;
    const symbol = row.symbol as string;
    const category = row.category as string;

    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "0",
    });

    const avatar = document.createElement("div");
    Object.assign(avatar.style, {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      background: "#e5e7eb",
      color: TEXT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "700",
      flexShrink: "0",
    });
    avatar.textContent = symbol.slice(0, 3);

    const meta = document.createElement("div");
    Object.assign(meta.style, {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      minWidth: "0",
    });

    const title = document.createElement("span");
    Object.assign(title.style, {
      fontWeight: "600",
      fontSize: "14px",
      color: TEXT,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    });
    title.appendChild(document.createTextNode(`${name} `));
    const sym = document.createElement("span");
    Object.assign(sym.style, { color: MUTED, fontWeight: "500" });
    sym.textContent = symbol;
    title.appendChild(sym);

    const pill = document.createElement("span");
    Object.assign(pill.style, {
      display: "inline-block",
      alignSelf: "flex-start",
      padding: "1px 6px",
      borderRadius: "999px",
      fontSize: "11px",
      color: MUTED,
      background: "#f3f4f6",
    });
    pill.textContent = category;

    meta.appendChild(title);
    meta.appendChild(pill);
    wrap.appendChild(avatar);
    wrap.appendChild(meta);
    return wrap;
  };
}

export function getCryptoHeaders(): ColumnDef[] {
  return [
    {
      accessor: "rank",
      label: "#",
      width: 56,
      align: "center",
      type: "number",
      pinned: "left",
      sortable: true,
      editable: false,
      cellRenderer: ({ row }) => {
        const span = document.createElement("span");
        Object.assign(span.style, { color: MUTED, fontWeight: "600" });
        span.textContent = String(row.rank as number);
        return span;
      },
    },
    {
      accessor: "asset",
      label: "Asset",
      width: 240,
      align: "left",
      type: "string",
      pinned: "left",
      sortable: true,
      editable: false,
      valueGetter: ({ row }) => row.name as string,
      cellRenderer: assetRenderer(),
    },
    {
      accessor: "price",
      label: "Price",
      width: 130,
      align: "right",
      type: "number",
      sortable: true,
      editable: false,
      cellRenderer: ({ row }) => {
        const span = document.createElement("span");
        Object.assign(span.style, {
          fontFamily: "ui-monospace, monospace",
          fontSize: "13px",
          color: TEXT,
        });
        span.textContent = formatPrice(row.price as number);
        return span;
      },
    },
    {
      accessor: "priceHistory",
      label: "Last 30d",
      width: 160,
      align: "center",
      type: "lineAreaChart",
      sortable: false,
      editable: false,
      filterable: false,
      tooltip: "Price trend over the last 30 intervals",
      chartOptions: {
        height: 36,
        strokeWidth: 2,
        fillOpacity: 0.18,
      },
    },
    {
      accessor: "performance",
      label: "Performance",
      width: 480,
      sortable: false,
      collapsible: true,
      children: [
        {
          accessor: "change24h",
          label: "24h %",
          width: 120,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "always",
          cellRenderer: changeRenderer("change24h"),
        },
        {
          accessor: "change1h",
          label: "1h %",
          width: 110,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: changeRenderer("change1h"),
        },
        {
          accessor: "change7d",
          label: "7d %",
          width: 110,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: changeRenderer("change7d"),
        },
        {
          accessor: "change30d",
          label: "30d %",
          width: 120,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: changeRenderer("change30d"),
        },
      ],
    },
    {
      accessor: "market",
      label: "Market",
      width: 560,
      sortable: false,
      collapsible: true,
      children: [
        {
          accessor: "marketCap",
          label: "Market Cap",
          width: 150,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "always",
          cellRenderer: ({ row }) => {
            const span = document.createElement("span");
            Object.assign(span.style, { fontSize: "13px", fontWeight: "600", color: TEXT });
            span.textContent = formatCompactUsd(row.marketCap as number);
            return span;
          },
        },
        {
          accessor: "volume24h",
          label: "Volume (24h)",
          width: 150,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: ({ row }) => {
            const span = document.createElement("span");
            Object.assign(span.style, { fontSize: "13px", color: MUTED });
            span.textContent = formatCompactUsd(row.volume24h as number);
            return span;
          },
        },
        {
          accessor: "supplyPercent",
          label: "Circulating Supply",
          width: 220,
          align: "left",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: ({ row }) => {
            const symbol = row.symbol as string;
            const circulating = row.circulatingSupply as number;
            const maxSupply = row.maxSupply as number | null;
            const percent = row.supplyPercent as number;
            const caption = maxSupply ? `${Math.round(percent)}% of max` : "No max supply";

            const wrap = document.createElement("div");
            wrap.style.width = "100%";

            const track = document.createElement("div");
            Object.assign(track.style, {
              height: "6px",
              borderRadius: "999px",
              background: "#e5e7eb",
              overflow: "hidden",
            });
            const fill = document.createElement("div");
            Object.assign(fill.style, {
              height: "100%",
              width: `${Math.min(100, Math.max(0, percent))}%`,
              background: "#2563eb",
              borderRadius: "999px",
            });
            track.appendChild(fill);

            const captionEl = document.createElement("span");
            Object.assign(captionEl.style, {
              display: "block",
              marginTop: "4px",
              fontSize: "11px",
              color: MUTED,
            });
            captionEl.textContent = `${caption} · ${Intl.NumberFormat(undefined, {
              notation: "compact",
            }).format(circulating)} ${symbol}`;

            wrap.appendChild(track);
            wrap.appendChild(captionEl);
            return wrap;
          },
        },
        {
          accessor: "athChangePercent",
          label: "From ATH",
          width: 120,
          align: "right",
          type: "number",
          sortable: true,
          editable: false,
          showWhen: "parentExpanded",
          cellRenderer: changeRenderer("athChangePercent"),
        },
      ],
    },
  ];
}
