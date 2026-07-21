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
    startCell?: {
        current: Cell | null;
    };
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
export declare class HandleOutsideClickManager {
    private config;
    private isListening;
    constructor(config: HandleOutsideClickConfig);
    /**
     * Updates the configuration
     * @param config - New configuration
     */
    updateConfig(config: Partial<HandleOutsideClickConfig>): void;
    /**
     * Handles the mousedown event
     */
    private handleClickOutside;
    /**
     * Starts listening to mousedown events
     */
    startListening(): void;
    /**
     * Stops listening to mousedown events
     */
    stopListening(): void;
    /**
     * Cleans up the manager and removes all event listeners
     */
    destroy(): void;
}
export default HandleOutsideClickManager;
