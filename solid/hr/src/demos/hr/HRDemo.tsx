import { createSignal } from "solid-js";
import { SimpleTable, mapToSolidHeaderObjects } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, CellChangeProps, CellRendererProps } from "@simple-table/solid";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
import type { HREmployee, HRTagColorKey } from "./hr.demo-data";
import "@simple-table/solid/styles.css";

function getHeaders(): SolidHeaderObject[] {
  return mapToSolidHeaderObjects(
    hrConfig.headers.map((h) => {
      if (h.accessor === "fullName") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            const c = getHRThemeColors(theme);
            const initials = `${d.firstName?.charAt(0) || ""}${d.lastName?.charAt(0) || ""}`;
            return (
              <div style={{ display: "flex", "align-items": "center" }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    "border-radius": "50%",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "background-color": c.avatarBg,
                    color: c.avatarText,
                    "font-size": "12px",
                  }}
                >
                  {initials}
                </div>
                <div style={{ "margin-left": "8px" }}>
                  <div>{d.fullName}</div>
                  <div style={{ "font-size": "12px", color: c.grayMuted }}>{d.position}</div>
                </div>
              </div>
            );
          },
        };
      }
      if (h.accessor === "performanceScore") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            const c = getHRThemeColors(theme);
            const color =
              d.performanceScore >= 90
                ? c.progressSuccess
                : d.performanceScore >= 65
                  ? c.progressNormal
                  : c.progressException;
            return (
              <div style={{ width: "100%", display: "flex", "flex-direction": "column" }}>
                <div
                  style={{
                    "background-color": c.progressBg,
                    height: "6px",
                    width: "100%",
                    "border-radius": "100px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.performanceScore}%`,
                      "background-color": color,
                      "border-radius": "100px",
                    }}
                  />
                </div>
                <div
                  style={{
                    "font-size": "12px",
                    "text-align": "center",
                    "margin-top": "4px",
                    color: c.gray,
                  }}
                >
                  {d.performanceScore}/100
                </div>
              </div>
            );
          },
        };
      }
      if (h.accessor === "hireDate") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            if (!d.hireDate) return "";
            const [year, month, day] = d.hireDate.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            const c = getHRThemeColors(theme);
            return (
              <span style={{ color: c.gray }}>
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            );
          },
        };
      }
      if (h.accessor === "yearsOfService") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            if (d.yearsOfService === null) return "";
            const c = getHRThemeColors(theme);
            return <span style={{ color: c.gray }}>{`${d.yearsOfService} yrs`}</span>;
          },
        };
      }
      if (h.accessor === "salary") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            const c = getHRThemeColors(theme);
            return <span style={{ color: c.gray }}>{`$${d.salary.toLocaleString()}`}</span>;
          },
        };
      }
      if (h.accessor === "status") {
        return {
          ...h,
          cellRenderer: ({ row, theme }: CellRendererProps) => {
            const d = row as unknown as HREmployee;
            if (!d.status) return "";
            const c = getHRThemeColors(theme);
            const colorKey: HRTagColorKey = HR_STATUS_COLOR_MAP[d.status] || "default";
            const tagColors = c.tagColors[colorKey] || c.tagColors.default;
            return (
              <span
                style={{
                  "background-color": tagColors.bg,
                  color: tagColors.text,
                  padding: "0 7px",
                  "font-size": "12px",
                  "line-height": "20px",
                  "border-radius": "2px",
                  display: "inline-block",
                }}
              >
                {d.status}
              </span>
            );
          },
        };
      }
      return h;
    }),
  );
}

export default function HRDemo(props: { height?: string | number; theme?: Theme }) {
  const [data, setData] = createSignal([...hrConfig.rows]);
  const rowHeight = 48;
  const heightNum = () => (typeof props.height === "number" ? props.height : 400);
  const howManyRowsCanFit = () => Math.floor(heightNum() / rowHeight);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)),
    );
  };

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={getHeaders()}
      onCellEdit={handleCellEdit}
      customTheme={{ rowHeight }}
      rows={data()}
      rowsPerPage={howManyRowsCanFit()}
      selectableCells
      shouldPaginate
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
