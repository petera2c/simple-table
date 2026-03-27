import { useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, HeaderRendererProps, CellRendererProps } from "@simple-table/react";
import { tooltipConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const TooltipDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const headers: ReactHeaderObject[] = useMemo(
    () =>
      tooltipConfig.headers.map((h) => ({
        ...h,
        headerRenderer: ({ header }: HeaderRendererProps) => (
          <div title={header.tooltip ?? header.label} style={{ cursor: "help" }}>
            {header.label}
          </div>
        ),
        cellRenderer:
          h.accessor === "change"
            ? ({ value }: CellRendererProps) => {
                const n = Number(value);
                const color = n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : "#6b7280";
                const formatted = `${n > 0 ? "+" : ""}${n}%`;
                return (
                  <span title={`Change: ${formatted}`} style={{ color, fontWeight: 600, cursor: "help" }}>
                    {formatted}
                  </span>
                );
              }
            : h.accessor === "value"
              ? ({ value }: CellRendererProps) => (
                  <span title={`Raw value: ${value}`} style={{ cursor: "help" }}>
                    {Number(value).toLocaleString()}
                  </span>
                )
              : undefined,
      })),
    [],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={tooltipConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default TooltipDemo;
