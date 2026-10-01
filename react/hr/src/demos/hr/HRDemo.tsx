import { useMemo, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  Theme,
  CellChangeProps,
  ReactColumnDef
} from "@simple-table/react";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";
import "@simple-table/react/styles.css";

function getHeaders(): ReactColumnDef<HREmployee>[] {
  return hrConfig.headers.map((h) => {
    if (h.accessor === "fullName") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          const c = getHRThemeColors(theme);
          const initials = `${row.firstName.charAt(0)}${row.lastName.charAt(0)}`;
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: c.avatarBg,
                  color: c.avatarText,
                  fontSize: "12px"
                }}
              >
                {initials}
              </div>
              <div style={{ marginLeft: "8px" }}>
                <div>{row.fullName}</div>
                <div style={{ fontSize: "12px", color: c.grayMuted }}>{row.position}</div>
              </div>
            </div>
          );
        }
      };
    }
    if (h.accessor === "performanceScore") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          const c = getHRThemeColors(theme);
          const color =
            row.performanceScore >= 90
              ? c.progressSuccess
              : row.performanceScore >= 65
                ? c.progressNormal
                : c.progressException;
          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  backgroundColor: c.progressBg,
                  height: "6px",
                  width: "100%",
                  borderRadius: "100px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${row.performanceScore}%`,
                    backgroundColor: color,
                    borderRadius: "100px"
                  }}
                />
              </div>
              <div
                style={{ fontSize: "12px", textAlign: "center", marginTop: "4px", color: c.gray }}
              >
                {row.performanceScore}/100
              </div>
            </div>
          );
        }
      };
    }
    if (h.accessor === "hireDate") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          if (!row.hireDate) return "";
          const [year, month, day] = row.hireDate.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          const c = getHRThemeColors(theme);
          return (
            <span style={{ color: c.gray }}>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          );
        }
      };
    }
    if (h.accessor === "yearsOfService") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          const c = getHRThemeColors(theme);
          return <span style={{ color: c.gray }}>{`${row.yearsOfService} yrs`}</span>;
        }
      };
    }
    if (h.accessor === "salary") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          const c = getHRThemeColors(theme);
          return <span style={{ color: c.gray }}>{`$${row.salary.toLocaleString()}`}</span>;
        }
      };
    }
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          if (!row.status) return "";
          const c = getHRThemeColors(theme);
          const colorKey = HR_STATUS_COLOR_MAP[row.status] || "default";
          const tagColors = c.tagColors[colorKey];
          return (
            <span
              style={{
                backgroundColor: tagColors.bg,
                color: tagColors.text,
                padding: "0 7px",
                fontSize: "12px",
                lineHeight: "20px",
                borderRadius: "2px",
                display: "inline-block"
              }}
            >
              {row.status}
            </span>
          );
        }
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

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps<HREmployee>) => {
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)),
    );
  };

  const headers = useMemo(() => getHeaders(), []);

  return (
    <SimpleTable
      autoExpandColumns
      columnReordering
      columnResizing
      columns={headers}
      getRowId={({ row }) => row.id}
      onCellEdit={handleCellEdit}
      customTheme={{ rowHeight }}
      rows={data}
      rowsPerPage={howManyRowsCanFit}
      selectableCells
      enablePagination
      height={height}
      theme={theme}
    />
  );
};

export default HRDemo;
