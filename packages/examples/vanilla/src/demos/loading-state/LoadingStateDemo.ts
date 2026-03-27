import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, Row } from "simple-table-core";
import { loadingStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderLoadingStateDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): { mount: () => void; destroy: () => void } {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.marginBottom = "12px";

  const reloadBtn = document.createElement("button");
  reloadBtn.textContent = "Loading\u2026";
  reloadBtn.disabled = true;
  Object.assign(reloadBtn.style, { padding: "6px 16px", cursor: "not-allowed" });
  controls.appendChild(reloadBtn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  let timer: ReturnType<typeof setTimeout> | null = null;

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: loadingStateConfig.headers,
    rows: [] as Row[],
    height: options?.height ?? "400px",
    theme: options?.theme,
    isLoading: true,
  });

  function loadData() {
    reloadBtn.textContent = "Loading\u2026";
    reloadBtn.disabled = true;
    reloadBtn.style.cursor = "not-allowed";
    table.update({ rows: [] as Row[], isLoading: true });

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      table.update({ rows: loadingStateConfig.rows as Row[], isLoading: false });
      reloadBtn.textContent = "Reload Data";
      reloadBtn.disabled = false;
      reloadBtn.style.cursor = "pointer";
    }, 2000);
  }

  reloadBtn.addEventListener("click", loadData);
  loadData();

  return {
    mount: () => table.mount(),
    destroy: () => {
      if (timer) clearTimeout(timer);
      table.destroy();
    },
  };
}
