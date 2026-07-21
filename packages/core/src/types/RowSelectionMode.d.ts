/**
 * Row selection mode.
 * - `multiple` (default): select any number of rows; select-all is available when the checkbox column is shown
 * - `single`: selecting a row replaces the previous selection; select-all is hidden
 */
type RowSelectionMode = "single" | "multiple";
export type { RowSelectionMode };
export default RowSelectionMode;
