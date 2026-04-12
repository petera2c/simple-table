import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { customIconsConfig } from "./custom-icons.demo-data";
import "@simple-table/react/styles.css";

const customIcons: ReactIconsConfig = {
  sortUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  sortDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  ),
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h18l-7 8.5V18l-4 2V12.5L3 4z" />
    </svg>
  ),
  expand: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  next: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  prev: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  ),
};

const CustomIconsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(customIconsConfig.headers)}
      rows={customIconsConfig.rows}
      icons={customIcons}
      height={height}
      theme={theme}
    />
  );
};

export default CustomIconsDemo;
