import { SimpleTableVanilla } from "simple-table-core";
import type { LoadingStateEmployee } from "./loading-state.demo-data";
import type { Theme, Row, GetRowIdParams } from "simple-table-core";
import { loadingStateConfig } from "./loading-state.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<LoadingStateEmployee>) => row.id;
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
    getRowId,
    columns: loadingStateConfig.headers,
    rows: [] ,
    height: options?.height ?? "400px",
    theme: options?.theme,
    isLoading: true,
  });

  function loadData() {
    reloadBtn.textContent = "Loading\u2026";
    reloadBtn.disabled = true;
    reloadBtn.style.cursor = "not-allowed";
    table.update({ rows: [] , isLoading: true });

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      table.update({ rows: loadingStateConfig.rows , isLoading: false });
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
