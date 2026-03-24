export interface CreateFilterInputOptions {
  type?: "text" | "number" | "date";
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

export const createFilterInput = (options: CreateFilterInputOptions) => {
  let {
    type = "text",
    value,
    onChange,
    onEnter,
    placeholder = "",
    autoFocus = false,
    min,
    max,
    step,
  } = options;

  const input = document.createElement("input");
  input.className = "st-filter-input";
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;

  if (min !== undefined) input.min = min;
  if (max !== undefined) input.max = max;
  if (step !== undefined) input.step = step;

  if (autoFocus) {
    setTimeout(() => input.focus(), 0);
  }

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  input.addEventListener("input", handleInput);
  input.addEventListener("keydown", handleKeyDown);

  const update = (newOptions: Partial<CreateFilterInputOptions>) => {
    if (newOptions.value !== undefined) {
      value = newOptions.value;
      input.value = value;
    }
    if (newOptions.type !== undefined) {
      type = newOptions.type;
      input.type = type;
    }
    if (newOptions.placeholder !== undefined) {
      placeholder = newOptions.placeholder;
      input.placeholder = placeholder;
    }
    if (newOptions.min !== undefined) {
      min = newOptions.min;
      input.min = min;
    }
    if (newOptions.max !== undefined) {
      max = newOptions.max;
      input.max = max;
    }
    if (newOptions.step !== undefined) {
      step = newOptions.step;
      input.step = step;
    }
    if (newOptions.onChange !== undefined) {
      onChange = newOptions.onChange;
    }
    if (newOptions.onEnter !== undefined) {
      onEnter = newOptions.onEnter;
    }
  };

  const destroy = () => {
    input.removeEventListener("input", handleInput);
    input.removeEventListener("keydown", handleKeyDown);
    input.remove();
  };

  return { element: input, update, destroy };
};
