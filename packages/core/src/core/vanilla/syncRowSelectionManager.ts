import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type { ProcessRowsResult } from "../../utils/rowProcessing";
import { RowSelectionManager } from "../../managers/RowSelectionManager";

export interface RowSelectionSyncHost {
  getConfig(): SimpleTableConfig;
  getTableRoot(): HTMLElement;
  getRowSelectionManager(): RowSelectionManager | null;
  setRowSelectionManager(manager: RowSelectionManager | null): void;
  getLastProcessedResult(): ProcessRowsResult | null;
  onRender(source: string): void;
}

/** Creates, updates, or tears down row selection when those props change. */
export const syncRowSelectionManager = (host: RowSelectionSyncHost): void => {
  const config = host.getConfig();
  if (config.enableRowSelection) {
    const shared = {
      onRowSelectionChange: config.onRowSelectionChange,
      enableRowSelection: true as const,
      rowSelectionMode: config.rowSelectionMode ?? ("multiple" as const),
      selectRowOnClick: config.selectRowOnClick ?? false,
      showRowSelectionColumn: config.showRowSelectionColumn !== false,
      selectableCells: config.selectableCells ?? false,
      tableRoot: host.getTableRoot(),
    };

    const existing = host.getRowSelectionManager();
    if (!existing) {
      const manager = new RowSelectionManager({
        tableRows: host.getLastProcessedResult()?.currentTableRows ?? [],
        ...shared,
      });
      manager.subscribe(() => {
        host.onRender("rowSelectionManager");
      });
      host.setRowSelectionManager(manager);
    } else {
      existing.updateConfig(shared);
    }
  } else if (host.getRowSelectionManager()) {
    host.getRowSelectionManager()!.destroy();
    host.setRowSelectionManager(null);
  }
};
