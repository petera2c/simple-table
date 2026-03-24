import { createDropdown } from "./createDropdown";

const SELECT_ICON_SVG = `<svg
  class="st-custom-select-arrow"
  width="12"
  height="12"
  viewBox="0 0 12 12"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M3 4.5L6 7.5L9 4.5"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CreateCustomSelectOptions {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createCustomSelect = (options: CreateCustomSelectOptions) => {
  let {
    value,
    onChange,
    options: selectOptions,
    placeholder = "Select...",
    className = "",
    disabled = false,
    containerRef,
    mainBodyRef,
  } = options;

  let isOpen = false;
  let focusedIndex = -1;

  const container = document.createElement("div");
  container.className = `st-custom-select ${className} ${disabled ? "st-custom-select-disabled" : ""}`.trim();

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "st-custom-select-trigger";
  trigger.disabled = disabled;
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-labelledby", "select-label");

  const valueSpan = document.createElement("span");
  valueSpan.className = "st-custom-select-value";
  const selectedOption = selectOptions.find((opt) => opt.value === value);
  valueSpan.textContent = selectedOption ? selectedOption.label : placeholder;

  const arrowSpan = document.createElement("span");
  arrowSpan.innerHTML = SELECT_ICON_SVG;

  trigger.appendChild(valueSpan);
  trigger.appendChild(arrowSpan);
  container.appendChild(trigger);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "st-custom-select-options";
  optionsContainer.setAttribute("role", "listbox");

  const renderOptions = () => {
    optionsContainer.innerHTML = "";

    selectOptions.forEach((option, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = `st-custom-select-option ${
        option.value === value ? "st-custom-select-option-selected" : ""
      } ${index === focusedIndex ? "st-custom-select-option-focused" : ""}`.trim();
      optionDiv.setAttribute("role", "option");
      optionDiv.setAttribute("aria-selected", (option.value === value).toString());
      optionDiv.setAttribute("tabindex", "0");
      optionDiv.textContent = option.label;

      optionDiv.addEventListener("click", () => handleOptionClick(option.value));
      optionDiv.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOptionClick(option.value);
        }
      });

      optionsContainer.appendChild(optionDiv);
    });
  };

  renderOptions();

  const dropdown = createDropdown({
    children: optionsContainer,
    containerRef,
    mainBodyRef,
    onClose: () => {
      setOpen(false);
    },
    open: isOpen,
    overflow: "auto",
    positioning: "absolute",
  });

  container.appendChild(dropdown.element);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    focusedIndex = -1;
    renderOptions();
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen(!isOpen);
    if (!isOpen) {
      const currentIndex = selectOptions.findIndex((opt) => opt.value === value);
      focusedIndex = currentIndex >= 0 ? currentIndex : 0;
    } else {
      focusedIndex = -1;
    }
    renderOptions();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusedIndex = focusedIndex < selectOptions.length - 1 ? focusedIndex + 1 : 0;
        renderOptions();
        break;
      case "ArrowUp":
        event.preventDefault();
        focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : selectOptions.length - 1;
        renderOptions();
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0) {
          onChange(selectOptions[focusedIndex].value);
          setOpen(false);
          focusedIndex = -1;
          renderOptions();
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        focusedIndex = -1;
        renderOptions();
        break;
    }
  };

  const setOpen = (newOpen: boolean) => {
    isOpen = newOpen;
    trigger.setAttribute("aria-expanded", isOpen.toString());

    if (isOpen) {
      container.classList.add("st-custom-select-open");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      container.classList.remove("st-custom-select-open");
      document.removeEventListener("keydown", handleKeyDown);
    }

    dropdown.setOpen(isOpen);
  };

  trigger.addEventListener("click", handleToggle);

  const update = (newOptions: Partial<CreateCustomSelectOptions>) => {
    if (newOptions.value !== undefined) {
      value = newOptions.value;
      const selectedOption = selectOptions.find((opt) => opt.value === value);
      valueSpan.textContent = selectedOption ? selectedOption.label : placeholder;
      renderOptions();
    }
    if (newOptions.options !== undefined) {
      selectOptions = newOptions.options;
      renderOptions();
    }
    if (newOptions.disabled !== undefined) {
      disabled = newOptions.disabled;
      trigger.disabled = disabled;
      if (disabled) {
        container.classList.add("st-custom-select-disabled");
      } else {
        container.classList.remove("st-custom-select-disabled");
      }
    }
    if (newOptions.onChange !== undefined) {
      onChange = newOptions.onChange;
    }
  };

  const destroy = () => {
    trigger.removeEventListener("click", handleToggle);
    document.removeEventListener("keydown", handleKeyDown);
    dropdown.destroy();
    container.remove();
  };

  return { element: container, update, destroy, setOpen };
};
