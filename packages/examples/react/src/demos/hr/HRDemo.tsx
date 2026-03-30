import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject } from "@simple-table/react";
import type { CellChangeProps } from "simple-table-core";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "@simple-table/examples-shared";
import type { HREmployee } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

function getHeaders(): ReactHeaderObject[] {
  return hrConfig.headers.map((h) => {
    if (h.accessor === "fullName") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          const c = getHRThemeColors(theme);
          const initials = `${d.firstName.charAt(0)}${d.lastName.charAt(0)}`;
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: c.avatarBg, color: c.avatarText, fontSize: "12px" }}>
                {initials}
              </div>
              <div style={{ marginLeft: "8px" }}>
                <div>{d.fullName}</div>
                <div style={{ fontSize: "12px", color: c.grayMuted }}>{d.position}</div>
              </div>
            </div>
          );
        },
      };
    }
    if (h.accessor === "performanceScore") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          const c = getHRThemeColors(theme);
          const color = d.performanceScore >= 90 ? c.progressSuccess : d.performanceScore >= 65 ? c.progressNormal : c.progressException;
          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ backgroundColor: c.progressBg, height: "6px", width: "100%", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.performanceScore}%`, backgroundColor: color, borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px", color: c.gray }}>{d.performanceScore}/100</div>
            </div>
          );
        },
      };
    }
    if (h.accessor === "hireDate") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          if (!d.hireDate) return "";
          const [year, month, day] = d.hireDate.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          const c = getHRThemeColors(theme);
          return <span style={{ color: c.gray }}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>;
        },
      };
    }
    if (h.accessor === "yearsOfService") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          const c = getHRThemeColors(theme);
          return <span style={{ color: c.gray }}>{`${d.yearsOfService} yrs`}</span>;
        },
      };
    }
    if (h.accessor === "salary") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          const c = getHRThemeColors(theme);
          return <span style={{ color: c.gray }}>{`$${d.salary.toLocaleString()}`}</span>;
        },
      };
    }
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as HREmployee;
          if (!d.status) return "";
          const c = getHRThemeColors(theme);
          const colorKey = HR_STATUS_COLOR_MAP[d.status] || "default";
          const tagColors = c.tagColors[colorKey];
          return <span style={{ backgroundColor: tagColors.bg, color: tagColors.text, padding: "0 7px", fontSize: "12px", lineHeight: "20px", borderRadius: "2px", display: "inline-block" }}>{d.status}</span>;
        },
      };
    }
    return h;
  });
}

const HRDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const [data, setData] = useState([...hrConfig.rows]);
  const rowHeight = 48;
  const heightNum = typeof height === "number" ? height : 400;
  const howManyRowsCanFit = Math.floor(heightNum / rowHeight);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) => prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)));
  };

  return (
    <SimpleTable columnReordering columnResizing defaultHeaders={getHeaders()} onCellEdit={handleCellEdit} customTheme={{ rowHeight }} rows={data} rowsPerPage={howManyRowsCanFit} selectableCells shouldPaginate height={height} theme={theme} />
  );
};

export default HRDemo;
