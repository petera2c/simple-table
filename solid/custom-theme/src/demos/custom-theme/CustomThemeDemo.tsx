import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { customThemeConfig } from "./custom-theme.demo-data";
import "@simple-table/solid/styles.css";
import "./custom-theme.css";

export default function CustomThemeDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={customThemeConfig.headers}
      rows={customThemeConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme ?? "custom"}
      customTheme={customThemeConfig.tableProps.customTheme}
      columnResizing
      selectableCells
    />
  );
}
