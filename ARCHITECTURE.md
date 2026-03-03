# Framework-Agnostic Architecture

This document describes the new architecture that separates the core table logic from React, enabling framework adapters for React, Vue, Svelte, and vanilla JavaScript.

## Overview

The table library has been refactored into three distinct layers:

1. **Core Engine** - Framework-agnostic manager classes
2. **Rendering Engine** - Direct DOM manipulation
3. **Framework Adapters** - Thin wrappers for specific frameworks

## Architecture Layers

### Layer 1: Core Engine (Framework-Agnostic)

All business logic is extracted into manager classes that are completely framework-agnostic:

#### TableManager
Main orchestrator that coordinates all other managers.

```typescript
import { TableManager } from './managers/TableManager';

const tableManager = new TableManager({
  headers: [...],
  rows: [...],
  rowHeight: 40,
  customTheme: DEFAULT_CUSTOM_THEME,
});

// Subscribe to state changes
tableManager.subscribe(() => {
  // Re-render your UI
});

// Clean up
tableManager.destroy();
```

#### SortManager
Manages sorting state and logic.

```typescript
const sortManager = tableManager.sortManager;

// Sort by column
sortManager.updateSort({ accessor: 'name', direction: 'asc' });

// Clear sort
sortManager.updateSort();

// Get current state
const { sort, sortedRows } = sortManager.getState();
```

#### FilterManager
Manages filtering state and logic.

```typescript
const filterManager = tableManager.filterManager;

// Apply filter
filterManager.updateFilter({
  accessor: 'age',
  operator: 'greaterThan',
  value: 25,
});

// Clear filter
filterManager.clearFilter('age');

// Clear all filters
filterManager.clearAllFilters();

// Get current state
const { filters, filteredRows } = filterManager.getState();
```

#### RowManager
Handles row grouping, expansion, aggregation, and flattening.

```typescript
const rowManager = tableManager.rowManager;

// Set expanded rows
rowManager.setExpandedRows(new Map([['row-1', 1]]));

// Set collapsed rows
rowManager.setCollapsedRows(new Map([['row-2', 1]]));

// Get current state
const state = rowManager.getState();
const { aggregatedRows, flattenedRows, heightOffsets } = state;
```

#### ColumnManager
Manages column visibility, reordering, resizing, and collapsing.

```typescript
const columnManager = tableManager.columnManager;

// Toggle column collapse
columnManager.toggleColumnCollapse('columnAccessor');

// Set column visibility
columnManager.setColumnVisibility('columnAccessor', false);

// Update column width
columnManager.updateColumnWidth('columnAccessor', 200);

// Reorder columns
columnManager.reorderColumns(newHeadersArray);
```

#### DimensionManager
Handles table dimensions and virtualization calculations.

```typescript
const dimensionManager = tableManager.dimensionManager;

// Get dimensions
const { containerWidth, calculatedHeaderHeight, maxHeaderDepth, contentHeight } = 
  dimensionManager.getState();
```

#### ScrollManager
Manages scroll synchronization and infinite scroll.

```typescript
const scrollManager = tableManager.scrollManager;

// Handle scroll event
scrollManager.handleScroll(scrollTop, scrollLeft, containerHeight, contentHeight);

// Get scroll state
const { scrollTop, scrollLeft, scrollDirection, isScrolling } = 
  scrollManager.getState();
```

#### SelectionManager
Manages cell, column, and row selection (already refactored).

```typescript
const selectionManager = tableManager.selectionManager;

// Select cell
selectionManager.selectCell({ rowIndex: 0, colIndex: 1, rowId: 'row-1' });

// Select column
selectionManager.selectColumn(2);

// Clear selection
selectionManager.clearSelection();
```

### Layer 2: Rendering Engine

The rendering engine uses direct DOM manipulation for performance:

#### TableRenderer
Coordinates header and body rendering.

```typescript
import { TableRenderer } from './renderers/TableRenderer';

const tableRenderer = new TableRenderer({
  tableManager,
  headerContainer: headerElement,
  bodyContainer: bodyElement,
});

// Render headers
tableRenderer.renderHeaders(container, absoluteCells, context, scrollLeft);

// Render body
tableRenderer.renderBody(container, cells, context, scrollLeft);

// Clean up
tableRenderer.destroy();
```

### Layer 3: Framework Adapters

#### React Adapter

