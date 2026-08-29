"use client";

import type {
  ReactColumnDef,
  CellRendererProps,
  ValueGetterProps,
} from "@simple-table/react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Avatar,
  CompactIdentity,
  Pill,
  ProgressBar,
  getThemeColors,
  formatCompactUsd,
  formatMobilePrice,
  formatPrice,
  formatSignedPercent,
} from "../_shared";
import type { CryptoCoin } from "./useCryptoData";

/** Right-aligned, color-coded percentage change. */
const ChangeCell = (accessor: keyof CryptoCoin) => {
  function ChangeCellRenderer({ row, theme }: CellRendererProps<CryptoCoin>) {
    const isMobile = useIsMobile();
    const value = row[accessor] as number;
    const c = getThemeColors(theme);
    const isPositive = value >= 0;
    if (isMobile) {
      return (
        <span
          style={{
            fontWeight: 600,
            fontSize: "13px",
            color: isPositive ? c.up : c.down,
          }}
        >
          {formatSignedPercent(value, 1)}
        </span>
      );
    }
    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "3px",
          fontWeight: 600,
          fontSize: "13px",
          color: isPositive ? c.up : c.down,
        }}
      >
        {isPositive ? "\u25B2" : "\u25BC"} {formatSignedPercent(Math.abs(value))}
      </span>
    );
  }
  ChangeCellRenderer.displayName = `ChangeCell(${String(accessor)})`;
  return ChangeCellRenderer;
};

function AssetCell({ row, theme }: CellRendererProps<CryptoCoin>) {
  const isMobile = useIsMobile();
  const c = getThemeColors(theme);
  const name = row.name as string;
  const symbol = row.symbol as string;
  const category = row.category as string;
  if (isMobile) {
    return (
      <CompactIdentity
        seed={symbol}
        label={symbol}
        text={symbol}
        theme={theme}
        title={`${name} ${symbol}`}
      />
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar seed={symbol} label={symbol} size={34} />
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: c.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name} <span style={{ color: c.muted, fontWeight: 500 }}>{symbol}</span>
        </span>
        <Pill color="neutral" theme={theme}>
          {category}
        </Pill>
      </div>
    </div>
  );
}

function PriceCell({ row, theme }: CellRendererProps<CryptoCoin>) {
  const isMobile = useIsMobile();
  const c = getThemeColors(theme);
  const price = row.price as number;
  return (
    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "13px", color: c.text }}>
      {isMobile ? formatMobilePrice(price) : formatPrice(price)}
    </span>
  );
}

export const MOBILE_VISIBLE_ACCESSORS = ["asset", "price", "change24h"] as const;

export const MOBILE_COLUMN_OPTIONS = {
  maxPinned: 0,
  identityAccessors: ["asset"],
} as const;

export const HEADERS: ReactColumnDef<CryptoCoin>[] = [
  {
    accessor: "rank",
    label: "#",
    width: "auto",
    align: "center",
    type: "number",
    pinned: "left",
    sortable: true,
    editable: false,
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const c = getThemeColors(theme);
      return <span style={{ color: c.muted, fontWeight: 600 }}>{row.rank as number}</span>;
    },
  },
  {
    accessor: "asset",
    label: "Asset",
    width: "auto",
    align: "left",
    type: "string",
    pinned: "left",
    sortable: true,
    editable: false,
    // Sort/filter the synthetic "asset" column by the coin name.
    valueGetter: ({ row }: ValueGetterProps) => row.name as string,
    cellRenderer: AssetCell,
  },
  {
    accessor: "price",
    label: "Price",
    width: "auto",
    align: "right",
    type: "number",
    sortable: true,
    editable: false,
    cellRenderer: PriceCell,
  },
  {
    accessor: "priceHistory",
    label: "Last 30d",
    width: "auto",
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
    width: "auto",
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "change24h",
        label: "24h %",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "always",
        cellRenderer: ChangeCell("change24h"),
      },
      {
        accessor: "change1h",
        label: "1h %",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ChangeCell("change1h"),
      },
      {
        accessor: "change7d",
        label: "7d %",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ChangeCell("change7d"),
      },
      {
        accessor: "change30d",
        label: "30d %",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ChangeCell("change30d"),
      },
    ],
  },
  {
    accessor: "market",
    label: "Market",
    width: "auto",
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "marketCap",
        label: "Market Cap",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "always",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const c = getThemeColors(theme);
          return (
            <span style={{ fontSize: "13px", fontWeight: 600, color: c.text }}>
              {formatCompactUsd(row.marketCap as number)}
            </span>
          );
        },
      },
      {
        accessor: "volume24h",
        label: "Volume (24h)",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const c = getThemeColors(theme);
          return (
            <span style={{ fontSize: "13px", color: c.muted }}>
              {formatCompactUsd(row.volume24h as number)}
            </span>
          );
        },
      },
      {
        accessor: "supplyPercent",
        label: "Circulating Supply",
        width: "auto",
        align: "left",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const symbol = row.symbol as string;
          const circulating = row.circulatingSupply as number;
          const maxSupply = row.maxSupply as number | null;
          const percent = row.supplyPercent as number;
          const caption = maxSupply
            ? `${Math.round(percent)}% of max`
            : "No max supply";
          return (
            <div style={{ width: "100%" }}>
              <ProgressBar percent={percent} theme={theme} caption={caption} />
              <span
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "11px",
                  color: getThemeColors(theme).muted,
                }}
              >
                {Intl.NumberFormat(undefined, { notation: "compact" }).format(circulating)} {symbol}
              </span>
            </div>
          );
        },
      },
      {
        accessor: "athChangePercent",
        label: "From ATH",
        width: "auto",
        align: "right",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: ChangeCell("athChangePercent"),
      },
    ],
  },
];
