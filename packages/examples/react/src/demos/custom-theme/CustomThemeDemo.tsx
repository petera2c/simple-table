import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "../../../../shared/src/styles/custom-theme.css";

const CustomThemeDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={customThemeConfig.headers}
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
