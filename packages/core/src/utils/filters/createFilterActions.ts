export interface CreateFilterActionsOptions {
  onApply: () => void;
  onClear?: () => void;
  canApply: boolean;
  showClear: boolean;
}

export const createFilterActions = (options: CreateFilterActionsOptions) => {
  let { onApply, onClear, canApply, showClear } = options;

  const container = document.createElement("div");
  container.className = "st-filter-actions";

  const applyBtn = document.createElement("button");
  applyBtn.className = "st-filter-button st-filter-apply";
  applyBtn.textContent = "Apply";
  applyBtn.disabled = !canApply;
  applyBtn.addEventListener("click", onApply);

  container.appendChild(applyBtn);

  let clearBtn: HTMLButtonElement | null = null;

  const renderClearButton = () => {
    if (showClear && !clearBtn) {
      clearBtn = document.createElement("button");
      clearBtn.className = "st-filter-button st-filter-clear";
      clearBtn.textContent = "Clear";
      clearBtn.addEventListener("click", () => onClear?.());
      container.appendChild(clearBtn);
    } else if (!showClear && clearBtn) {
      clearBtn.remove();
      clearBtn = null;
    }
  };

  renderClearButton();

  const update = (newOptions: Partial<CreateFilterActionsOptions>) => {
    if (newOptions.canApply !== undefined) {
      canApply = newOptions.canApply;
      applyBtn.disabled = !canApply;
    }
    if (newOptions.showClear !== undefined) {
      showClear = newOptions.showClear;
      renderClearButton();
    }
    if (newOptions.onApply !== undefined) {
      onApply = newOptions.onApply;
    }
    if (newOptions.onClear !== undefined) {
      onClear = newOptions.onClear;
    }
  };

  const destroy = () => {
    applyBtn.removeEventListener("click", onApply);
    if (clearBtn && onClear) {
      clearBtn.removeEventListener("click", onClear);
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
