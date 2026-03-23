import { HeaderRenderContext } from "./types";
import {
  createCheckbox,
  updateCheckboxElement,
} from "../columnEditor/createCheckbox";

/**
 * Updates an existing header select-all checkbox to match the current checked state.
 * Use when selection changes but the header cell DOM is reused (e.g. from cache).
 */
export const updateHeaderSelectionCheckbox = (
  cellElement: HTMLElement,
  checked: boolean,
): void => {
  updateCheckboxElement(cellElement, checked);
};

/**
 * Creates the header select-all checkbox using the shared createCheckbox (same as column editor popout).
 */
export const createSelectionCheckbox = (context: HeaderRenderContext): HTMLElement => {
  const checked = context.areAllRowsSelected ? context.areAllRowsSelected() : false;
  const checkbox = createCheckbox({
    checked,
    onChange: (newChecked) => {
      context.handleSelectAll?.(newChecked);
    },
    ariaLabel: "Select all rows",
  });
  return checkbox.element;
};
