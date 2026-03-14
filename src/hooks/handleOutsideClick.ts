import HeaderObject from "../types/HeaderObject";
import Cell from "../types/Cell";

export interface HandleOutsideClickConfig {
  selectableColumns: boolean;
  selectedCells: Set<string>;
  selectedColumns: Set<number>;
  setSelectedCells: (cells: Set<string>) => void;
  setSelectedColumns: (columns: Set<number>) => void;
  activeHeaderDropdown?: HeaderObject | null;
  setActiveHeaderDropdown?: (header: HeaderObject | null) => void;
  startCell?: { current: Cell | null };
  /** When provided, used to read current selection (avoids stale refs). */
  getSelectedCells?: () => Set<string>;
  getSelectedColumns?: () => Set<number>;
  /** When provided, called to clear both cell/column selection and startCell in one go. */
  onClearSelection?: () => void;
}

/**
 * Manages outside click detection for cells, columns, and header dropdowns.
 * This is a vanilla JS alternative to the useHandleOutsideClick hook.
 */
export class HandleOutsideClickManager {
  private config: HandleOutsideClickConfig;
  private isListening: boolean = false;

  constructor(config: HandleOutsideClickConfig) {
    this.config = config;
  }

  /**
   * Updates the configuration
   * @param config - New configuration
   */
  updateConfig(config: Partial<HandleOutsideClickConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Handles the mousedown event
   */
  private handleClickOutside = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    // Check if the click is inside an editable header input - if so, don't handle outside click
    if (target.closest(".editable-cell-input") && target.closest(".st-header-cell")) {
      return;
    }

    // Close header dropdown if clicking outside of it
    if (this.config.activeHeaderDropdown && this.config.setActiveHeaderDropdown) {
      const insideDropdown =
        target.closest(".st-dropdown-content") || target.closest(".dropdown-content");
      if (!target.closest(".st-header-cell") && !insideDropdown) {
        this.config.setActiveHeaderDropdown(null);
      }
    }

    if (
      !target.closest(".st-cell") &&
      (this.config.selectableColumns
        ? !target.classList.contains("st-header-cell") &&
          !target.classList.contains("st-header-label") &&
          !target.classList.contains("st-header-label-text")
        : true)
    ) {
      const selectedCells = this.config.getSelectedCells?.() ?? this.config.selectedCells;
      const selectedColumns = this.config.getSelectedColumns?.() ?? this.config.selectedColumns;
      const hasSelection = selectedCells.size > 0 || selectedColumns.size > 0;

      if (hasSelection) {
        if (this.config.onClearSelection) {
          this.config.onClearSelection();
        } else {
          this.config.setSelectedCells(new Set());
          this.config.setSelectedColumns(new Set());
          if (this.config.startCell) {
            this.config.startCell.current = null;
          }
        }
      }
    }
  };

  /**
   * Starts listening to mousedown events
   */
  startListening(): void {
    if (!this.isListening) {
      document.addEventListener("mousedown", this.handleClickOutside);
      this.isListening = true;
    }
  }

  /**
   * Stops listening to mousedown events
   */
  stopListening(): void {
    if (this.isListening) {
      document.removeEventListener("mousedown", this.handleClickOutside);
      this.isListening = false;
    }
  }

  /**
   * Cleans up the manager and removes all event listeners
   */
  destroy(): void {
    this.stopListening();
  }
}

export default HandleOutsideClickManager;
