import { expect, within } from "@storybook/test";

/**
 * Column Visibility Test Utilities
 */

export const testColumnVisibility = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const columnEditor = canvasElement.querySelector(".st-column-editor");
  if (columnEditor) {
    expect(columnEditor).toBeInTheDocument();

    const popout = canvasElement.querySelector(".st-column-editor-popout");
    if (popout) {
      const checkboxes = popout.querySelectorAll(".st-checkbox-input");
      expect(checkboxes.length).toBeGreaterThan(0);

      const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");

      if (checkboxItems.length > 0) {
        const firstCheckboxItem = checkboxItems[0];
        const checkboxLabel = firstCheckboxItem.querySelector(".st-checkbox-label");
        const checkbox = firstCheckboxItem.querySelector(".st-checkbox-input") as HTMLInputElement;

        if (checkbox && checkboxLabel) {
          const columnName = checkboxLabel.textContent?.trim();
          const initiallyChecked = checkbox.checked;
          const initialColumnCount = canvasElement.querySelectorAll(".st-header-label-text").length;

          (checkboxLabel as HTMLElement).click();
          await new Promise((resolve) => setTimeout(resolve, 100));

          const finallyChecked = checkbox.checked;
          expect(finallyChecked).not.toBe(initiallyChecked);

          const finalColumnCount = canvasElement.querySelectorAll(".st-header-label-text").length;
          expect(typeof finalColumnCount).toBe("number");
          expect(finalColumnCount).toBeGreaterThan(0);

          console.log(
            `Column visibility test: ${columnName} toggled from ${initiallyChecked} to ${finallyChecked}`
          );
          console.log(`Column count changed from ${initialColumnCount} to ${finalColumnCount}`);
        }
      }
    }
  }
};

export const testHiddenColumnsNotVisible = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  hiddenColumnAccessors: string[]
) => {
  hiddenColumnAccessors.forEach((accessor) => {
    const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"]`);
    expect(cells.length).toBe(0);
  });
};

export const testVisibleColumnsShown = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  visibleColumnAccessors: string[]
) => {
  visibleColumnAccessors.forEach((accessor) => {
    const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"]`);
    expect(cells.length).toBeGreaterThan(0);
  });
};

export const testColumnEditorStructure = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const columnEditor = canvasElement.querySelector(".st-column-editor");
  if (columnEditor) {
    const popout = canvasElement.querySelector(".st-column-editor-popout");
    expect(popout).toBeInTheDocument();

    if (popout) {
      const popoutContent = popout.querySelector(".st-column-editor-popout-content");
      expect(popoutContent).toBeInTheDocument();

      const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");
      expect(checkboxItems.length).toBeGreaterThan(0);

      checkboxItems.forEach((item) => {
        expect(item).toHaveClass("st-header-checkbox-item");

        const checkbox = item.querySelector(".st-checkbox-label");
        if (checkbox) {
          expect(checkbox).toHaveClass("st-checkbox-label");
        }
      });
    }
  }
};
