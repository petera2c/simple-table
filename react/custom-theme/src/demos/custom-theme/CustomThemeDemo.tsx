import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { customThemeConfig } from "./custom-theme.demo-data";
import "@simple-table/react/styles.css";
import "./custom-theme.css";

const CustomThemeDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(customThemeConfig.headers)}
      rows={customThemeConfig.rows}
      theme={theme ?? "custom"}
      customTheme={customThemeConfig.tableProps.customTheme}
      columnResizing
      selectableCells
      height={height}
    />
  );
};

export default CustomThemeDemo;
