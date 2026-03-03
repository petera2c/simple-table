# Quick Start: Using the Framework-Agnostic Managers

This guide shows you how to use the new manager-based architecture directly, without React.

## Installation

```bash
npm install simple-table-core
```

## Basic Usage

### 1. Create a TableManager

```typescript
import { TableManager } from 'simple-table-core/managers';
import { DEFAULT_CUSTOM_THEME } from 'simple-table-core/types/CustomTheme';

const tableManager = new TableManager({
  headers: [
    { accessor: 'id', label: 'ID', type: 'number', width: 80 },
    { accessor: 'name', label: 'Name', type: 'string', width: 200 },
    { accessor: 'email', label: 'Email', type: 'string', width: 250 },
    { accessor: 'age', label: 'Age', type: 'number', width: 80 },
  ],
  rows: [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ],
  rowHeight: 40,
  customTheme: DEFAULT_CUSTOM_THEME,
});
```

### 2. Subscribe to State Changes

```typescript
// Subscribe to any state changes
const unsubscribe = tableManager.subscribe(() => {
  console.log('Table state changed!');
  render(); // Re-render your UI
});

// Clean up when done
unsubscribe();
```

### 3. Use Individual Managers

#### Sorting

```typescript
// Sort by name ascending
tableManager.sortManager.updateSort({ 
  accessor: 'name', 
  direction: 'asc' 
});

// Sort by age descending
tableManager.sortManager.updateSort({ 
  accessor: 'age', 
  direction: 'desc' 
});

// Clear sort
tableManager.sortManager.updateSort();

// Get sorted data
const sortedRows = tableManager.sortManager.getSortedRows();
console.log('Sorted rows:', sortedRows);
```

#### Filtering

```typescript
// Filter: age > 25
tableManager.filterManager.updateFilter({
  accessor: 'age',
  operator: 'greaterThan',
  value: 25,
  type: 'number',
});

// Filter: name contains "John"
tableManager.filterManager.updateFilter({
  accessor: 'name',
  operator: 'contains',
  value: 'John',
  type: 'string',
});

// Clear specific filter
tableManager.filterManager.clearFilter('age');

// Clear all filters
tableManager.filterManager.clearAllFilters();

// Get filtered data
const filteredRows = tableManager.filterManager.getFilteredRows();
console.log('Filtered rows:', filteredRows);
```

#### Selection

```typescript
// Select a cell
tableManager.selectionManager.selectCell({
  rowIndex: 0,
  colIndex: 1,
  rowId: '1',
});

// Select a column
tableManager.selectionManager.selectColumn(2);

// Select multiple cells with Shift
tableManager.selectionManager.selectCell(
  { rowIndex: 5, colIndex: 1, rowId: '5' },
  true // isShiftKey
);

// Clear selection
tableManager.selectionManager.clearSelection();

// Check if cell is selected
const isSelected = tableManager.selectionManager.isCellSelected({
  rowIndex: 0,
  colIndex: 1,
  rowId: '1',
});
```

#### Columns

```typescript
// Hide a column
tableManager.columnManager.setColumnVisibility('email', false);

// Show a column
tableManager.columnManager.setColumnVisibility('email', true);

// Toggle column collapse
tableManager.columnManager.toggleColumnCollapse('name');

// Resize column
tableManager.columnManager.updateColumnWidth('name', 300);

// Get column state
const columnState = tableManager.columnManager.getState();
console.log('Collapsed headers:', columnState.collapsedHeaders);
console.log('Column visibility:', columnState.columnVisibility);
```

#### Dimensions

```typescript
// Get dimension information
const dimensions = tableManager.dimensionManager.getState();
console.log('Container width:', dimensions.containerWidth);
console.log('Header height:', dimensions.calculatedHeaderHeight);
console.log('Max header depth:', dimensions.maxHeaderDepth);
console.log('Content height:', dimensions.contentHeight);
```

#### Scrolling

```typescript
// Handle scroll event
tableManager.scrollManager.handleScroll(
  scrollTop,
  scrollLeft,
  containerHeight,
  contentHeight
);

// Get scroll state
const scrollState = tableManager.scrollManager.getState();
console.log('Scroll top:', scrollState.scrollTop);
console.log('Scroll direction:', scrollState.scrollDirection);
console.log('Is scrolling:', scrollState.isScrolling);
```

### 4. Update Configuration

```typescript
// Update rows
tableManager.updateConfig({
  rows: newRows,
});

// Update headers
tableManager.updateConfig({
  headers: newHeaders,
});

// Update multiple configs
tableManager.updateConfig({
  rows: newRows,
  headers: newHeaders,
  rowHeight: 50,
});
```

### 5. Clean Up

```typescript
// Always clean up when done
tableManager.destroy();
```

## Complete Example: Vanilla JavaScript

