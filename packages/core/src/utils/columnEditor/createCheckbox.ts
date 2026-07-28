import { createCheckIcon, createMinusIcon } from "../../icons";

/**
 * Creates a vanilla JS checkbox element
 */

export interface CreateCheckboxOptions {
  checked: boolean;
  /** When true, shows a minus mark and sets aria-checked="mixed" (partial selection). */
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

/** Shared checkmark SVG for checkbox custom visual (used by createCheckbox and update helpers). */
export const createCheckmarkSVG = (): SVGSVGElement => createCheckIcon("st-checkbox-checkmark");

/** Shared minus SVG for indeterminate checkbox custom visual. */
export const createMinusSVG = (): SVGSVGElement => createMinusIcon("st-checkbox-minus");

const applyCheckboxVisual = (
  input: HTMLInputElement,
  customCheckbox: HTMLSpanElement,
  checked: boolean,
  indeterminate: boolean,
): void => {
  input.checked = checked;
  input.indeterminate = indeterminate;
  input.setAttribute("aria-checked", indeterminate ? "mixed" : String(checked));

  customCheckbox.className = `st-checkbox-custom ${
    indeterminate ? "st-indeterminate" : checked ? "st-checked" : ""
  }`;
  customCheckbox.setAttribute("aria-hidden", "true");
  customCheckbox.innerHTML = "";

  if (indeterminate) {
    customCheckbox.appendChild(createMinusSVG());
  } else if (checked) {
    customCheckbox.appendChild(createCheckmarkSVG());
  }
};

/**
 * Updates an existing checkbox DOM (created by createCheckbox) to match the given checked state.
 * Use when the checkbox element is reused (e.g. from cache) and selection state changed.
 * Clears any indeterminate state.
 * @param container - Element that contains .st-checkbox-input and .st-checkbox-custom (the label or a parent)
 */
export const updateCheckboxElement = (
  container: HTMLElement,
  checked: boolean,
): void => {
  const input = container.querySelector<HTMLInputElement>(".st-checkbox-input");
  const customCheckbox = container.querySelector<HTMLSpanElement>(".st-checkbox-custom");
  if (!input || !customCheckbox) return;
  if (input.checked === checked && !input.indeterminate) return;
  applyCheckboxVisual(input, customCheckbox, checked, false);
};

export const createCheckbox = ({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: CreateCheckboxOptions) => {
  const label = document.createElement("label");
  label.className = "st-checkbox-label";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "st-checkbox-input";
  if (ariaLabel) {
    input.setAttribute("aria-label", ariaLabel);
  }

  const customCheckbox = document.createElement("span");
  applyCheckboxVisual(input, customCheckbox, checked, indeterminate);

  const toggleCheckbox = () => {
    // Native click clears indeterminate; sync visual to the resulting checked state.
    applyCheckboxVisual(input, customCheckbox, input.checked, false);
    onChange(input.checked);
  };

  input.addEventListener("change", toggleCheckbox);

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === " ") {
      e.stopPropagation();
    }
  });

  // Prevent drag events from interfering with checkbox clicks
  label.addEventListener("mousedown", (e: MouseEvent) => {
    e.stopPropagation();
  });

  label.addEventListener("dragstart", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  });

  label.appendChild(input);
  label.appendChild(customCheckbox);

  return {
    element: label,
    update: (newChecked: boolean, newIndeterminate = false) => {
      if (
        input.checked === newChecked &&
        input.indeterminate === newIndeterminate
      ) {
        return;
      }
      applyCheckboxVisual(input, customCheckbox, newChecked, newIndeterminate);
    },
    destroy: () => {
      input.removeEventListener("change", toggleCheckbox);
    },
  };
};
