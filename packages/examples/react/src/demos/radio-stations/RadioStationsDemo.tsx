import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  CellRendererProps,
  FooterRendererProps,
  HeaderRendererProps,
  ReactColumnDef,
  Row,
  Theme,
} from "@simple-table/react";
import {
  HEADER_HEIGHT,
  ROW_HEIGHT,
  formatNumber,
  radioStationRows,
  type RadioStationRow,
} from "./radio-stations.demo-data";
import "@simple-table/react/styles.css";

/**
 * Client-style radio stations grid (React).
 *
 * Window / external scroll mode (no height/maxHeight): the table grows to its
 * natural size and the page scroll parent drives virtualization. Matches
 * Chartmetric-like HTML: footer on top, custom theme, five left-pinned identity
 * columns, two equal main metric columns, ~3235 rows at 65px, React portals.
 */

const StationCell = ({ value }: CellRendererProps): ReactNode => {
  const name = String(value ?? "");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
        width: "100%",
      }}
    >
      <div
        aria-hidden
        style={{
          width: 40,
          height: 40,
          borderRadius: 4,
          background: "linear-gradient(135deg, #94a3b8, #64748b)",
          flexShrink: 0,
        }}
      />
      <a
        href="#"
        title={name}
        onClick={(e) => e.preventDefault()}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 500,
          color: "#1e293b",
          textDecoration: "none",
          minWidth: 0,
        }}
      >
        {name}
      </a>
    </div>
  );
};

const CountryCell = ({ value }: CellRendererProps): ReactNode => {
  const code = String(value ?? "US");
  return (
    <span
      title="United States"
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <span aria-hidden>🇺🇸</span>
      <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#2563eb" }}>
        {code}
      </a>
    </span>
  );
};

const HeaderWithMenu = ({ header }: HeaderRendererProps): ReactNode => {
  const label = header.label;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
        minWidth: 0,
        padding: "0 4px",
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: 13,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <button
        type="button"
        aria-label={`${label} column menu`}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#64748b",
          flexShrink: 0,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        ⋮
      </button>
    </div>
  );
};

function buildHeaders(): ReactColumnDef[] {
  const withMenu = (header: ReactColumnDef): ReactColumnDef => ({
    ...header,
    headerRenderer: HeaderWithMenu,
  });

  return [
    withMenu({
      accessor: "__index__",
      label: "#",
      width: 70,
      type: "number",
      align: "center",
      pinned: "left",
      sortable: false,
    }),
    withMenu({
      accessor: "name",
      label: "Station",
      width: 220,
      type: "string",
      align: "left",
      pinned: "left",
      sortable: true,
      cellRenderer: StationCell,
    }),
    withMenu({
      accessor: "genre",
      label: "Format",
      width: 150,
      type: "string",
      align: "left",
      pinned: "left",
      sortable: true,
    }),
    withMenu({
      accessor: "broadcast_area",
      label: "Broadcast Area",
      width: 160,
      type: "string",
      align: "left",
      pinned: "left",
      sortable: true,
    }),
    withMenu({
      accessor: "country",
      label: "Country",
      width: 328,
      type: "string",
      align: "left",
      pinned: "left",
      sortable: true,
      cellRenderer: CountryCell,
    }),
    withMenu({
      accessor: "wikipedia_views",
      label: "Views",
      width: "1fr",
      minWidth: 120,
      type: "number",
      align: "right",
      sortable: true,
      valueFormatter: ({ value }) => formatNumber(value),
    }),
    withMenu({
      accessor: "aqh",
      label: "AQH",
      width: "1fr",
      minWidth: 120,
      type: "number",
      align: "right",
      sortable: true,
      valueFormatter: ({ value }) => formatNumber(value),
    }),
  ];
}

const RadioStationsDemo = ({
  theme = "custom",
}: {
  // height intentionally unused — window/external scroll requires no height/maxHeight
  height?: string | number;
  theme?: Theme;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [headers, setHeaders] = useState<ReactColumnDef[]>(() => buildHeaders());

  const rows = useMemo(() => radioStationRows as unknown as Row[], []);

  // Merge widths onto the React header definitions. Core's callback returns
  // vanilla-wrapped renderers; putting those into React state and back through
  // buildVanillaConfig can nest wraps. Width-only merge keeps React components.
  const handleColumnWidthChange = useCallback((next: ReactColumnDef[]) => {
    const widthByAccessor = new Map(next.map((h) => [h.accessor, h.width]));
    setHeaders((prev) =>
      prev.map((h) => {
        const width = widthByAccessor.get(h.accessor);
        return width !== undefined && width !== h.width ? { ...h, width } : h;
      }),
    );
  }, []);

  const renderFooter = useCallback(({ totalRows }: FooterRendererProps) => {
    const wrapStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      minHeight: 49,
      boxSizing: "border-box",
      borderBottom: "1px solid #e2e8f0",
      background: "#f8fafc",
      fontSize: 13,
      color: "#475569",
    };
    return (
      <div style={wrapStyle}>
        <span>{totalRows.toLocaleString("en-US")} radio stations</span>
        <span>Radio stations</span>
      </div>
    );
  }, []);

  return (
    <div ref={wrapperRef} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 0.75rem" }}>Radio Stations</h2>
      <p style={{ margin: "0 0 1rem", color: "#64748b", fontSize: 14, lineHeight: 1.5 }}>
        Window-style external scroll (no table height): the outer page scroll drives
        virtualization. React cell/header renderers + controlled headers. Drag a column edge to
        compare resize lag with the vanilla Storybook example.
      </p>

      <SimpleTable
        columns={headers}
        rows={rows}
        getRowId={(p) => String((p.row as unknown as RadioStationRow | undefined)?.id)}
        theme={theme}
        customTheme={{ rowHeight: ROW_HEIGHT, headerHeight: HEADER_HEIGHT }}
        columnReordering
        columnResizing
        autoExpandColumns
        enableColumnEditor
        columnEditorConfig={{
          text: "All Columns",
          searchEnabled: true,
          searchPlaceholder: "Search columns",
        }}
        footerPosition="top"
        footerRenderer={renderFooter}
        enablePagination={false}
        initialSortColumn="aqh"
        initialSortDirection="desc"
        // Examples shell scrolls `.examples-content`, not `window`. In a real app
        // page this would typically be `scrollParent="window"`.
        scrollParent={() => wrapperRef.current?.parentElement ?? null}
        onColumnWidthChange={handleColumnWidthChange}
      />
    </div>
  );
};

export default RadioStationsDemo;