```typescript
import { SimpleTableAdapter } from './adapters/react/SimpleTableAdapter';

function MyComponent() {
  return (
    <SimpleTableAdapter
      headers={headers}
      rows={rows}
      rowHeight={40}
      onSortChange={(sort) => console.log('Sort changed:', sort)}
      onFilterChange={(filters) => console.log('Filters changed:', filters)}
    />
  );
}
```

#### Vanilla JavaScript

```typescript
import { VanillaTable } from './adapters/vanilla/VanillaTableExample';

const container = document.getElementById('table-container');
const table = new VanillaTable(container, headers, rows);

// Sort
table.sort('name', 'asc');

// Update data
table.updateData(newRows);

// Clean up
table.destroy();
```

## Design Patterns

### Observer/Subscription Pattern

All managers implement a subscription pattern for state changes:

```typescript
class Manager {
  private subscribers: Set<StateChangeCallback> = new Set();

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb(this.state));
  }
}
```

This decouples the core logic from framework-specific reactivity systems.

### Configuration vs State

Clear separation:
- **Config** = Props passed from outside (headers, rows, callbacks)
- **State** = Internal state managed by managers (selection, filters, sort)

Managers receive config updates via `updateConfig()` and manage their own internal state.

### Lifecycle Management

All managers implement a `destroy()` method for cleanup:

```typescript
manager.destroy(); // Removes event listeners, clears subscriptions, etc.
```

## Migration Path

### Current State

- **Existing React hooks** have been updated to use managers internally
- **Backward compatibility** is maintained - existing code continues to work
- **New manager classes** can be used directly for framework-agnostic implementations

### Using Managers Directly

You can now use the managers directly without React:

```typescript
import { 
  TableManager, 
  SortManager, 
  FilterManager 
} from './managers';

// Create manager
const tableManager = new TableManager(config);

// Access sub-managers
tableManager.sortManager.updateSort({ accessor: 'name', direction: 'asc' });
tableManager.filterManager.updateFilter({ accessor: 'age', operator: 'equals', value: 25 });

// Subscribe to changes
const unsubscribe = tableManager.subscribe(() => {
  // Handle state change
});

// Clean up
unsubscribe();
tableManager.destroy();
```

## Benefits

1. **Framework Agnostic** - Core logic works with any framework
2. **Better Testing** - Test managers independently without React
3. **Better Performance** - Direct DOM manipulation where needed
4. **Smaller Bundle** - Users only import what they need
5. **Maintainability** - Clear separation of concerns
6. **Extensibility** - Easy to add new features to managers

## File Structure

```
src/
├── managers/              # Core business logic (framework-agnostic)
│   ├── TableManager.ts    # Main orchestrator
│   ├── SortManager.ts     # Sorting logic
│   ├── FilterManager.ts   # Filtering logic
│   ├── RowManager.ts      # Row grouping, expansion, flattening
│   ├── ColumnManager.ts   # Column visibility, reordering, resizing
│   ├── DimensionManager.ts # Dimensions and virtualization
│   ├── ScrollManager.ts   # Scroll synchronization
│   ├── SelectionManager.ts # Cell/column/row selection
│   └── index.ts           # Exports
├── renderers/             # DOM rendering (framework-agnostic)
│   ├── TableRenderer.ts   # Rendering coordinator
│   └── index.ts           # Exports
├── adapters/              # Framework adapters
│   ├── react/
│   │   └── SimpleTableAdapter.tsx
│   ├── vanilla/
│   │   └── VanillaTableExample.ts
│   └── index.ts
├── hooks/                 # React hooks (now thin wrappers)
│   ├── useSortableData.ts
│   ├── useFilterableData.ts
│   ├── useAggregatedRows.ts
│   └── useFlattenedRows.ts
├── components/            # React components (existing)
│   └── simple-table/
│       └── SimpleTable.tsx
├── utils/                 # Pure functions (framework-agnostic)
└── types/                 # TypeScript types (framework-agnostic)
```

## Next Steps

To fully migrate to the new architecture:

1. **Gradually update components** to use managers directly
2. **Create Vue/Svelte adapters** following the React adapter pattern
3. **Add comprehensive tests** for each manager
4. **Update documentation** with migration guides
5. **Consider publishing separate packages** for core vs adapters

## Examples

See the following files for usage examples:
- React: `src/adapters/react/SimpleTableAdapter.tsx`
- Vanilla JS: `src/adapters/vanilla/VanillaTableExample.ts`
- Managers: `src/managers/` directory