```typescript
import { TableManager } from 'simple-table-core/managers';
import { DEFAULT_CUSTOM_THEME } from 'simple-table-core/types/CustomTheme';

class MyTable {
  private tableManager: TableManager;
  private containerElement: HTMLElement;

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;

    this.tableManager = new TableManager({
      headers: [
        { accessor: 'name', label: 'Name', type: 'string', width: 200 },
        { accessor: 'age', label: 'Age', type: 'number', width: 100 },
        { accessor: 'email', label: 'Email', type: 'string', width: 250 },
      ],
      rows: [
        { name: 'John', age: 30, email: 'john@example.com' },
        { name: 'Jane', age: 25, email: 'jane@example.com' },
        { name: 'Bob', age: 35, email: 'bob@example.com' },
      ],
      rowHeight: 40,
      customTheme: DEFAULT_CUSTOM_THEME,
      onSortChange: (sort) => {
        console.log('Sort changed:', sort);
      },
      onFilterChange: (filters) => {
        console.log('Filters changed:', filters);
      },
    });

    this.tableManager.subscribe(() => {
      this.render();
    });

    this.setupUI();
    this.render();
  }

  private setupUI(): void {
    this.containerElement.innerHTML = `
      <div class="table-controls">
        <button id="sort-name">Sort by Name</button>
        <button id="sort-age">Sort by Age</button>
        <button id="filter-age">Filter Age > 25</button>
        <button id="clear-filters">Clear Filters</button>
      </div>
      <div id="table-data"></div>
    `;

    document.getElementById('sort-name')?.addEventListener('click', () => {
      this.tableManager.sortManager.updateSort({ accessor: 'name', direction: 'asc' });
    });

    document.getElementById('sort-age')?.addEventListener('click', () => {
      this.tableManager.sortManager.updateSort({ accessor: 'age', direction: 'desc' });
    });

    document.getElementById('filter-age')?.addEventListener('click', () => {
      this.tableManager.filterManager.updateFilter({
        accessor: 'age',
        operator: 'greaterThan',
        value: 25,
        type: 'number',
      });
    });

    document.getElementById('clear-filters')?.addEventListener('click', () => {
      this.tableManager.filterManager.clearAllFilters();
    });
  }

  private render(): void {
    const sortedRows = this.tableManager.sortManager.getSortedRows();
    const filteredRows = this.tableManager.filterManager.getFilteredRows();
    const currentSort = this.tableManager.sortManager.getSortColumn();
    const filters = this.tableManager.filterManager.getFilters();

    const dataContainer = document.getElementById('table-data');
    if (!dataContainer) return;

    dataContainer.innerHTML = `
      <div class="table-info">
        <p>Total rows: ${sortedRows.length}</p>
        <p>Filtered rows: ${filteredRows.length}</p>
        <p>Current sort: ${currentSort ? `${currentSort.key.accessor} ${currentSort.direction}` : 'none'}</p>
        <p>Active filters: ${Object.keys(filters).length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRows.map(row => `
            <tr>
              <td>${row.name}</td>
              <td>${row.age}</td>
              <td>${row.email}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  destroy(): void {
    this.tableManager.destroy();
  }
}

// Usage
const container = document.getElementById('app');
const table = new MyTable(container);
```

## React Hook Usage (Backward Compatible)

The existing React hooks now use managers internally but maintain the same API:

```typescript
import { useSortableData, useFilterableData } from 'simple-table-core/hooks';

function MyReactComponent() {
  const { sort, sortedRows, updateSort } = useSortableData({
    headers,
    tableRows: rows,
    externalSortHandling: false,
    onSortChange: (sort) => console.log('Sort:', sort),
  });

  const { filteredRows, updateFilter, clearFilter, filters } = useFilterableData({
    rows: sortedRows,
    headers,
    externalFilterHandling: false,
    onFilterChange: (filters) => console.log('Filters:', filters),
  });

  return (
    <div>
      <button onClick={() => updateSort({ accessor: 'name', direction: 'asc' })}>
        Sort by Name
      </button>
      <button onClick={() => updateFilter({
        accessor: 'age',
        operator: 'greaterThan',
        value: 25,
        type: 'number',
      })}>
        Filter Age > 25
      </button>
      {/* Render your table */}
    </div>
  );
}
```

## TypeScript Support

All managers are fully typed with TypeScript:

```typescript
import { 
  TableManager, 
  TableManagerConfig, 
  TableManagerState,
  SortManager,
  SortManagerState,
  FilterManager,
  FilterManagerState,
} from 'simple-table-core/managers';

const config: TableManagerConfig = {
  // TypeScript will validate all properties
};

const manager = new TableManager(config);
const state: TableManagerState = manager.getState();
```

## Performance Tips

1. **Batch updates**: Update config once with multiple changes
   ```typescript
   tableManager.updateConfig({
     rows: newRows,
     headers: newHeaders,
     rowHeight: 50,
   });
   ```

2. **Use external handling**: For large datasets, handle sort/filter server-side
   ```typescript
   const tableManager = new TableManager({
     externalSortHandling: true,
     externalFilterHandling: true,
     onSortChange: (sort) => fetchDataFromServer(sort),
     onFilterChange: (filters) => fetchDataFromServer(filters),
   });
   ```

3. **Unsubscribe when not needed**: Clean up subscriptions
   ```typescript
   const unsubscribe = manager.subscribe(callback);
   // Later...
   unsubscribe();
   ```

## Troubleshooting

### Manager not updating
Make sure you're subscribing to state changes:
```typescript
tableManager.subscribe(() => {
  // This will be called when state changes
  updateYourUI();
});
```

### Memory leaks
Always call `destroy()` when done:
```typescript
// In React
useEffect(() => {
  return () => tableManager.destroy();
}, []);

// In vanilla JS
window.addEventListener('beforeunload', () => {
  tableManager.destroy();
});
```

## Resources

- **Architecture documentation**: `ARCHITECTURE.md`
- **Refactoring summary**: `REFACTORING_SUMMARY.md`
- **React adapter example**: `src/adapters/react/SimpleTableAdapter.tsx`
- **Vanilla JS example**: `src/adapters/vanilla/VanillaTableExample.ts`
- **Manager source code**: `src/managers/` directory

## Support

For questions or issues, please refer to the main documentation or open an issue on GitHub.
