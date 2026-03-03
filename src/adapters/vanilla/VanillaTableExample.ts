import { TableManager, TableManagerConfig } from "../../managers/TableManager";
import { TableRenderer } from "../../renderers/TableRenderer";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";

/**
 * Example of using the table library with vanilla JavaScript/TypeScript
 * No framework required - just pure DOM manipulation
 */
export class VanillaTable {
  private tableManager: TableManager;
  private tableRenderer: TableRenderer;
  private containerElement: HTMLElement;

  constructor(containerElement: HTMLElement, headers: HeaderObject[], rows: Row[]) {
    this.containerElement = containerElement;

    const config: TableManagerConfig = {
      headers,
      rows,
      rowHeight: 40,
      customTheme: DEFAULT_CUSTOM_THEME,
      externalSortHandling: false,
      externalFilterHandling: false,
      containerElement,
    };

    this.tableManager = new TableManager(config);
    
    this.tableRenderer = new TableRenderer({
      tableManager: this.tableManager,
    });

    this.tableManager.subscribe(() => {
      this.render();
    });

    this.render();
  }

  private render(): void {
    const sortedRows = this.tableManager.sortManager.getSortedRows();
    const filteredRows = this.tableManager.filterManager.getFilteredRows();
    const flattenedRows = this.tableManager.rowManager.getFlattenedRows();

    this.containerElement.innerHTML = `
      <div class="vanilla-table">
        <div class="table-info">
          Rows: ${sortedRows.length} | 
          Filtered: ${filteredRows.length} | 
          Flattened: ${flattenedRows.length}
        </div>
      </div>
    `;
  }

  updateData(rows: Row[]): void {
    this.tableManager.updateConfig({ rows });
  }

  updateHeaders(headers: HeaderObject[]): void {
    this.tableManager.updateConfig({ headers });
  }

  sort(accessor: string, direction?: "asc" | "desc"): void {
    this.tableManager.sortManager.updateSort({ accessor, direction });
  }

  clearSort(): void {
    this.tableManager.sortManager.updateSort();
  }

  destroy(): void {
    this.tableManager.destroy();
    this.tableRenderer.destroy();
  }
}

/**
 * Usage example:
 * 
 * const container = document.getElementById('table-container');
 * const headers = [
 *   { accessor: 'name', label: 'Name', type: 'string' },
 *   { accessor: 'age', label: 'Age', type: 'number' },
 * ];
 * const rows = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 },
 * ];
 * 
 * const table = new VanillaTable(container, headers, rows);
 * 
 * // Sort by name
 * table.sort('name', 'asc');
 * 
 * // Update data
 * table.updateData([...rows, { name: 'Bob', age: 35 }]);
 * 
 * // Clean up when done
 * table.destroy();
 */
