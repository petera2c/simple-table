import type { ComponentType } from "react";
import type { Theme } from "simple-table-react";

export interface DemoProps {
  height?: string | number;
  theme?: Theme;
}

type DemoRegistry = Record<string, () => Promise<{ default: ComponentType<DemoProps> }>>;

export const registry: DemoRegistry = {
  "quick-start": () => import("./demos/quick-start/QuickStartDemo"),
  "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo"),
  "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo"),
  "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo"),
  "pagination": () => import("./demos/pagination/PaginationDemo"),
};
