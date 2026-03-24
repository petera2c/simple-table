import HeaderObject, { Accessor } from "../types/HeaderObject";
import { ColumnVisibilityState } from "../types/ColumnVisibilityTypes";
import { Pinned } from "../types/Pinned";

export interface ColumnManagerConfig {
  headers: HeaderObject[];
  collapsedHeaders: Set<Accessor>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
}

export interface ColumnManagerState {
  headers: HeaderObject[];
  collapsedHeaders: Set<Accessor>;
  columnVisibility: ColumnVisibilityState;
  draggedHeader: HeaderObject | null;
  hoveredHeader: HeaderObject | null;
}

type StateChangeCallback = (state: ColumnManagerState) => void;

export class ColumnManager {
  private config: ColumnManagerConfig;
  private state: ColumnManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();

  constructor(config: ColumnManagerConfig) {
    this.config = config;
    
    const columnVisibility = this.buildColumnVisibilityState(config.headers);
    
    this.state = {
      headers: config.headers,
      collapsedHeaders: config.collapsedHeaders,
      columnVisibility,
      draggedHeader: null,
      hoveredHeader: null,
    };
  }

  private buildColumnVisibilityState(headers: HeaderObject[]): ColumnVisibilityState {
    const visibility: ColumnVisibilityState = {};
    
    const processHeaders = (headers: HeaderObject[]) => {
      headers.forEach((header) => {
        visibility[header.accessor] = !header.hide;
        if (header.children && header.children.length > 0) {
          processHeaders(header.children);
        }
      });
    };
    
    processHeaders(headers);
    return visibility;
  }

  updateConfig(config: Partial<ColumnManagerConfig>): void {
    const oldHeaders = this.config.headers;
    this.config = { ...this.config, ...config };
    
    if (config.headers && config.headers !== oldHeaders) {
      const columnVisibility = this.buildColumnVisibilityState(config.headers);
      this.state = {
        ...this.state,
        headers: config.headers,
        columnVisibility,
      };
      this.notifySubscribers();
    }
    
    if (config.collapsedHeaders) {
      this.state = {
        ...this.state,
        collapsedHeaders: config.collapsedHeaders,
      };
      this.notifySubscribers();
    }
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  setHeaders(headers: HeaderObject[]): void {
    this.state.headers = headers;
    const columnVisibility = this.buildColumnVisibilityState(headers);
    this.state.columnVisibility = columnVisibility;
    this.config.onColumnOrderChange?.(headers);
    this.notifySubscribers();
  }

  setCollapsedHeaders(collapsedHeaders: Set<Accessor>): void {
    this.state.collapsedHeaders = collapsedHeaders;
    this.notifySubscribers();
  }

  toggleColumnCollapse(accessor: Accessor): void {
    const newCollapsedHeaders = new Set(this.state.collapsedHeaders);
    if (newCollapsedHeaders.has(accessor)) {
      newCollapsedHeaders.delete(accessor);
    } else {
      newCollapsedHeaders.add(accessor);
    }
    this.setCollapsedHeaders(newCollapsedHeaders);
  }

  setColumnVisibility(accessor: Accessor, visible: boolean): void {
    const newVisibility = {
      ...this.state.columnVisibility,
      [accessor]: visible,
    };
    
    this.state.columnVisibility = newVisibility;
    this.config.onColumnVisibilityChange?.(newVisibility);
    this.notifySubscribers();
  }

  updateColumnWidth(accessor: Accessor, width: number | string): void {
    const updateHeaderWidth = (headers: HeaderObject[]): HeaderObject[] => {
      return headers.map((header) => {
        if (header.accessor === accessor) {
          return { ...header, width };
        }
        if (header.children && header.children.length > 0) {
          return {
            ...header,
            children: updateHeaderWidth(header.children),
          };
        }
        return header;
      });
    };

    const newHeaders = updateHeaderWidth(this.state.headers);
    this.state.headers = newHeaders;
    this.config.onColumnWidthChange?.(newHeaders);
    this.notifySubscribers();
  }

  reorderColumns(newHeaders: HeaderObject[]): void {
    this.setHeaders(newHeaders);
  }

  setDraggedHeader(header: HeaderObject | null): void {
    this.state.draggedHeader = header;
    this.notifySubscribers();
  }

  setHoveredHeader(header: HeaderObject | null): void {
    this.state.hoveredHeader = header;
    this.notifySubscribers();
  }

  getState(): ColumnManagerState {
    return this.state;
  }

  getHeaders(): HeaderObject[] {
    return this.state.headers;
  }

  getCollapsedHeaders(): Set<Accessor> {
    return this.state.collapsedHeaders;
  }

  getColumnVisibility(): ColumnVisibilityState {
    return this.state.columnVisibility;
  }

  isColumnVisible(accessor: Accessor): boolean {
    return this.state.columnVisibility[accessor] !== false;
  }

  destroy(): void {
    this.subscribers.clear();
  }
}
