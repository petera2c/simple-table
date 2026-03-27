import { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnWidthConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnWidthDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnResizing
      defaultHeaders={columnWidthConfig.headers}
      height={height}
      rows={columnWidthConfig.rows}
      theme={theme}
    />
  );
};

export default ColumnWidthDemo;
