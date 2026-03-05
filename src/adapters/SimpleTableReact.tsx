import React, { useEffect, useRef } from "react";
import { SimpleTableVanilla } from "../core/SimpleTableVanilla";
import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import FooterRendererProps from "../types/FooterRendererProps";

export interface SimpleTableReactProps extends Omit<
  SimpleTableConfig,
  | "footerRenderer"
  | "headerDropdown"
  | "icons"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
  | "tableRef"
> {
  footerRenderer?: (props: FooterRendererProps) => React.ReactNode;
  headerDropdown?: (props: any) => React.ReactNode;
  icons?: {
    drag?: React.ReactNode;
    expand?: React.ReactNode;
    filter?: React.ReactNode;
    headerCollapse?: React.ReactNode;
    headerExpand?: React.ReactNode;
    next?: React.ReactNode;
    prev?: React.ReactNode;
    sortDown?: React.ReactNode;
    sortUp?: React.ReactNode;
  };
  loadingStateRenderer?: React.ReactNode;
  errorStateRenderer?: React.ReactNode;
  emptyStateRenderer?: React.ReactNode;
  tableEmptyStateRenderer?: React.ReactNode;
  tableRef?: React.MutableRefObject<TableAPI | null>;
}

export const SimpleTableReact: React.FC<SimpleTableReactProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableInstanceRef = useRef<SimpleTableVanilla | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { tableRef, ...vanillaConfig } = props;

    const table = new SimpleTableVanilla(containerRef.current, vanillaConfig as SimpleTableConfig);
    table.mount();
    tableInstanceRef.current = table;

    if (tableRef) {
      tableRef.current = table.getAPI();
    }

    return () => {
      table.destroy();
      tableInstanceRef.current = null;
      if (tableRef) {
        tableRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (tableInstanceRef.current) {
      const { tableRef, ...vanillaConfig } = props;
      tableInstanceRef.current.update(vanillaConfig as any);
    }
  }, [props]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
