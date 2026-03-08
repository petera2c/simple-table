import React, { useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { SimpleTableVanilla } from "../core/SimpleTableVanilla";
import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import FooterRendererProps from "../types/FooterRendererProps";
import HeaderObject from "../types/HeaderObject";
import { HeaderRenderer } from "../types/HeaderRendererProps";

export interface SimpleTableReactProps extends Omit<
  SimpleTableConfig,
  | "footerRenderer"
  | "headerDropdown"
  | "icons"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
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
  const reactRootsRef = useRef<Map<string, any>>(new Map());
  const isFirstUpdateEffectRef = useRef<boolean>(true);
  const { tableRef } = props;

  // Wrap headerRenderer functions to convert React elements to DOM elements
  const wrapHeaderRenderers = useCallback((headers: HeaderObject[]): HeaderObject[] => {
    return headers.map((header) => {
      if (header.headerRenderer) {
        const originalRenderer = header.headerRenderer;
        const wrappedRenderer: HeaderRenderer = (props) => {
          const reactElement = originalRenderer(props);

          // Check if it's already a DOM element
          if (reactElement instanceof HTMLElement) {
            return reactElement;
          }

          // Create a container and render the React element into it
          const container = document.createElement("div");
          container.className = "st-header-renderer-container";

          // Create a React root and render
          const key = `${header.accessor}-${props.colIndex}`;
          const root = createRoot(container);
          root.render(reactElement);

          // Store the root for cleanup
          reactRootsRef.current.set(key, root);

          return container;
        };

        return {
          ...header,
          headerRenderer: wrappedRenderer,
          children: header.children ? wrapHeaderRenderers(header.children) : undefined,
        };
      }

      return {
        ...header,
        children: header.children ? wrapHeaderRenderers(header.children) : undefined,
      };
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const test = reactRootsRef.current;

    const { tableRef: _, defaultHeaders, ...restConfig } = props;

    // Wrap header renderers to handle React elements
    const wrappedHeaders = defaultHeaders ? wrapHeaderRenderers(defaultHeaders) : undefined;

    const vanillaConfig: SimpleTableConfig = {
      ...restConfig,
      defaultHeaders: wrappedHeaders,
    } as SimpleTableConfig;

    const table = new SimpleTableVanilla(containerRef.current, vanillaConfig);
    table.mount();
    tableInstanceRef.current = table;

    if (tableRef) {
      tableRef.current = table.getAPI();
    }

    return () => {
      // Cleanup React roots
      test.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // Ignore errors during unmount
        }
      });
      test.clear();

      table.destroy();
      tableInstanceRef.current = null;
      isFirstUpdateEffectRef.current = true;
      if (tableRef) {
        tableRef.current = null;
      }
    };
  }, [props, tableRef, wrapHeaderRenderers]);

  useEffect(() => {
    if (isFirstUpdateEffectRef.current) {
      isFirstUpdateEffectRef.current = false;
      return;
    }

    if (!tableInstanceRef.current) return;

    const { tableRef, defaultHeaders, ...restConfig } = props;

    // Wrap header renderers for updates too
    const wrappedHeaders = defaultHeaders ? wrapHeaderRenderers(defaultHeaders) : undefined;

    const vanillaConfig = {
      ...restConfig,
      defaultHeaders: wrappedHeaders,
    };

    tableInstanceRef.current.update(vanillaConfig as SimpleTableConfig);
  }, [props, wrapHeaderRenderers]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
