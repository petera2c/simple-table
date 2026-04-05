export interface CreateFilterActionsOptions {
  onApply: () => void;
  onClear?: () => void;
  canApply: boolean;
  showClear: boolean;
}

/** Matches React FilterActions: `st-filter-button-apply`, `st-filter-button-clear`, `st-filter-button-disabled`. */
export const createFilterActions = (options: CreateFilterActionsOptions) => {
  let { onApply, onClear, canApply, showClear } = options;

  const container = document.createElement("div");
  container.className = "st-filter-actions";

  const applyBtn = document.createElement("button");
  applyBtn.type = "button";
  applyBtn.tabIndex = 0;
  applyBtn.textContent = "Apply";

  const syncApplyButton = () => {
    applyBtn.disabled = !canApply;
    applyBtn.className = `st-filter-button st-filter-button-apply${!canApply ? " st-filter-button-disabled" : ""}`.trim();
  };
  syncApplyButton();

  const handleApplyClick = () => {
    onApply();
  };
  applyBtn.addEventListener("click", handleApplyClick);

  container.appendChild(applyBtn);

  let clearBtn: HTMLButtonElement | null = null;

  const handleClearClick = () => {
    onClear?.();
  };

  const renderClearButton = () => {
    const shouldShow = showClear && !!onClear;
    if (shouldShow && !clearBtn) {
      clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.tabIndex = 0;
      clearBtn.className = "st-filter-button st-filter-button-clear";
      clearBtn.textContent = "Clear";
      clearBtn.addEventListener("click", handleClearClick);
      container.appendChild(clearBtn);
    } else if (!shouldShow && clearBtn) {
      clearBtn.removeEventListener("click", handleClearClick);
      clearBtn.remove();
      clearBtn = null;
    }
  };

  renderClearButton();

  const update = (newOptions: Partial<CreateFilterActionsOptions>) => {
    if (newOptions.canApply !== undefined) {
      canApply = newOptions.canApply;
      syncApplyButton();
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
      renderClearButton();
    }
  };

  const destroy = () => {
    applyBtn.removeEventListener("click", handleApplyClick);
    if (clearBtn) {
      clearBtn.removeEventListener("click", handleClearClick);
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
