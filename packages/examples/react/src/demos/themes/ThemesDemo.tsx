import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { themesConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ThemesDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={themesConfig.headers}
      rows={themesConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ThemesDemo;
