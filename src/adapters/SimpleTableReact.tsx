import React, { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { SimpleTableVanilla } from "../core/SimpleTableVanilla";
import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import FooterRendererProps from "../types/FooterRendererProps";

export interface SimpleTableReactProps extends Omit<SimpleTableConfig, 
  'footerRenderer' | 
  'headerDropdown' | 
  'icons' | 
  'loadingStateRenderer' | 
  'errorStateRenderer' | 
  'emptyStateRenderer' | 
  'tableEmptyStateRenderer'
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

const convertReactNodeToElement = (node: React.ReactNode): HTMLElement | string => {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(node as React.ReactElement);
  
  return container;
};

export const SimpleTableReact: React.FC<SimpleTableReactProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableInstanceRef = useRef<SimpleTableVanilla | null>(null);
  const rootsRef = useRef<Map<HTMLElement, Root>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const vanillaConfig: SimpleTableConfig = {
      ...props as any,
      footerRenderer: props.footerRenderer 
        ? (footerProps) => {
            const container = document.createElement('div');
            const root = createRoot(container);
            rootsRef.current.set(container, root);
            root.render(props.footerRenderer!(footerProps) as React.ReactElement);
            return container;
          }
        : undefined,
      headerDropdown: props.headerDropdown
        ? (dropdownProps) => {
            const container = document.createElement('div');
            const root = createRoot(container);
            rootsRef.current.set(container, root);
            root.render(props.headerDropdown!(dropdownProps) as React.ReactElement);
            return container;
          }
        : undefined,
      icons: props.icons
        ? {
            drag: props.icons.drag ? convertReactNodeToElement(props.icons.drag) : undefined,
            expand: props.icons.expand ? convertReactNodeToElement(props.icons.expand) : undefined,
            filter: props.icons.filter ? convertReactNodeToElement(props.icons.filter) : undefined,
            headerCollapse: props.icons.headerCollapse ? convertReactNodeToElement(props.icons.headerCollapse) : undefined,
            headerExpand: props.icons.headerExpand ? convertReactNodeToElement(props.icons.headerExpand) : undefined,
            next: props.icons.next ? convertReactNodeToElement(props.icons.next) : undefined,
            prev: props.icons.prev ? convertReactNodeToElement(props.icons.prev) : undefined,
            sortDown: props.icons.sortDown ? convertReactNodeToElement(props.icons.sortDown) : undefined,
            sortUp: props.icons.sortUp ? convertReactNodeToElement(props.icons.sortUp) : undefined,
          }
        : undefined,
      loadingStateRenderer: props.loadingStateRenderer 
        ? convertReactNodeToElement(props.loadingStateRenderer)
        : undefined,
      errorStateRenderer: props.errorStateRenderer
        ? convertReactNodeToElement(props.errorStateRenderer)
        : undefined,
      emptyStateRenderer: props.emptyStateRenderer
        ? convertReactNodeToElement(props.emptyStateRenderer)
        : undefined,
      tableEmptyStateRenderer: props.tableEmptyStateRenderer
        ? convertReactNodeToElement(props.tableEmptyStateRenderer)
        : undefined,
    };

    const table = new SimpleTableVanilla(containerRef.current, vanillaConfig);
    table.mount();
    tableInstanceRef.current = table;

    if (props.tableRef) {
      props.tableRef.current = table.getAPI();
    }

    return () => {
      rootsRef.current.forEach((root) => {
        root.unmount();
      });
      rootsRef.current.clear();
      table.destroy();
      tableInstanceRef.current = null;
      if (props.tableRef) {
        props.tableRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (tableInstanceRef.current) {
      tableInstanceRef.current.update(props as any);
    }
  }, [props]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
