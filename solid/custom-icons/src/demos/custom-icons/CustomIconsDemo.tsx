import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { customIconsConfig } from "./custom-icons.demo-data";
import "@simple-table/solid/styles.css";

const customIcons = {
  sortUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  sortDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  ),
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 4h18l-7 8.5V18l-4 2V12.5L3 4z" />
    </svg>
  ),
  expand: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  next: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  prev: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  ),
};

export default function CustomIconsDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={customIconsConfig.headers}
      rows={customIconsConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      icons={customIcons}
    />
  );
}
