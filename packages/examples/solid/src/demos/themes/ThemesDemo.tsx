import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { themesConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ThemesDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={themesConfig.headers}
      rows={themesConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
