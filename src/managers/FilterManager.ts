import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { getNestedValue } from "../utils/rowUtils";
import { flattenAllHeaders } from "../utils/headerUtils";

export interface FilterManagerConfig {
  rows: Row[];
  headers: HeaderObject[];
  externalFilterHandling: boolean;
  onFilterChange?: (filters: TableFilterState) => void;
  announce?: (message: string) => void;
}

export interface FilterManagerState {
  filters: TableFilterState;
  filteredRows: Row[];
}

type StateChangeCallback = (state: FilterManagerState) => void;

export class FilterManager {
  private config: FilterManagerConfig;
  private state: FilterManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private headerLookup: Map<Accessor, HeaderObject> = new Map();

  constructor(config: FilterManagerConfig) {
    this.config = config;
    this.updateHeaderLookup();
    
    const filters: TableFilterState = {};
    const filteredRows = this.computeFilteredRows(config.rows, filters);
    
    this.state = {
      filters,
      filteredRows,
    };
  }

  private updateHeaderLookup(): void {
    const allHeaders = flattenAllHeaders(this.config.headers);
    this.headerLookup = new Map<Accessor, HeaderObject>();
    
    allHeaders.forEach((header) => {
      this.headerLookup.set(header.accessor, header);
    });
  }

  private computeFilteredRows(tableRows: Row[], filterState: TableFilterState): Row[] {
    if (this.config.externalFilterHandling) return tableRows;
    if (!filterState || Object.keys(filterState).length === 0) return tableRows;

    return tableRows.filter((row) => {
      return Object.values(filterState).every((filter) => {
        try {
          const cellValue = getNestedValue(row, filter.accessor);
          return applyFilterToValue(cellValue, filter);
        } catch (error) {
          console.warn(`Filter error for accessor ${filter.accessor}:`, error);
          return true;
        }
      });
    });
  }

  updateConfig(config: Partial<FilterManagerConfig>): void {
    const oldHeaders = this.config.headers;
    this.config = { ...this.config, ...config };
    
    if (config.headers && config.headers !== oldHeaders) {
      this.updateHeaderLookup();
    }

    const filteredRows = this.computeFilteredRows(this.config.rows, this.state.filters);
    
    if (filteredRows !== this.state.filteredRows) {
      this.state = {
        ...this.state,
        filteredRows,
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

  updateFilter(filter: FilterCondition): void {
    const newFilterState = {
      ...this.state.filters,
      [filter.accessor]: filter,
    };

    const filteredRows = this.computeFilteredRows(this.config.rows, newFilterState);

    this.state = {
      filters: newFilterState,
      filteredRows,
    };

    this.config.onFilterChange?.(newFilterState);

    if (this.config.announce) {
      const header = this.headerLookup.get(filter.accessor);
      if (header) {
        this.config.announce(`Filter applied to ${header.label}`);
      }
    }

    this.notifySubscribers();
  }

  clearFilter(accessor: Accessor): void {
    const newFilterState = { ...this.state.filters };
    delete newFilterState[accessor];

    const filteredRows = this.computeFilteredRows(this.config.rows, newFilterState);

    this.state = {
      filters: newFilterState,
      filteredRows,
    };

    this.config.onFilterChange?.(newFilterState);

    if (this.config.announce) {
      const header = this.headerLookup.get(accessor);
      if (header) {
        this.config.announce(`Filter removed from ${header.label}`);
      }
    }

    this.notifySubscribers();
  }

  clearAllFilters(): void {
    const filteredRows = this.config.rows;

    this.state = {
      filters: {},
      filteredRows,
    };

    this.config.onFilterChange?.({});

    if (this.config.announce) {
      this.config.announce("All filters cleared");
    }

    this.notifySubscribers();
  }

  computeFilteredRowsPreview(filter: FilterCondition): Row[] {
    const previewFilterState = {
      ...this.state.filters,
      [filter.accessor]: filter,
    };

    return this.computeFilteredRows(this.config.rows, previewFilterState);
  }

  getState(): FilterManagerState {
    return this.state;
  }

  getFilters(): TableFilterState {
    return this.state.filters;
  }

  getFilteredRows(): Row[] {
    return this.state.filteredRows;
  }

  destroy(): void {
    this.subscribers.clear();
  }
}
