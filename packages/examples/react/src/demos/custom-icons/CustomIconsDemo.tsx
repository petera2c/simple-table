import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { customIconsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const SortUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const SortDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
    <path d="M3 4h18l-7 8.5V18l-4 2V12.5L3 4z" />
  </svg>
);

const customIcons: ReactIconsConfig = {
  sortUp: <SortUpIcon />,
  sortDown: <SortDownIcon />,
  filter: <FilterIcon />,
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
      defaultHeaders={customIconsConfig.headers}
      rows={customIconsConfig.rows}
      icons={customIcons}
      height={height}
      theme={theme}
    />
  );
};

export default CustomIconsDemo;
