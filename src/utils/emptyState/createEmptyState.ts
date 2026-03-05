export interface CreateEmptyStateOptions {
  message?: string;
  className?: string;
}

export const createEmptyState = (options: CreateEmptyStateOptions = {}) => {
  let { message = "No rows to display", className = "" } = options;

  const container = document.createElement("div");
  container.className = `st-empty-state ${className}`.trim();
  container.textContent = message;

  const update = (newOptions: Partial<CreateEmptyStateOptions>) => {
    if (newOptions.message !== undefined) {
      message = newOptions.message;
      container.textContent = message;
    }
    if (newOptions.className !== undefined) {
      className = newOptions.className;
      container.className = `st-empty-state ${className}`.trim();
    }
  };

  const destroy = () => {
    container.remove();
  };

  return { element: container, update, destroy };
};
