export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  titleLink?: string;
  description: string;
  changes: {
    type: "feature" | "improvement" | "bugfix" | "breaking";
    description: string;
    link?: string;
  }[];
}

export const v4_2_1: ChangelogEntry = {
  version: "4.2.1",
  date: "2026-08-28",
  title: "Settings update while the table is on the page",
  description:
    "Changing props after the table is already showing now updates what you see, including column editor text when you switch languages.",
  changes: [
    {
      type: "bugfix",
      description:
        "Switching languages now updates the column editor button, search placeholder, and Reset columns label, not only the headers and editor row names.",
      link: "/docs/column-visibility",
    },
    {
      type: "feature",
      description:
        "New resetText option on columnEditorConfig. Set the label on the Reset columns button, for example when you localize the editor.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description:
        "Changing className, columnBorders, hideHeader, or hideFooter now updates the table that is already on the page.",
    },
    {
      type: "bugfix",
      description:
        "Turning on header editing, column dragging, or column resizing after the table is on the page now adds those controls. Turning them off removes them.",
      link: "/docs/column-reordering",
    },
    {
      type: "bugfix",
      description:
        "Turning pin controls on or off in the column editor, changing the editor row layout, or passing new icons now updates the table that is already on the page.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description:
        "With autoExpandColumns and more than one pinned column, dragging an earlier pinned column wider now grows that column. Before, only the last pinned column next to the main grid would widen.",
      link: "/docs/column-width",
    },
  ],
};

export const v4_2_0: ChangelogEntry = {
  version: "4.2.0",
  date: "2026-08-26",
  title: "Column changes stay in sync",
  description:
    "When you change a column after the table is on the page, such as when you switch languages, headers, cells, filters, and the column editor now follow the new settings.",
  changes: [
    {
      type: "bugfix",
      description:
        "Changing a column label now updates the names in the column editor, not only the table headers.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description:
        "Changing a column tooltip, formatter, custom cell, filter settings, sort, or alignment now updates the table that is already on the page.",
    },
  ],
};

export const v4_1_9: ChangelogEntry = {
  version: "4.1.9",
  date: "2026-08-24",
  title: "Headers stay in sync",
  description:
    "Column headers now pick up new names, and custom headers stay filled after you pin a column again.",
  changes: [
    {
      type: "bugfix",
      description:
        "Changing a column label, such as when you switch languages, now updates the header as well as the cells.",
    },
    {
      type: "bugfix",
      description:
        "Unpinning a column and pinning it again no longer leaves a custom header blank.",
      link: "/docs/header-renderer",
    },
  ],
};

export const v4_1_8: ChangelogEntry = {
  version: "4.1.8",
  date: "2026-08-22",
  title: "Modern Black theme",
  description:
    "A new dark theme with near-black surfaces, thin borders, and the Simple Table blue.",
  changes: [
    {
      type: "feature",
      description:
        "New modern-black theme. Near-black background, hairline borders, and the Simple Table blue for selection and charts",
      link: "/docs/themes",
    },
    {
      type: "bugfix",
      description:
        "Auto-width columns now leave room for the sort arrow before you sort, so the header label doesn't get cut off on the first click.",
      link: "/docs/column-width#content-fit-auto",
    },
    {
      type: "bugfix",
      description:
        "Auto-width columns that can be filtered now leave room for the filter icon even when that column is scrolled out of view.",
      link: "/docs/column-width#content-fit-auto",
    },
    {
      type: "bugfix",
      description:
        "Search boxes and other inputs inside the table now use the theme text color instead of staying black.",
    },
  ],
};

export const v4_1_7: ChangelogEntry = {
  version: "4.1.7",
  date: "2026-08-16",
  title: "Smoother column dragging",
  description:
    "When you drag a column to a new place, the other columns slide over instead of jumping. Hide, pin, and multiple tables on one page also stay independent of each other.",
  changes: [
    {
      type: "improvement",
      description:
        "Dragging a column now slides the headers and the cells under them into their new places as you drag.",
      link: "/docs/column-reordering",
    },
    {
      type: "improvement",
      description:
        "Dragging a column now drops it into the new spot and shifts the columns in between, instead of swapping with only the column you drop on.",
      link: "/docs/column-reordering",
    },
    {
      type: "improvement",
      description:
        "The column you are dragging stays highlighted. Neighboring headers stay see-through so labels don't cover each other as they pass.",
    },
    {
      type: "bugfix",
      description: "Header tooltips no longer appear while you drag a column.",
      link: "/docs/tooltips",
    },
    {
      type: "bugfix",
      description:
        "If you put more than one table on a page, including a nested table, each one keeps its own selection, filter menus, editors, and column widths.",
    },
    {
      type: "bugfix",
      description:
        "Hiding or pinning a column no longer changes the column objects you passed in. Two tables can share the same columns list without one affecting the other.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description: "Table styles no longer change the text color of inputs outside the table.",
    },
  ],
};

export const v4_1_6: ChangelogEntry = {
  version: "4.1.6",
  date: "2026-08-08",
  title: "Pivot panel in the column editor",
  description:
    "You can now build a pivot from the column editor side panel, and multiple row fields show as normal rows instead of nested expand groups.",
  changes: [
    {
      type: "feature",
      description:
        "New enablePivotPanel option. Open the column editor to move fields into Rows, Columns, and Values, pick how numbers are totaled, and see the table update right away.",
      link: "/docs/pivot",
    },
    {
      type: "improvement",
      description:
        "If you put more than one field in Rows (for example Quarter and Product), the table shows a full row for each pair — not a collapsed group you have to expand.",
      link: "/docs/pivot",
    },
    {
      type: "improvement",
      description:
        "Pivot panel text, buttons, and dropdowns match the size and look of the rest of the column editor.",
    },
  ],
};

export const v4_1_5: ChangelogEntry = {
  version: "4.1.5",
  date: "2026-08-08",
  title: "Vue data updates and custom headers",
  description:
    "Vue tables now pick up new rows and columns after first render, and custom header UI stays as you left it when you sort or filter.",
  changes: [
    {
      type: "bugfix",
      description:
        "Vue: changing rows, columns, or handlers after the table first appears now updates the table instead of keeping the first data.",
    },
    {
      type: "bugfix",
      description:
        "Vue, Solid, Angular, and Svelte: custom header UI no longer resets when you sort or filter. Open menus and toggles stay as they were.",
    },
    {
      type: "improvement",
      description:
        "Vue, Solid, Angular, and Svelte: columns that size to their content update correctly after custom cells or headers load, including when loading finishes.",
    },
  ],
};

export const v4_1_4: ChangelogEntry = {
  version: "4.1.4",
  date: "2026-08-06",
  title: "Style a whole column",
  description: "Add a cellClass option on a column to style every cell in that column.",
  changes: [
    {
      type: "feature",
      description: "New cellClass on a column applies a CSS class to every body cell in that column.",
      link: "/docs/themes",
    },
  ],
};

export const v4_1_3: ChangelogEntry = {
  version: "4.1.3",
  date: "2026-08-05",
  title: "Pin from the column editor",
  description:
    "Pinning or unpinning a column in the column editor now moves it to the right list even if column order stays the same.",
  changes: [
    {
      type: "bugfix",
      description:
        "Pinning or unpinning a column in the column editor now moves that row into the left, middle, or right list even when the overall column order does not change.",
      link: "/docs/column-pinning",
    },
  ],
};

export const v4_1_2: ChangelogEntry = {
  version: "4.1.2",
  date: "2026-08-01",
  title: "Angular import fix and Svelte 5",
  description:
    "Angular apps can import the table without a standalone-component error, and the Svelte package now works cleanly with Svelte 5 and TypeScript.",
  changes: [
    {
      type: "bugfix",
      description:
        "Angular 19+ apps can import the table in a standalone app without a compiler error about standalone components.",
    },
    {
      type: "bugfix",
      description:
        "Svelte: TypeScript now finds the SimpleTable types when you install the package.",
    },
    {
      type: "breaking",
      description: "Svelte: the table now requires Svelte 5 or newer.",
    },
  ],
};

export const v4_1_1: ChangelogEntry = {
  version: "4.1.1",
  date: "2026-07-29",
  title: "Row styles, grouping alignment, and column editor clicks",
  description:
    "Style whole rows from your data, keep grouped row labels lined up, and make column-editor checkboxes respond on the first click.",
  changes: [
    {
      type: "feature",
      description:
        "New getRowClass option lets you add CSS classes to a row from its data — for example to highlight a search match.",
      link: "/docs/themes",
    },
    {
      type: "bugfix",
      description:
        "In row grouping, rows that cannot expand now line up with rows that can, instead of sitting indented differently.",
      link: "/docs/row-grouping",
    },
    {
      type: "bugfix",
      description:
        "Nested checkboxes in the column editor on large tables now toggle on the first click.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description:
        "Hiding and showing columns quickly no longer leaves leftover slide animations, especially on pinned columns.",
      link: "/docs/column-visibility",
    },
  ],
};

export const v4_1_0: ChangelogEntry = {
  version: "4.1.0",
  date: "2026-07-28",
  title: "Partial column-group checkboxes",
  description:
    "In the column editor, a group checkbox shows a minus when only some of its columns are visible.",
  changes: [
    {
      type: "feature",
      description:
        "Group checkboxes in the column editor can be empty, mixed (minus mark), or fully checked when every child column is visible.",
      link: "/docs/column-visibility",
    },
    {
      type: "improvement",
      description:
        "Clicking a mixed group checkbox shows every column in that group, instead of snapping back to mixed.",
    },
    {
      type: "bugfix",
      description:
        "React: custom column-editor rows keep tooltips and other local UI when the list refreshes.",
      link: "/docs/column-visibility",
    },
    {
      type: "bugfix",
      description:
        "Sticky headers stay opaque while you scroll, so rows no longer show through them (most noticeable on the modern-light theme).",
    },
  ],
};

export const v4_0_9: ChangelogEntry = {
  version: "4.0.9",
  date: "2026-07-26",
  title: "TypeScript knows your row shape",
  description:
    "You can tell TypeScript what a row looks like. Column settings, table helpers, and nested tables then know your fields. Existing untyped code still works.",
  changes: [
    {
      type: "feature",
      description:
        "Column definitions, table props, helpers, and cell/header functions can take your row type. Works in React, Solid, Vue, Svelte, Angular, and vanilla. If you skip the type, nothing changes.",
    },
    {
      type: "feature",
      description:
        "getVisibleRows() and getAllRows() now return your row type, so you do not need to cast.",
    },
    {
      type: "improvement",
      description:
        "Live updates, filters, pivot, and row grouping autocomplete column names from your row type.",
    },
    {
      type: "bugfix",
      description:
        "A nested table can use a different row type than the parent table, without extra casts.",
    },
    {
      type: "improvement",
      description:
        "Filter and date pickers match the table's compact or roomy spacing. Calendar clipping and picking a month or year in the cell editor are fixed.",
    },
  ],
};

export const v4_0_8: ChangelogEntry = {
  version: "4.0.8",
  date: "2026-07-26",
  title: "Sharper default icons",
  description:
    "Sort, filter, expand, pagination, checkbox, and select icons are redrawn so they look the same size and stay sharp.",
  changes: [
    {
      type: "improvement",
      description:
        "Built-in header icons are a matching set (the filter icon is a stack of bars). They follow the table text color.",
      link: "/docs/custom-icons",
    },
    {
      type: "improvement",
      description:
        "Checkboxes, select menus, the column-editor drag handle, pagination, and date-picker arrows use the same icon style.",
    },
  ],
};

export const v4_0_7: ChangelogEntry = {
  version: "4.0.7",
  date: "2026-07-25",
  title: "No flash behind the table when you overscroll",
  description:
    "Pulling past the top or bottom of the table no longer flashes the page through empty gaps.",
  changes: [
    {
      type: "bugfix",
      description:
        "When you scroll past the first or last row, the table background stays solid instead of showing whatever is behind it.",
    },
  ],
};

export const v4_0_6: ChangelogEntry = {
  version: "4.0.6",
  date: "2026-07-25",
  title: "Update a cell by row id",
  description:
    "Live updates can find a row by its id, even after you sort or filter, instead of only by position in the original list.",
  changes: [
    {
      type: "feature",
      description:
        "updateData now accepts rowId (from getRowId) as well as rowIndex. If you pass both, rowId is used. Updates still hit the right row after sort or filter.",
      link: "/docs/live-updates",
    },
  ],
};

export const v4_0_5: ChangelogEntry = {
  version: "4.0.5",
  date: "2026-07-22",
  title: "Clearer names for props and types",
  titleLink: "/migrations/v4-0-5",
  description:
    "Several props and types have new names. You need to update your app to the new names.",
  changes: [
    {
      type: "breaking",
      description:
        "Renamed: defaultHeaders → columns, HeaderObject / *HeaderObject → ColumnDef / *ColumnDef, editColumns → enableColumnEditor, shouldPaginate → enablePagination, onGridReady → onTableReady, useHoverRowBackground / useOdd* → hoverRowBackground / odd*, and isSortable / isEditable / isEssential → sortable / editable / essential (including values you read back from columns).",
      link: "/migrations/v4-0-5",
    },
  ],
};

export const v4_0_3: ChangelogEntry = {
  version: "4.0.3",
  date: "2026-07-21",
  title: "Hidden columns and custom footers",
  description:
    "Columns with excludeFromRender no longer take up space, and custom footers can refresh when something outside the table changes.",
  changes: [
    {
      type: "bugfix",
      description:
        "Columns with excludeFromRender: true no longer leave a gap, shove neighbors after a resize, or take space from flexible columns. They are skipped the same way as hidden columns, including in pinned areas.",
      link: "/docs/column-visibility",
    },
    {
      type: "feature",
      description:
        "New footerRenderKey refreshes a custom footer when outside state changes (for example a loading flag), without rewriting the footer function. Updating rows also refreshes the footer even if the row count stays the same.",
      link: "/docs/footer-renderer",
    },
  ],
};

export const v4_0_1: ChangelogEntry = {
  version: "4.0.1",
  date: "2026-07-20",
  title: "Loading rows appear under existing data",
  description:
    "When isLoading is true and rows are already on screen, placeholder rows appear underneath instead of wiping the whole table.",
  changes: [
    {
      type: "improvement",
      description:
        "isLoading keeps existing rows visible and adds skeleton rows below. An empty table still shows a full skeleton page. Clear the rows if you want a full reload. Useful for pagination and infinite scroll.",
      link: "/docs/loading-state",
    },
  ],
};

export const v4_0_0: ChangelogEntry = {
  version: "4.0.0",
  date: "2026-07-20",
  title: "Pivot tables and sticky group headers after sort",
  description:
    "Turn flat rows into a pivot with the pivot prop. Grouped parent rows stay correct after you sort.",
  changes: [
    {
      type: "feature",
      description:
        "New pivot prop and helpers (setPivot, getPivot, getPivotHeaders, getPivotedRows). Turn a flat list into rows, columns, totals, and nested headers — no drag-and-drop panel required.",
      link: "/docs/pivot",
    },
    {
      type: "bugfix",
      description:
        "In row grouping, sticky parent rows now show the right group after you sort or reorder, instead of keeping an old label while you scroll.",
      link: "/docs/row-grouping",
    },
  ],
};

export const v3_9_9: ChangelogEntry = {
  version: "3.9.9",
  date: "2026-07-15",
  title: "Show every row and column if you want",
  description: "Turn off on-screen-only drawing with one prop, and fix empty loading placeholders.",
  changes: [
    {
      type: "feature",
      description:
        "New enableVirtualization (default true). Set it to false to draw every row and column, while height and maxHeight still work.",
    },
    {
      type: "bugfix",
      description:
        "When isLoading is true and there are no rows, every placeholder row shows a skeleton. Before, they could share the same getRowId (for example \"undefined\") so only the first row looked like a skeleton.",
      link: "/docs/loading-state",
    },
  ],
};

export const v3_9_8: ChangelogEntry = {
  version: "3.9.8",
  date: "2026-07-14",
  title: "New column objects every render",
  description: "The table stays stable if you rebuild columns or copy rows on every render.",
  changes: [
    {
      type: "bugfix",
      description:
        "Rebuilding columns or copying rows on every render no longer flickers header menus or breaks column resizing.",
    },
    {
      type: "bugfix",
      description:
        "Live cell updates now follow filters and sort — rows hide, show, or reorder when an updated value no longer matches.",
      link: "/docs/live-updates",
    },
  ],
};

export const v3_9_7: ChangelogEntry = {
  version: "3.9.7",
  date: "2026-07-11",
  title: "selectableColumns works again",
  description: "selectableColumns is back as its own prop.",
  changes: [
    {
      type: "bugfix",
      description: "The selectableColumns prop works again.",
    },
  ],
};

export const v3_9_6: ChangelogEntry = {
  version: "3.9.6",
  date: "2026-07-10",
  title: "Row selection modes and APIs",
  description: "Richer row selection modes, keyboard support, and TableAPI helpers.",
  changes: [
    {
      type: "bugfix",
      description: "Shift+Arrow now contracts cell ranges.",
    },
    {
      type: "feature",
      description:
        "Added rowSelectionMode (single | multiple), selectRowOnClick, and showRowSelectionColumn for flexible row selection UX.",
      link: "/docs/row-selection",
    },
    {
      type: "feature",
      description:
        "Keyboard support for row selection: Space toggles; Arrow/Home/End move focus (and selection in single mode); Shift expands ranges in multiple mode when selectableCells is off.",
      link: "/docs/row-selection",
    },
    {
      type: "feature",
      description:
        "TableAPI: getSelectedRows, getSelectedRowsData, getRow, selectRow, deselectRow, toggleRowSelection, clearRowSelection.",
      link: "/docs/row-selection",
    },
    {
      type: "bugfix",
      description:
        "Row expand arrows stay in sync when collapseAll() and expandDepth() run one after the other (for example Only Divisions).",
      link: "/docs/row-grouping",
    },
    {
      type: "bugfix",
      description:
        "Hovering a row no longer highlights the same rowId in other tables on the same page.",
    },
    {
      type: "bugfix",
      description:
        "Expandable columns in row-grouped tables now show and clear loading placeholders when isLoading turns on and off, instead of staying on old content or skeletons.",
      link: "/docs/row-grouping",
    },
  ],
};

export const v3_9_5: ChangelogEntry = {
  version: "3.9.5",
  date: "2026-07-10",
  title: "Full-width empty state",
  description: "The empty-table message fills the table width again.",
  changes: [
    {
      type: "bugfix",
      description:
        "Empty tables show a full-width empty message again, and still scroll horizontally when headers are too wide.",
    },
    {
      type: "bugfix",
      description:
        "Custom header UI (pins, popovers, and similar) no longer resets when you sort or filter.",
    },
    {
      type: "bugfix",
      description:
        "Auto-sized columns with custom cell layouts no longer stay too wide after data finishes loading.",
    },
  ],
};

export const v3_9_3: ChangelogEntry = {
  version: "3.9.3",
  date: "2026-07-08",
  title: "Empty table horizontal scroll",
  description: "Empty tables show a horizontal scrollbar when headers overflow.",
  changes: [
    {
      type: "bugfix",
      description:
        "Empty tables show the horizontal scrollbar when headers overflow, while the empty message stays full-width.",
    },
    {
      type: "bugfix",
      description:
        "Fixed body rows failing to remount after a filter briefly matched zero rows (e.g. typing a smart-filter negation).",
    },
    {
      type: "bugfix",
      description:
        "Column editor strip uses a pointer cursor across the full bar, and opening the popout no longer thins the table's right border along the sticky label.",
    },
    {
      type: "bugfix",
      description:
        "Double-click to fit a column no longer freezes React tables that use custom cells.",
    },
  ],
};

export const v3_9_2: ChangelogEntry = {
  version: "3.9.2",
  date: "2026-07-08",
  title: "Header menus close after sort",
  description: "Open tooltips and popovers in custom headers no longer stick around after you sort.",
  changes: [
    {
      type: "bugfix",
      description:
        "Tooltips and popovers in custom headers (for example Radix) now close after you sort, instead of staying open with no way to dismiss them.",
    },
    {
      type: "bugfix",
      description:
        '"auto" width now sizes collapsible headers correctly, reserves collapse-icon space, and shows the horizontal scrollbar when headers overflow an empty table.',
    },
    {
      type: "bugfix",
      description: '"auto" width no longer over-allocates for multi-line valueFormatter output.',
    },
    {
      type: "bugfix",
      description: "Fixed blank rows after resize and scrolling back up.",
    },
  ],
};

export const v3_9_1: ChangelogEntry = {
  version: "3.9.1",
  date: "2026-07-06",
  title: "Smoother layout while a sidebar animates",
  description: "The table waits until a container animation finishes before it resizes.",
  changes: [
    {
      type: "improvement",
      description:
        "If the table's container is animating (for example a collapsing sidebar), the table resizes once at the end instead of on every frame.",
    },
    {
      type: "bugfix",
      description:
        "Expanding a lazy-loaded group again no longer uses an old row, which used to cause extra fetches, loading flashes, and jumpy sibling rows.",
    },
  ],
};

export const v3_9_0: ChangelogEntry = {
  version: "3.9.0",
  date: "2026-07-05",
  title: "Sort animation while you are scrolled",
  description: "Sorting while scrolled no longer looks incomplete or jumpy.",
  changes: [
    {
      type: "bugfix",
      description: "Sorting while scrolled no longer slides empty spacer rows across the table.",
    },
    {
      type: "bugfix",
      description: "Pinned cells no longer go blank after you sort while scrolled.",
    },
    {
      type: "bugfix",
      description: "The first visible row now moves on sort like the other rows.",
    },
  ],
};

export const v3_8_9: ChangelogEntry = {
  version: "3.8.9",
  date: "2026-07-04",
  title: "Columns no longer get squeezed",
  description: "autoExpandColumns keeps columns readable when space runs out.",
  changes: [
    {
      type: "improvement",
      description:
        "With autoExpandColumns, columns still stretch to fill extra space, but when there isn't enough room they keep their size and the table scrolls sideways instead of squishing them.",
      link: "/docs/column-width",
    },
  ],
};

export const v3_8_7: ChangelogEntry = {
  version: "3.8.7",
  date: "2026-07-01",
  title: "Bug fixes",
  description: "Chart rendering improvements and assorted bug fixes.",
  changes: [
    {
      type: "improvement",
      description: "Bar and line charts render crisper.",
      link: "/docs/chart-columns",
    },
    {
      type: "bugfix",
      description:
        "The expandable column in row-grouped tables now shows a loading skeleton while isLoading is true, instead of staying blank.",
    },
    {
      type: "bugfix",
      description:
        "resetColumns() resets to the configured column definitions instead of the table's mount-time state, so resets are consistent across sessions.",
    },
    {
      type: "bugfix",
      description:
        "If you change a handler like onSortChange after the table first appears, the table uses the new handler.",
    },
    {
      type: "bugfix",
      description:
        '"auto" width measures custom headerRenderer content instead of falling back to a default width.',
    },
    {
      type: "bugfix",
      description:
        '"auto" width reserves space for the sort icon, so sorted headers no longer clip.',
    },
    {
      type: "bugfix",
      description:
        '"auto" width measures custom cell content at its natural size, so cells that clip long text no longer make the column too narrow. Use maxWidth if you want a cap and truncation.',
      link: "/docs/column-width#content-fit-auto",
    },
    {
      type: "bugfix",
      description:
        '"auto" widths are computed from content only — the same columns and data produce the same widths regardless of container size or scroll position.',
    },
    {
      type: "bugfix",
      description:
        '"auto" width falls back to the header label when a custom headerRenderer can\'t be measured in an empty table, so headers stay readable instead of collapsing.',
    },
  ],
};

export const v3_8_6: ChangelogEntry = {
  version: "3.8.6",
  date: "2026-06-28",
  title: "Bug fixes",
  description: "Column editor improvements.",
  changes: [
    {
      type: "improvement",
      description: "Sticky column editor label.",
    },
    {
      type: "bugfix",
      description:
        "Collapsing a column group no longer animates unrelated columns, and multiple groups can stay collapsed at once.",
    },
    {
      type: "bugfix",
      description: "Fixed empty cells after sorting.",
    },
  ],
};

export const v3_8_5: ChangelogEntry = {
  version: "3.8.5",
  date: "2026-06-27",
  title: "Bug fixes",
  description: "Fixes for tables that scroll with the page.",
  changes: [
    {
      type: "bugfix",
      description:
        "When the page or another box scrolls the table, rows now appear correctly as you scroll.",
    },
    {
      type: "bugfix",
      description: "Clicking sort many times in a row no longer breaks animations.",
    },
    {
      type: "improvement",
      description: "Smoother sort animations when the page scrolls the table.",
    },
    {
      type: "bugfix",
      description: "Live updates start working again after you click sort many times.",
    },
  ],
};

export const v3_8_4: ChangelogEntry = {
  version: "3.8.4",
  date: "2026-06-27",
  title: "Bug fixes",
  description: "Scroll, wide tables, and render bug fixes.",
  changes: [
    {
      type: "bugfix",
      description: "A table with maxHeight can still scroll when server-side rows are empty.",
    },
    {
      type: "bugfix",
      description: "Custom footers load the right page when you use server-side pagination.",
    },
    {
      type: "bugfix",
      description: "Wide tables only draw columns you can see, instead of every column.",
    },
    {
      type: "bugfix",
      description:
        "If the scroll parent isn't ready when the table first appears, the table still picks it up.",
    },
    {
      type: "bugfix",
      description: "When the page scrolls the table, the first screen of rows fills in correctly.",
    },
    {
      type: "improvement",
      description: "The table does less work when cell data hasn't changed.",
    },
    {
      type: "feature",
      description: "Limit which filter operators a column offers.",
    },
    {
      type: "bugfix",
      description: "toggleColumnEditor() closes the editor if it is already open.",
    },
  ],
};

export const v3_8_3: ChangelogEntry = {
  version: "3.8.3",
  date: "2026-06-25",
  title: "Bug fixes",
  description: "Old cell content and calc() height fixes.",
  changes: [
    {
      type: "bugfix",
      description: "Old cell content no longer stays on screen after data changes.",
    },
    {
      type: "bugfix",
      description: "maxHeight set with CSS calc() now scrolls correctly.",
    },
  ],
};

export const v3_8_1: ChangelogEntry = {
  version: "3.8.1",
  date: "2026-06-23",
  title: "Bug fixes",
  description: "Layout, auto-size, and cell interaction bug fixes.",
  changes: [
    {
      type: "bugfix",
      description: "Export-only columns no longer add extra empty horizontal scroll.",
    },
    {
      type: "bugfix",
      description: "Auto-expand no longer leaves space with collapsed groups.",
    },
    {
      type: "bugfix",
      description: "Clicks on links and buttons inside cells now work.",
    },
    {
      type: "bugfix",
      description: "The header row still appears if the table starts with no columns.",
    },
    {
      type: "bugfix",
      description: '"auto" columns now size per page when paginating.',
    },
  ],
};

export const v3_8_0: ChangelogEntry = {
  version: "3.8.0",
  date: "2026-06-22",
  title: 'Auto-size columns (width: "auto")',
  description: 'Added width: "auto" for content-fit columns.',
  changes: [
    {
      type: "feature",
      description: 'Added width: "auto" to size columns to their content.',
    },
  ],
};
export const v3_7_3: ChangelogEntry = {
  version: "3.7.3",
  date: "2026-06-13",
  title: "License changes",
  description: "License changes.",
  changes: [
    {
      type: "improvement",
      description: "License changes.",
    },
  ],
};
export const v3_7_2: ChangelogEntry = {
  version: "3.7.2",
  date: "2026-06-13",
  title: "Scroll fix",
  description: "Scroll fix.",
  changes: [
    {
      type: "bugfix",
      description: "Mobile horizontal scroll fix.",
    },
  ],
};
export const v3_7_1: ChangelogEntry = {
  version: "3.7.1",
  date: "2026-06-13",
  title: "General improvements",
  description: "General improvements.",
  changes: [
    {
      type: "bugfix",
      description: "General improvements",
    },
  ],
};
export const v3_7_0: ChangelogEntry = {
  version: "3.7.0",
  date: "2026-06-13",
  title: "ARIA row ownership fixes",
  description: "ARIA row ownership fixes.",
  changes: [
    {
      type: "bugfix",
      description: "Accessibility improvements",
    },
  ],
};

export const v3_6_8: ChangelogEntry = {
  version: "3.6.8",
  date: "2026-06-13",
  title: "Bug fixes",
  description: "Bug fixes.",
  changes: [
    {
      type: "bugfix",
      description: "Bug fixes.",
    },
  ],
};

export const v3_6_4: ChangelogEntry = {
  version: "3.6.4",
  date: "2026-06-08",
  title: "Animation improvements",
  description: "Row motion works when the footer sits above the table, and custom headers render correctly.",
  changes: [
    {
      type: "improvement",
      description:
        "Row and column motion works when the footer is above the table (footerPosition: \"top\").",
    },
    {
      type: "bugfix",
      description: "Custom header content renders correctly.",
    },
  ],
};

export const v3_6_3: ChangelogEntry = {
  version: "3.6.3",
  date: "2026-05-31",
  title: "footerPosition prop",
  description:
    'New footerPosition prop renders the pagination footer (built-in or footerRenderer) above the table body when set to "top".',
  changes: [
    {
      type: "feature",
      description:
        'New footerPosition prop ("top" | "bottom", default "bottom") controls placement of the pagination footer.',
      link: "/docs/footer-renderer",
    },
    {
      type: "feature",
      description:
        "Every row gets a st-row-position-{n} class (body, empty/loading rows, and nested tables), so you can style a specific row in CSS — for example .st-row-position-3 { ... }.",
    },
  ],
};

export const v3_6_2: ChangelogEntry = {
  version: "3.6.2",
  date: "2026-05-16",
  title: "Sticky group headers when the page scrolls",
  description:
    "enableStickyParents now works with scrollParent. Grouped parent rows stay under the header as you scroll past their children, instead of sliding away. The warning from 3.6.0 is gone.",
  changes: [
    {
      type: "feature",
      description:
        "You can use enableStickyParents with scrollParent. Grouped parent rows stay under the sticky header when the page (or another box) scrolls the table.",
      link: "/docs/infinite-scroll",
    },
    {
      type: "improvement",
      description:
        "No more console warning when enableStickyParents and scrollParent are used together.",
    },
  ],
};

export const v3_6_0: ChangelogEntry = {
  version: "3.6.0",
  date: "2026-05-15",
  title: "Scroll with the page",
  description:
    "New scrollParent prop lets the table grow to its natural height inside the page or another scroll box. That parent’s scroll loads rows and can fire onLoadMore. The header sticks to the top of that box.",
  changes: [
    {
      type: "feature",
      description:
        'New scrollParent prop (HTMLElement | "window" | () => HTMLElement | null). Use it when you do not set height or maxHeight; the parent’s scroll loads rows as you move.',
      link: "/docs/infinite-scroll",
    },
    {
      type: "feature",
      description:
        "With scrollParent, onLoadMore fires based on how close the bottom of the table is to the parent’s scroll position.",
      link: "/docs/infinite-scroll",
    },
    {
      type: "feature",
      description:
        "New infiniteScrollThreshold prop (default 200px) is how close to the bottom onLoadMore fires.",
      link: "/docs/infinite-scroll",
    },
    {
      type: "feature",
      description:
        "In scrollParent mode, the header sticks to the top of the parent. Extra padding at the top of the parent is accounted for.",
      link: "/docs/infinite-scroll",
    },
    {
      type: "improvement",
      description:
        "Pulling past the edge of the scroll parent no longer rubber-bands the sticky header out of place. Normal overscroll returns when the table unmounts.",
    },
    {
      type: "improvement",
      description:
        "enableStickyParents does nothing and logs a warning if you also set scrollParent (they could not work together yet; this was fixed in 3.6.2).",
    },
  ],
};

export const v3_5_3: ChangelogEntry = {
  version: "3.5.3",
  date: "2026-05-09",
  title: "Pinned columns and auto-expand resize",
  description:
    "Nested pinned headers, dragging to resize auto-expand columns, and width limits now match what you see.",
  changes: [
    {
      type: "bugfix",
      description:
        "Dragging a nested header under a pinned parent treats it as pinned, like the parent.",
    },
    {
      type: "bugfix",
      description:
        "Resizing auto-expand columns uses the widths on screen, so the drag matches the layout.",
    },
    {
      type: "bugfix",
      description:
        "Auto-expand width limits use the real pinned and main areas, and only cap growth when that area actually gets wider.",
    },
  ],
};

export const v3_5_2: ChangelogEntry = {
  version: "3.5.2",
  date: "2026-05-03",
  title: "Animation improvements & fixes",
  description: "Animation polish and scroll/layout bug fixes.",
  changes: [
    {
      type: "improvement",
      description: "Row grouping expand/collapse animates row heights instead of snapping.",
    },
    {
      type: "improvement",
      description:
        "Hiding and showing columns, and pinning or unpinning, now slides sideways. Reordering columns still slides neighbors into place.",
    },
    {
      type: "improvement",
      description: "Scroll fast path keeps row separators in sync with cells—no visual lag.",
    },
    {
      type: "bugfix",
      description:
        "Nested tables: unstable keys broke slide animations after sort/sibling expand; expand chevrons could toggle wrong row after sort—stable keys + live DOM refs.",
    },
    {
      type: "bugfix",
      description:
        "Nested-row expansion shifted rows vertically but separators cached only flatten index—stuck wrong until another redraw.",
    },
    {
      type: "bugfix",
      description:
        "Pinned-left body was appended after main in flex—pinned cells sat past the viewport; fixes DOM insert order for left/main/right.",
    },
    {
      type: "bugfix",
      description:
        "Pinned viewport width missing from render cache—separators/layout could mismatch the pinned strip.",
    },
    {
      type: "bugfix",
      description:
        "Scrollbar gutter measured on wrong element misaligned header filler; header height no longer adds stray border padding.",
    },
    {
      type: "bugfix",
      description:
        "Sticky overlay blocked clicks; sticky column indices didn’t match virtualized body cells—selection drifted.",
    },
    {
      type: "bugfix",
      description: "Fast hovers stacked tooltip timeouts—duplicate/stray header tooltips.",
    },
    {
      type: "bugfix",
      description:
        "Selection used stale col/row indices after hide/reorder; header aria-colindex now matches body columns.",
    },
  ],
};

export const v3_4_2: ChangelogEntry = {
  version: "3.4.2",
  date: "2026-04-26",
  title: "Horizontal Scrollbar Bug Fixes",
  description: "Horizontal scrollbar bug fixes.",
  changes: [
    {
      type: "bugfix",
      description: "Horizontal scrollbar bug fixes.",
    },
  ],
};
export const v3_4_0: ChangelogEntry = {
  version: "3.4.0",
  date: "2026-04-26",
  title: "Animations",
  description: "Animations added to Simple Table.",
  changes: [
    {
      type: "feature",
      description: "Animations added to Simple Table.",
      link: "/docs/animations",
    },
  ],
};

export const v3_0_0: ChangelogEntry = {
  version: "3.0.0",
  date: "2026-03-29",
  title: "Framework Adapters & Column Virtualization",
  titleLink: "/migrations/v3",
  description:
    "Major release: simple-table-core is now a framework-agnostic plain JavaScript engine. React, Vue, Angular, Svelte, and Solid each have dedicated npm adapter packages. Also introduces column virtualization for tables with many columns.",
  changes: [
    {
      type: "breaking",
      description:
        "Import from @simple-table/react (or /vue, /angular, /svelte, /solid) instead of simple-table-core",
    },
    {
      type: "breaking",
      description: "simple-table-core is now plain JS — no framework components exported",
    },
    {
      type: "feature",
      description: "Column virtualization for tables with many columns",
    },
    {
      type: "improvement",
      description: "Framework-agnostic core with dedicated adapters for each framework",
    },
  ],
};

export const v3_0_4: ChangelogEntry = {
  version: "3.0.10",
  date: "2026-04-12",
  title: "Bug fixes",
  description: "Bug fixes.",
  changes: [
    {
      type: "bugfix",
      description: "General bug fixes and improvements.",
    },
  ],
};

export const v2_6_3: ChangelogEntry = {
  version: "2.6.3",
  date: "2026-03-28",
  title: "Copy-paste bug fixes",
  description: "Fixed several bugs related to copy-paste behavior.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed copy-paste issues in table cells.",
    },
  ],
};

export const v2_6_2: ChangelogEntry = {
  version: "2.6.2",
  date: "2026-03-22",
  title: "Essential columns, pin layout API, and column editor pinning",
  description:
    "Essential columns, programmatic pin layout, column editor sections and customization.",
  changes: [
    {
      type: "feature",
      description:
        "columnEditorConfig.allowColumnPinning — hide L/R pin controls in the editor (default true)",
      link: "/docs/api-reference#column-editor-config",
    },
    {
      type: "feature",
      description: "ColumnDef.essential",
      link: "/docs/api-reference#column-def",
    },
    {
      type: "feature",
      description:
        "tableRef.getPinnedState and applyPinnedState for left / main / right accessor lists",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description: "icons.pinnedLeftIcon and icons.pinnedRightIcon for column editor pins",
      link: "/docs/custom-icons",
    },
    {
      type: "feature",
      description: "customRenderer: pinnedLeftList, unpinnedList, pinnedRightList plus listSection",
      link: "/docs/api-reference#column-editor-config",
    },
    {
      type: "feature",
      description:
        "rowRenderer: panelSection, essential, canToggleVisibility, allowColumnPinning, pinControl",
      link: "/docs/api-reference#column-editor-row-renderer-props",
    },
    {
      type: "improvement",
      description: "Default column editor can list left, main, and right sections when pins apply",
      link: "/docs/column-visibility",
    },
  ],
};

export const v2_5_7: ChangelogEntry = {
  version: "2.5.7",
  date: "2026-03-16",
  title: "No column table height bug fix",
  description:
    "Fixed a bug where the table height was not being calculated correctly when there were no columns.",
  changes: [
    {
      type: "bugfix",
      description:
        "Fixed a bug where the table height was not being calculated correctly when there were no columns.",
    },
  ],
};

export const v2_5_6: ChangelogEntry = {
  version: "2.5.6",
  date: "2026-03-09",
  title: "Column Editor Custom Renderer & Reset API",
  description: "Full control over column editor layout via customRenderer, plus resetColumns API",
  changes: [
    {
      type: "feature",
      description: "columnEditorConfig.customRenderer for full column editor layout control",
      link: "/docs/column-visibility#custom-renderer",
    },
    {
      type: "feature",
      description: "tableRef.resetColumns() restores default column order and visibility",
      link: "/docs/column-visibility#custom-renderer",
    },
    {
      type: "feature",
      description: "resetColumns callback in customRenderer for reset button without tableRef",
      link: "/docs/column-visibility#custom-renderer",
    },
    {
      type: "improvement",
      description: "columns is never mutated; table clones internally",
      link: "/docs/column-visibility",
    },
  ],
};

export const v2_5_3: ChangelogEntry = {
  version: "2.5.3",
  date: "2026-02-25",
  title: "Column Editor Row Customization",
  description: "Added rowRenderer to ColumnEditorConfig to customize column editor row layout",
  changes: [
    {
      type: "feature",
      description: "Added rowRenderer to ColumnEditorConfig to customize row component order",
      link: "/docs/column-visibility#custom-row-renderer",
    },
    {
      type: "feature",
      description: "Exported ColumnEditorRowRenderer types for TypeScript",
      link: "/docs/api-reference#column-editor-config",
    },
  ],
};

export const v2_5_0: ChangelogEntry = {
  version: "2.5.0",
  date: "2026-02-22",
  title: "Column Pinning & Resizing Improvements",
  description:
    "Major refactor of autoExpandColumns feature with enhanced column auto-sizing logic and fixed column resizing behavior with pinned columns and nested headers",
  changes: [
    {
      type: "bugfix",
      description: "Fixed column resizing when pinned sections reach max width",
      link: "/docs/column-pinning",
    },
    {
      type: "bugfix",
      description: "Fixed double-resize issue on chart columns",
      link: "/docs/chart-columns",
    },
    {
      type: "bugfix",
      description: "Fixed pinned columns behavior with nested headers",
      link: "/docs/column-pinning",
    },
    {
      type: "bugfix",
      description: "Fixed pinned columns compatibility with autoExpandColumns",
      link: "/docs/column-pinning",
    },
    {
      type: "improvement",
      description: "Enhanced column auto-sizing logic and constraints",
      link: "/docs/column-width",
    },
    {
      type: "improvement",
      description: "Improved resize behavior across pinned and main sections",
      link: "/docs/column-resizing",
    },
  ],
};

export const v2_4_8: ChangelogEntry = {
  version: "2.4.8",
  date: "2026-02-16",
  title: "Column Resizing Enhancements & Modern Themes",
  description:
    "New column width change callback, double-click auto-size, modern themes, and sticky row fixes",
  changes: [
    {
      type: "feature",
      description: "onColumnWidthChange callback fires when columns are resized or auto-sized",
      link: "/docs/column-resizing",
    },
    {
      type: "feature",
      description: "Double-click resize handles to auto-fit columns to content",
      link: "/docs/column-resizing",
    },
    {
      type: "feature",
      description: "Added modern-light and modern-dark themes with clean, minimal design",
      link: "/docs/themes",
    },
    {
      type: "bugfix",
      description: "Fixed hover effects on sticky parent rows",
      link: "/docs/row-grouping",
    },
    {
      type: "bugfix",
      description: "Fixed horizontal scrolling on sticky rows",
      link: "/docs/row-grouping",
    },
    {
      type: "bugfix",
      description: "Removed resize handle from last column when autoExpandColumns is enabled",
      link: "/docs/column-width",
    },
  ],
};

export const v2_4_4: ChangelogEntry = {
  version: "2.4.4",
  date: "2026-02-11",
  title: "Column Editor Improvements",
  description: "Column editor popout bug fix",
  changes: [
    {
      type: "bugfix",
      description: "Fixed a drag/drop bug in the column editor popout.",
    },
  ],
};

export const v2_4_3: ChangelogEntry = {
  version: "2.4.3",
  date: "2026-02-09",
  title: "Quick Filter / Global Search",
  description:
    "Added powerful global search functionality with quick filter support. Search across all columns with a single input, featuring both simple text matching and smart search modes with advanced operators.",
  changes: [
    {
      type: "feature",
      description:
        "Added quickFilter prop to enable global search across all columns with simple text matching mode",
      link: "/docs/quick-filter",
    },
    {
      type: "feature",
      description:
        "Added smart search mode with multi-word AND logic, phrase search (quotes), negation (minus sign), and column-specific search (column:value syntax)",
      link: "/docs/quick-filter",
    },
    {
      type: "feature",
      description:
        "Added QuickFilterConfig for controlling filter text, mode, case sensitivity, searchable columns, and onChange callbacks",
      link: "/docs/quick-filter",
    },
    {
      type: "feature",
      description:
        "Added tableRef.setQuickFilter() method for programmatic control of the quick filter text",
      link: "/docs/programmatic-control",
    },
    {
      type: "feature",
      description:
        "Added quickFilterable and quickFilterGetter properties to ColumnDef for customizing column behavior in quick filter",
      link: "/docs/api-reference#column-def",
    },
    {
      type: "feature",
      description:
        "Exported QuickFilterConfig, QuickFilterMode, QuickFilterGetter, and QuickFilterGetterProps types for TypeScript support",
      link: "/docs/api-reference",
    },
  ],
};

export const v2_4_2: ChangelogEntry = {
  version: "2.4.2",
  date: "2026-02-06",
  title: "Last row group bug fix",
  description: "Fixed a bug where the last row group was not being displayed correctly.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed a bug where the last row group was not being displayed correctly.",
      link: "/docs/row-grouping",
    },
  ],
};

export const v2_4_1: ChangelogEntry = {
  version: "2.4.1",
  date: "2026-02-06",
  title: "Enhanced Column Editor with Drag & Drop, Search, and Unified Icons API",
  titleLink: "/migrations/v2-4-1",
  description:
    "Major enhancement to the column editor with drag-and-drop column reordering, built-in search functionality, and a new unified icons API. Includes breaking changes to columnEditorPosition and deprecation of individual icon props in favor of a cleaner, more organized API.",
  changes: [
    {
      type: "feature",
      description:
        "Added drag-and-drop column reordering in the column editor with visual drop indicators",
    },
    {
      type: "feature",
      description:
        "Added built-in search functionality in the column editor with support for custom search functions",
    },
    {
      type: "feature",
      description:
        "Added columnEditorConfig prop to replace columnEditorText with more configuration options",
    },
    {
      type: "feature",
      description:
        "Added unified icons prop for configuring all table icons in one place (drag, expand, filter, sort, pagination, etc.)",
      link: "/docs/custom-icons",
    },
    {
      type: "improvement",
      description:
        "Improved column editor UI/UX with better spacing, sticky search bar, and text overflow handling",
    },
    {
      type: "improvement",
      description: "Added new CSS classes and variables for column editor styling",
      link: "/docs/custom-theme",
    },
    {
      type: "breaking",
      description: "Removed columnEditorPosition prop",
      link: "/docs/api-reference",
    },
    {
      type: "breaking",
      description:
        "Deprecated individual icon props (expandIcon, filterIcon, sortUpIcon, etc.) in favor of unified icons prop",
      link: "/docs/custom-icons",
    },
  ],
};

export const v2_4_0: ChangelogEntry = {
  version: "2.4.0",
  date: "2026-02-03",
  title: "Copy Functionality Fix with Row Selection",
  description:
    "Fixed a bug with the copy functionality when enableRowSelection is enabled. The copy feature now works correctly regardless of row selection state.",
  changes: [
    {
      type: "bugfix",
      description:
        "Fixed copy functionality bug when enableRowSelection is enabled. Copy operations now work correctly with row selection enabled.",
      link: "/docs/row-selection",
    },
  ],
};

export const v2_3_8: ChangelogEntry = {
  version: "2.3.8",
  date: "2026-01-31",
  title: "Sticky Parent Rows (Beta)",
  description:
    "Beta feature: Added enableStickyParents prop for sticky parent rows while scrolling through hierarchical data. When enabled, parent rows remain visible at the top while scrolling through their children.",
  changes: [
    {
      type: "feature",
      description:
        "Added enableStickyParents prop (beta) to make parent rows sticky while scrolling through their children in row grouping. Defaults to false. This is a beta feature and may have edge cases that need refinement.",
      link: "/docs/row-grouping",
    },
  ],
};

export const v2_3_1: ChangelogEntry = {
  version: "2.3.1",
  date: "2026-01-30",
  title: "Column Visibility API Methods",
  description:
    "Added powerful new API methods for programmatic control of column visibility and the column editor menu. Control which columns are visible and toggle the column editor UI programmatically.",
  changes: [
    {
      type: "feature",
      description:
        "Added toggleColumnEditor() method to programmatically open, close, or toggle the column editor menu. Call with true to open, false to close, or no argument to toggle.",
    },
    {
      type: "feature",
      description:
        "Added applyColumnVisibility() method to programmatically control which columns are visible. Pass a partial or complete visibility state object to show/hide specific columns. Perfect for implementing custom column visibility presets or views.",
    },
  ],
};

export const v2_3_0: ChangelogEntry = {
  version: "2.3.0",
  date: "2026-01-29",
  title: "Column Visibility Checkbox Logic Fix",
  description:
    "Fixed the column visibility checkbox logic in the column editing popout. The checkbox state now correctly represents whether a column is visible.",
  changes: [
    {
      type: "bugfix",
      description:
        "Fixed column visibility checkbox logic in the column editing popout. Checkboxes are now checked when columns are visible, and unchecked when hidden (previously was inverted).",
    },
  ],
};

export const v2_2_9: ChangelogEntry = {
  version: "2.2.9",
  date: "2026-01-28",
  title: "getRowId Function Prop",
  description:
    "getRowId function prop for more flexible row identification. Provides richer context including depth, index, row path, and grouping key.",
  changes: [
    {
      type: "feature",
      description:
        "getRowId function.getRowId={({ row }) => row.id as string}. The getRowId function receives: row, depth, index, rowPath, rowIndexPath, and groupingKey for more flexible ID generation.",
      link: "/docs/quick-start",
    },
    {
      type: "improvement",
      description:
        "OnRowGroupExpandProps.rowIndexPath now contains ONLY numeric indices (no mixed string keys). Use rowIdPath for stable ID-based navigation.",
      link: "/docs/row-grouping",
    },
    {
      type: "bugfix",
      description: "Fixed skeleton loaders with pagination and external sorting with row grouping.",
      link: "/docs/loading-state",
    },
    {
      type: "bugfix",
      description: "Virtualization now auto-disabled when height/maxHeight not provided.",
      link: "/docs/table-height",
    },
  ],
};

export const v2_2_7: ChangelogEntry = {
  version: "2.2.7",
  date: "2026-01-25",
  title: "Custom Sort Order & Pagination Improvements",
  description:
    "Enhanced sorting with per-column sort order customization and improved pagination footer with first page button. Also includes breaking changes to tableRef.setPage() API for better consistency.",
  changes: [
    {
      type: "feature",
      description:
        "Added sortingOrder property to ColumnDef for customizing the sort cycle per column. Define custom sort sequences like ['desc', 'asc', null] for numbers/dates or ['asc', 'desc', null] for text. This allows different columns to have different sort behaviors based on their data type.",
      link: "/docs/column-sorting",
    },
    {
      type: "feature",
      description:
        "Pagination footer now displays first page button with ellipsis when navigating to far pages (e.g., '1 ... 78 79 80'). This provides quick access to the beginning of the dataset without excessive scrolling through page numbers.",
      link: "/docs/pagination",
    },
    {
      type: "improvement",
      description:
        "tableRef.setPage() now triggers onPageChange callback. Programmatic page changes via the table ref API now properly invoke the onPageChange callback, making it consistent with UI-triggered page changes.",
      link: "/docs/programmatic-control",
    },
    {
      type: "breaking",
      description:
        "tableRef.setPage() is now async and returns Promise<void>. Update your code to use await tableRef.current?.setPage(3) for consistency with other async API methods.",
      link: "/docs/api-reference#table-api",
    },
  ],
};

export const v2_2_6: ChangelogEntry = {
  version: "2.2.6",
  date: "2026-01-24",
  title: "Nested Tables & CustomTheme API Updates",
  description:
    "Major feature release adding nested tables with independent column structures at each hierarchy level, dynamic nested table loading support, automatic prop inheritance for consistency, and breaking changes to the customTheme API for better organization.",
  changes: [
    {
      type: "feature",
      description:
        "Added nested tables feature that allows each level of row grouping to have its own independent grid structure with completely different columns. Configure via the nestedTable property on expandable ColumnDefs to define custom column layouts for child levels.",
      link: "/docs/nested-tables",
    },
    {
      type: "feature",
      description:
        "Added support for dynamic nested tables with independent onRowGroupExpand handlers at each nesting level. Each nested table can specify its own handler in the nestedTable config, enabling complex lazy-loading patterns with clear, separate logic for each level.",
      link: "/docs/nested-tables",
    },
    {
      type: "improvement",
      description:
        "Nested tables now automatically inherit certain props from the parent table (rows, state renderers, and icon props) for consistency and convenience. This ensures a unified experience across all nesting levels while reducing configuration overhead.",
      link: "/docs/nested-tables",
    },
    {
      type: "breaking",
      description:
        "Moved rowHeight, headerHeight, footerHeight, and selectionColumnWidth props into the customTheme object. Use customTheme={{ rowHeight: 40 }} instead of rowHeight={40}. All properties are optional and will use default values if not specified.",
      link: "/docs/custom-theme",
    },
    {
      type: "bugfix",
      description: "Fixed a data flicker when using external sort",
      link: "/docs/column-sorting",
    },
  ],
};

export const v2_2_1: ChangelogEntry = {
  version: "2.2.1",
  date: "2026-01-13",
  title: "Column Re-ordering Bug Fix",
  description: "Fixed a bug that occurred when re-ordering columns in the table.",
  changes: [
    {
      type: "bugfix",
      description:
        "Fixed bug when re-ordering columns that could cause incorrect column positions or rendering issues.",
    },
  ],
};

export const v2_2_0: ChangelogEntry = {
  version: "2.2.0",
  date: "2026-01-13",
  title: "Simplified API - Removed getRowId",
  description:
    "Breaking change that simplifies the table API by removing the getRowId prop and rowId parameter from callbacks. Use the row object directly to access your data's ID fields.",
  changes: [
    {
      type: "breaking",
      description:
        "Removed getRowId prop - Simple Table no longer requires you to specify a unique identifier accessor. This simplifies configuration and reduces boilerplate.",
      link: "/docs/api-reference",
    },
    {
      type: "breaking",
      description:
        "Removed rowId parameter from onRowGroupExpand callback - Use row.id (or any property from your row object) instead of the internal rowId path string.",
      link: "/docs/row-grouping",
    },
  ],
};

export const v2_1_7: ChangelogEntry = {
  version: "2.1.7",
  date: "2026-01-07",
  title: "Row Grouping Alignment Fix",
  description:
    "Fixed alignment issue in row grouping where text in rows would misalign when sibling rows had different child states (some with children, some without).",
  changes: [
    {
      type: "bugfix",
      description:
        "Fixed alignment when row grouping and siblings have children but one or more siblings does not have children - the collapse/expand icon won't show but the text in the rows will still align correctly",
    },
  ],
};

export const v2_1_6: ChangelogEntry = {
  version: "2.1.6",
  date: "2026-01-06",
  title: "Bug fixes",
  description: "Keyboard navigation bug fix",
  changes: [
    {
      type: "bugfix",
      description: "Keyboard navigation bug fix",
    },
  ],
};

export const v2_1_5: ChangelogEntry = {
  version: "2.1.5",
  date: "2026-01-06",
  title: "Hide Table Header",
  description:
    "Added hideHeader prop to completely hide the table header row, useful for creating cleaner data displays or custom header implementations.",
  changes: [
    {
      type: "feature",
      description:
        "Added hideHeader prop to hide the entire table header row while maintaining all table functionality",
      link: "/docs/api-reference#simple-table-props",
    },
  ],
};

export const v2_1_4: ChangelogEntry = {
  version: "2.1.4",
  date: "2026-01-04",
  title: "Column Visibility State Callback",
  description:
    "Added onColumnVisibilityChange callback prop to track column visibility changes, enabling state persistence and custom visibility management workflows.",
  changes: [
    {
      type: "feature",
      description:
        "Added onColumnVisibilityChange callback prop that fires when users show/hide columns, providing the complete visibility state map",
      link: "/docs/column-visibility",
    },
    {
      type: "improvement",
      description:
        "Updated excludeFromRender behavior - columns with excludeFromRender are now also excluded from the column visibility drawer/popout menu",
      link: "/docs/csv-export",
    },
  ],
};

export const v2_1_3: ChangelogEntry = {
  version: "2.1.3",
  date: "2026-01-04",
  title: "Cell Editing Bug Fixes",
  description:
    "Fixed critical bugs in cell editing for enum and datepicker column types, improving data entry reliability and user experience.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed enum cell editing bugs that prevented proper value selection and updates",
    },
    {
      type: "bugfix",
      description:
        "Fixed datepicker cell editing bugs that caused incorrect date handling and display issues",
    },
  ],
};

export const v2_1_0: ChangelogEntry = {
  version: "2.1.0",
  date: "2026-01-04",
  title: "Advanced Row Grouping Control API",
  description:
    "Major enhancement to the table API with powerful new methods for programmatic control of row grouping expansion. Control which hierarchy levels are visible with fine-grained depth-based methods, save and restore expansion state, and map between grouping properties and depth levels.",
  changes: [
    {
      type: "feature",
      description: "Added expandAll() method to expand all rows at all depths in hierarchical data",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description: "Added collapseAll() method to collapse all rows at all depths",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Added expandDepth(depth) method to expand all rows at a specific depth level (0-indexed)",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added collapseDepth(depth) method to collapse all rows at a specific depth level",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added toggleDepth(depth) method to toggle expansion state for a specific depth level",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added setExpandedDepths(depths) method to set which depths are expanded, replacing current state - perfect for restoring saved expansion state",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added getExpandedDepths() method to retrieve currently expanded depths as a Set - useful for saving expansion state",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Added getGroupingProperty(depth) method to get the grouping property name for a specific depth index",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Added getGroupingDepth(property) method to get the depth index for a specific grouping property name",
      link: "/docs/api-reference#table-api",
    },
  ],
};

export const v2_0_9: ChangelogEntry = {
  version: "2.0.9",
  date: "2026-01-03",
  title: "Comprehensive Accessibility Enhancements",
  description:
    "Major accessibility improvements including enhanced screen reader support, improved keyboard navigation with Tab/Shift+Tab for applying and removing filters and other table actions, and extensive ARIA attributes for better assistive technology compatibility.",
  changes: [
    {
      type: "improvement",
      description:
        "Enhanced screen reader support with improved announcements for table interactions, cell selection, and data updates",
    },
    {
      type: "improvement",
      description:
        "Improved keyboard navigation - Tab and Shift+Tab now properly apply and remove filters, sorting, and other table actions",
    },
    {
      type: "improvement",
      description:
        "Added comprehensive ARIA attributes throughout the table for better accessibility compliance and assistive technology support",
    },
  ],
};

export const v2_0_8: ChangelogEntry = {
  version: "2.0.8",
  date: "2025-12-26",
  title: "Enhanced Header Renderer with Component Control",
  description:
    "Added components prop to HeaderRendererProps, giving you complete control over the positioning of sort icons, filter icons, collapse icons, and label content within custom headers.",
  changes: [
    {
      type: "feature",
      description:
        "Added components prop to HeaderRendererProps containing sortIcon, filterIcon, collapseIcon, and labelContent - allowing custom positioning of header elements",
      link: "/docs/header-renderer",
    },
  ],
};

export const v2_0_6: ChangelogEntry = {
  version: "2.0.6",
  date: "2025-12-22",
  title: "Auto-Expand Columns with autoExpandColumns",
  description:
    "Added autoExpandColumns prop to automatically scale column widths proportionally to fill the table container width. Columns expand or shrink based on their relative width values.",
  changes: [
    {
      type: "feature",
      description:
        "Added autoExpandColumns prop to scale all column widths proportionally to fill the container - perfect for responsive tables that adapt to their container size",
      link: "/docs/column-width",
    },
  ],
};

export const v2_0_4: ChangelogEntry = {
  version: "2.0.4",
  date: "2025-12-21",
  title: "Adaptive Table Height with maxHeight",
  description:
    "Added maxHeight prop for adaptive table height that shrinks when there are fewer rows while maintaining virtualization support.",
  changes: [
    {
      type: "feature",
      description:
        "Added maxHeight prop to enable adaptive height with virtualization - table shrinks to fit content when there are few rows",
      link: "/docs/table-height",
    },
  ],
};

export const v2_0_3: ChangelogEntry = {
  version: "2.0.3",
  date: "2025-12-16",
  title: "Pagination Control API",
  description: "Added programmatic API methods for controlling pagination state.",
  changes: [
    {
      type: "feature",
      description:
        "Added getCurrentPage() method to TableAPI for retrieving the current page number",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Added setPage() method to TableAPI for programmatically changing the current page",
      link: "/docs/api-reference#table-api",
    },
  ],
};

export const v2_0_2: ChangelogEntry = {
  version: "2.0.2",
  date: "2025-12-15",
  title: "Bug fixes with strong border around row groups",
  description: "Bug fixes with strong border around row groups.",
  changes: [
    {
      type: "bugfix",
      description: "Bug fixes with strong border around row groups.",
    },
  ],
};

export const v2_0_1: ChangelogEntry = {
  version: "2.0.1",
  date: "2025-12-13",
  title: "Programmatic Control & Sort Direction Union Type",
  description: "Added programmatic control and sort direction union type.",
  changes: [
    {
      type: "feature",
      description: "Added programmatic controls for sorting and filtering",
      link: "/docs/programmatic-control",
    },
  ],
};

export const v1_9_8: ChangelogEntry = {
  version: "1.9.8",
  date: "2025-12-12",
  title: "CellRendererProps rowIndex fix",
  description: "Row index now accounts for pagination",
  changes: [
    {
      type: "bugfix",
      description: "Row index now accounts for pagination",
    },
  ],
};

export const v1_9_7: ChangelogEntry = {
  version: "1.9.7",
  date: "2025-12-11",
  title: "Enhanced CellRendererProps & Hovered Cell Styling",
  description:
    "Enhanced CellRendererProps interface with rowPath for nested data access and added 'hovered' CSS class to cells for custom hover styling.",
  changes: [
    {
      type: "improvement",
      description:
        "Enhanced CellRendererProps with rowPath property to access the path through nested data structures",
      link: "/docs/api-reference#cell-renderer-props",
    },
    {
      type: "improvement",
      description:
        "Updated CellRendererProps.formattedValue to support string[], number[], and boolean types for more flexible formatting",
      link: "/docs/api-reference#cell-renderer-props",
    },
    {
      type: "feature",
      description:
        "Added 'hovered' CSS class to cells, enabling custom hover state styling via CSS",
      link: "/docs/custom-theme",
    },
  ],
};

export const v1_9_5: ChangelogEntry = {
  version: "1.9.5",
  date: "2025-12-09",
  title: "Nested Data ID Conflict Fix",
  description:
    "Fixed a bug where nested/child rows with the same ID as their parent row would cause rendering and state management issues.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed bug with nested data that had the same ID as the parent row",
    },
  ],
};

export const v1_9_4: ChangelogEntry = {
  version: "1.9.4",
  date: "2025-12-08",
  title: "Enhanced Row Grouping, Table API Methods & Nested Array Support",
  description:
    "Added powerful new features including conditional row expansion control, new table API methods for data access, default loading skeletons for dynamic row groups, enhanced CSV export, and nested array accessor support for more flexible data handling.",
  changes: [
    {
      type: "feature",
      description:
        "Added canExpandRowGroup callback prop to conditionally control which row groups can be expanded",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added getAllRows() method to TableAPI for retrieving all flattened rows including nested/grouped data",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Added getHeaders() method to TableAPI for retrieving the table's current header/column definitions",
      link: "/docs/api-reference#table-api",
    },
    {
      type: "feature",
      description:
        "Default skeleton loading state now appears automatically for dynamic row groups when no custom loadingStateRenderer is defined",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Accessor type now supports nested array paths (e.g., 'albums[0].title' or 'awards[0]') for accessing array data",
      link: "/docs/column-sorting",
    },
    {
      type: "feature",
      description:
        "initialSortColumn now supports nested array paths (e.g., initialSortColumn='awards[0]')",
      link: "/docs/column-sorting",
    },
    {
      type: "improvement",
      description:
        "ValueFormatter return type extended to support string[] and number[] for array formatting",
      link: "/docs/value-formatter",
    },
    {
      type: "improvement",
      description:
        "ComparatorProps enhanced with valueA, valueB, and formattedValue properties for more flexible sorting logic",
      link: "/docs/api-reference#comparator-props",
    },
    {
      type: "bugfix",
      description:
        "CSV export with pagination now exports all data instead of only the current page",
      link: "/docs/csv-export",
    },
  ],
};

export const v1_9_3: ChangelogEntry = {
  version: "1.9.3",
  date: "2025-12-04",
  title: "Bug fixes and improvements",
  description: "Bug fixes and improvements.",
  changes: [
    {
      type: "bugfix",
      description: "Horizontal scrollbar showing up when it shouldn't",
    },
    {
      type: "bugfix",
      description: "Filter input on click on mobile sometimes closes the filter dropdown",
    },
    {
      type: "bugfix",
      description: "Height undefined should not use virtualization",
    },
  ],
};
export const v1_9_2: ChangelogEntry = {
  version: "1.9.2",
  date: "2025-12-03",
  title: "Clipboard Headers, CSV Headers Control & Table Empty State",
  description:
    "New options for controlling header inclusion when copying to clipboard and exporting to CSV, plus a customizable empty state renderer for when the table has no data to display.",
  changes: [
    {
      type: "feature",
      description:
        "Added copyHeadersToClipboard prop to include column headers when copying selected cells to clipboard",
      link: "/docs/cell-highlighting",
    },
    {
      type: "feature",
      description:
        "Added includeHeadersInCSVExport prop to control whether headers are included in CSV exports (defaults to true)",
      link: "/docs/csv-export",
    },
    {
      type: "feature",
      description:
        "Added tableEmptyStateRenderer prop to customize the display when the table has no rows (e.g., after filtering or with no data)",
      link: "/docs/empty-state",
    },
  ],
};

export const v1_9_0: ChangelogEntry = {
  version: "1.9.0",
  date: "2025-12-01",
  title: "Enhanced Dynamic Row Loading with State Management",
  description:
    "Major improvements to dynamic row loading for hierarchical data. Added powerful state management helpers for loading, error, and empty states, plus rowIndexPath for simplified nested data updates. Enhanced OnRowGroupExpandProps with new helper functions and metadata for seamless lazy-loading of large hierarchical datasets.",
  changes: [
    {
      type: "feature",
      description:
        "Added setLoading, setError, and setEmpty helper functions to OnRowGroupExpandProps for managing row-level states during async data fetching",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added rowIndexPath to OnRowGroupExpandProps - provides array path to navigate nested data structure (e.g., [0, 'teams', 1] for rows[0].teams[1])",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "Added groupingKeys array to OnRowGroupExpandProps - provides all grouping keys from the hierarchy for better context awareness",
      link: "/docs/api-reference#on-row-group-expand-props",
    },
    {
      type: "feature",
      description:
        "Added loadingStateRenderer, errorStateRenderer, and emptyStateRenderer props for customizing state displays during dynamic loading",
      link: "/docs/row-grouping",
    },
    {
      type: "improvement",
      description:
        "Enhanced dynamic row loading example with comprehensive three-level hierarchy (Departments → Teams → Employees) showcasing state management",
      link: "/docs/row-grouping",
    },
    {
      type: "improvement",
      description:
        "Improved OnRowGroupExpandProps documentation with detailed examples of rowIndexPath usage for direct nested data updates",
      link: "/docs/api-reference#on-row-group-expand-props",
    },
  ],
};

export const v1_8_9: ChangelogEntry = {
  version: "1.8.9",
  date: "2025-11-29",
  title: "Dynamic Row Loading with onRowGroupExpand",
  description:
    "Added powerful callback for lazy-loading hierarchical data on-demand. Perfect for large datasets where loading all nested levels upfront would impact performance.",
  changes: [
    {
      type: "feature",
      description:
        "Added onRowGroupExpand callback prop for handling row expand/collapse events with detailed context",
      link: "/docs/row-grouping",
    },
    {
      type: "feature",
      description:
        "OnRowGroupExpandProps interface provides row, depth, groupingKey, and isExpanded for flexible data loading",
      link: "/docs/api-reference#on-row-group-expand-props",
    },
    {
      type: "improvement",
      description:
        "Enhanced row grouping documentation with lazy-loading patterns and best practices",
      link: "/docs/row-grouping",
    },
  ],
};

export const v1_8_8: ChangelogEntry = {
  version: "1.8.8",
  date: "2025-11-28",
  title: "excludeFromRender does not affect copied values",
  description: "excludeFromRender does not affect copied values anymore.",
  changes: [
    {
      type: "bugfix",
      description: "excludeFromRender does not affect copied values anymore.",
    },
  ],
};

export const v1_8_6: ChangelogEntry = {
  version: "1.8.6",
  date: "2025-11-25",
  title: "Initial Sort, Column Visibility Control & Enhanced Cell Renderer",
  description:
    "Added powerful new features for controlling initial sort state, column visibility in tables vs exports, and enhanced cell renderer props. Includes improved sub-column styling and auto-format behavior for better developer experience.",
  changes: [
    {
      type: "feature",
      description:
        "Added initialSortColumn and initialSortDirection props to set default sorting on table load",
      link: "/docs/column-sorting",
    },
    {
      type: "feature",
      description:
        "Added collapseDefault attribute to start collapsible/expandable columns in collapsed state",
      link: "/docs/collapsible-columns",
    },
    {
      type: "feature",
      description:
        "Added excludeFromRender to hide columns from table while keeping them in CSV exports (perfect for ID columns)",
      link: "/docs/csv-export",
    },
    {
      type: "feature",
      description:
        "Added excludeFromCsv to hide columns from CSV exports while showing in table (perfect for action buttons)",
      link: "/docs/csv-export",
    },
    {
      type: "feature",
      description:
        "Enhanced CellRendererProps with value and formattedValue props for easier custom rendering",
      link: "/docs/cell-renderer",
    },
    {
      type: "improvement",
      description:
        "useFormattedValueForClipboard and useFormattedValueForCSV now default to true when valueFormatter exists (reduces boilerplate)",
      link: "/docs/value-formatter",
    },
    {
      type: "improvement",
      description:
        "Added distinct CSS variables for sub-column hover (--st-sub-cell-hover-background-color), dragging sub-headers (--st-dragging-sub-header-background-color), and selected sub-cells (--st-selected-sub-cell-background-color, --st-selected-sub-cell-color)",
      link: "/docs/custom-theme",
    },
  ],
};

export const v1_8_5: ChangelogEntry = {
  version: "1.8.5",
  date: "2025-11-24",
  title: "Virtual scrolling performance improvements",
  description:
    "Enhanced virtual scrolling performance with improved memory usage and faster rendering of large datasets.",
  changes: [
    {
      type: "improvement",
      description:
        "Improved virtual scrolling performance with improved memory usage and faster rendering of large datasets.",
    },
  ],
};

export const v1_8_4: ChangelogEntry = {
  version: "1.8.4",
  date: "2025-11-24",
  title: "Advanced Sorting, Custom Clipboard & CSV Export",
  description:
    "Enhanced column configuration with powerful new options for custom sorting logic, clipboard formatting, and CSV export customization—giving you complete control over how data is sorted, copied, and exported.",
  changes: [
    {
      type: "feature",
      description:
        "Added comparator attribute to ColumnDef for custom sorting based on row-level metadata or complex logic",
      link: "/docs/column-sorting",
    },
    {
      type: "feature",
      description:
        "Added valueGetter attribute to extract values from nested objects or compute values dynamically for sorting",
      link: "/docs/column-sorting",
    },
    {
      type: "feature",
      description:
        "Added useFormattedValueForClipboard attribute to control whether cells copy formatted values (with symbols, formatting) or raw data",
      link: "/docs/value-formatter",
    },
    {
      type: "feature",
      description:
        "Added useFormattedValueForCSV attribute to use formatted values in CSV exports instead of raw data",
      link: "/docs/csv-export",
    },
    {
      type: "feature",
      description:
        "Added exportValueGetter attribute to provide completely custom values for CSV export, different from both raw and formatted display values",
      link: "/docs/csv-export",
    },
    {
      type: "feature",
      description:
        "Exported new TypeScript types: Comparator, ValueGetter, ExportValueGetter with full IntelliSense support",
    },
    {
      type: "improvement",
      description:
        "Enhanced HR and Sales examples to showcase new clipboard and CSV formatting capabilities",
      link: "/examples/hr",
    },
  ],
};

export const v1_8_2: ChangelogEntry = {
  version: "1.8.2",
  date: "2025-11-23",
  title: "Chart Width and Virtualization Performance",
  description:
    "Enhanced chart column rendering with improved width handling and significantly faster virtualization performance for smoother scrolling through large datasets.",
  changes: [
    {
      type: "improvement",
      description: "Improved chart width calculations for better responsive behavior",
      link: "/docs/chart-columns",
    },
    {
      type: "improvement",
      description: "Optimized virtualization engine for faster rendering and smoother scrolling",
    },
  ],
};

export const v1_8_1: ChangelogEntry = {
  version: "1.8.1",
  date: "2025-11-22",
  title: "Chart Column Types - Visualize Data Inline",
  description:
    "Added built-in chart column types (lineAreaChart and barChart) to visualize array data directly in table cells. Includes smart copy/paste functionality that formats chart data as comma-separated values for seamless integration with spreadsheets.",
  changes: [
    {
      type: "feature",
      description: "Added lineAreaChart and barChart column types for inline data visualization",
      link: "/docs/chart-columns",
    },
    {
      type: "feature",
      description:
        "Smart copy/paste for chart columns: arrays format as comma-separated values (e.g., '10, 15, 12, 18, 25')",
      link: "/docs/chart-columns",
    },
    {
      type: "feature",
      description:
        "Chart cells can be pasted with comma-separated values that automatically parse to number arrays",
      link: "/docs/chart-columns",
    },
    {
      type: "improvement",
      description:
        "Enhanced Infrastructure example with live-updating CPU history chart visualization",
      link: "/examples/infrastructure",
    },
  ],
};

export const v1_7_9: ChangelogEntry = {
  version: "1.7.9",
  date: "2025-11-22",
  title: "Value Formatter Support",
  description:
    "Added valueFormatter attribute to ColumnDef for simple cell value formatting. This provides a more performant and streamlined way to format cell values for display (currency, dates, percentages) without using cellRenderer.",
  changes: [
    {
      type: "feature",
      description:
        "Added valueFormatter attribute to ColumnDef for formatting cell values without React components",
      link: "/docs/value-formatter",
    },
    {
      type: "improvement",
      description:
        "Updated documentation to clarify when to use valueFormatter vs cellRenderer for optimal performance",
      link: "/docs/cell-renderer",
    },
  ],
};

export const v1_7_6: ChangelogEntry = {
  version: "1.7.6",
  date: "2025-11-19",
  title: "Nested Data Accessor Support",
  description:
    "Added support for nested data accessors, allowing you to access deeply nested object properties directly in column definitions using dot notation like 'latest.rank'.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed nested data accessors (e.g., accessor: 'latest.rank') to work correctly",
    },
  ],
};

export const v1_7_5: ChangelogEntry = {
  version: "1.7.5",
  date: "2025-11-19",
  title: "Loading State with Skeleton Loaders",
  description:
    "Added built-in loading state support with skeleton loaders for all table cells. Perfect for showing visual feedback during data fetching, pagination, and async operations.",
  changes: [
    {
      type: "feature",
      description: "Added isLoading prop to display skeleton loaders while data is being fetched",
      link: "/docs/loading-state",
    },
    {
      type: "feature",
      description:
        "New CSS variable --st-loading-skeleton-bg-color for customizing skeleton appearance",
      link: "/docs/custom-theme",
    },
    {
      type: "feature",
      description: "New st-loading-skeleton CSS class for advanced styling customization",
      link: "/docs/loading-state",
    },
    {
      type: "improvement",
      description: "Enhanced pagination demo to showcase loading states during page transitions",
      link: "/docs/pagination",
    },
  ],
};

export const v1_7_0: ChangelogEntry = {
  version: "1.7.0",
  date: "2025-11-13",
  title: "Server-Side Pagination and Enhanced Cell Selection",
  description:
    "Major update adding server-side pagination support and keyboard navigation for cell selection. Improved cell selection scrolling behavior and pagination overflow handling.",
  changes: [
    {
      type: "feature",
      description:
        "Added server-side pagination support with new props: onPageChange, serverSidePagination, and totalRowCount",
      link: "/docs/pagination",
    },
    {
      type: "feature",
      description:
        "Enable cell selection using keyboard shortcuts (Shift + Arrow keys, Ctrl/Cmd + A, etc.)",
      link: "/docs/cell-highlighting",
    },
    {
      type: "improvement",
      description: "Improved cell selection while scrolling for a smoother experience",
      link: "/docs/cell-highlighting",
    },
    {
      type: "improvement",
      description:
        "Pagination now shows overflow visible when no height is specified, eliminating unnecessary scrolling",
      link: "/docs/pagination",
    },
  ],
};

export const v1_6_7: ChangelogEntry = {
  version: "1.6.7",
  date: "2025-11-09",
  title: "Bundle Size Improvements",
  description:
    "Optimized bundle size to reduce the overall package footprint and improve loading performance.",
  changes: [
    {
      type: "improvement",
      description: "Reduced bundle size for improved loading performance",
    },
  ],
};

export const v1_6_6: ChangelogEntry = {
  version: "1.6.6",
  date: "2025-11-09",
  title: "Cell Selection and Scroll Improvements",
  description:
    "Enhanced cell selection styling and improved scrolling behavior while drag selecting cells for a smoother user experience.",
  changes: [
    {
      type: "improvement",
      description: "Improved cell selection style for better visual feedback",
      link: "/docs/cell-selection",
    },
    {
      type: "improvement",
      description: "Enhanced scroll behavior while drag selecting cells",
      link: "/docs/cell-selection",
    },
  ],
};

export const v1_6_1: ChangelogEntry = {
  version: "1.6.1",
  date: "2025-10-27",
  title: "Table Footer Pagination Improvements",
  description:
    "Enhanced table footer pagination with improved usability, better performance, and more intuitive controls for navigating through large datasets.",
  changes: [
    {
      type: "improvement",
      description: "Enhanced footer pagination controls for better usability and performance",
      link: "/docs/pagination",
    },
  ],
};

export const v1_6_0: ChangelogEntry = {
  version: "1.6.0",
  date: "2025-10-26",
  title: "Row Numbers with Pagination Fix",
  description:
    "Fixed an issue where row numbers were not correctly calculated when pagination was enabled. Row numbers now display the correct sequential numbers based on the current page.",
  changes: [
    {
      type: "bugfix",
      description: "Fixed row numbers calculation with pagination",
      link: "/docs/row-selection",
    },
  ],
};

export const v1_5_6: ChangelogEntry = {
  version: "1.5.6",
  date: "2025-10-26",
  title: "Custom Filter Icon",
  description:
    "Customize the filter icon in table headers to match your design system. Use any React component or icon library to replace the default filter icon.",
  changes: [
    {
      type: "feature",
      description: "Added filterIcon prop to customize the column filter icon",
      link: "/docs/column-filtering",
    },
  ],
};

export const v1_5_5: ChangelogEntry = {
  version: "1.5.5",
  date: "2025-10-25",
  title: "Footer Renderer",
  description:
    "Customize your table footer with complete control over its appearance and functionality. Build custom pagination controls, add summary statistics, or create any footer UI that matches your design.",
  changes: [
    {
      type: "feature",
      description: "Added footerRenderer prop to completely customize table footer UI",
      link: "/docs/footer-renderer",
    },
  ],
};

export const v1_5_1: ChangelogEntry = {
  version: "1.5.1",
  date: "2025-10-19",
  title: "CSV Export",
  description:
    "Export your table data to CSV format with a simple API call. Perfect for data analysis, reporting, and sharing.",
  changes: [
    {
      type: "feature",
      description: "Export table data to CSV using tableRef.current?.exportToCSV()",
      link: "/docs/csv-export",
    },
  ],
};

export const v1_5_0: ChangelogEntry = {
  version: "1.5.0",
  date: "2025-10-19",
  title: "Mobile-First Column Pinning",
  description:
    "Enhanced mobile experience with intelligent column pinning behavior. Pinned columns now have limited width on mobile devices and support horizontal scrolling for improved usability.",
  changes: [
    {
      type: "feature",
      description: "Pinned columns have limited width on mobile devices for better mobile UX",
      link: "/docs/column-pinning",
    },
    {
      type: "feature",
      description: "Pinned columns can now scroll horizontally on mobile devices",
      link: "/docs/column-pinning",
    },
    {
      type: "improvement",
      description: "Enhanced touch target sizes for better mobile interaction",
      link: "/blog/mobile-compatibility-react-tables",
    },
  ],
};

export const v1_4_7: ChangelogEntry = {
  version: "1.4.7",
  date: "2025-10-18",
  title: "Theme Color Improvements",
  description:
    "Enhanced theme color system with improved contrast, readability, and visual consistency across all built-in themes.",
  changes: [
    {
      type: "improvement",
      description: "Improved color contrast and readability across all themes",
      link: "/docs/themes",
    },
    {
      type: "improvement",
      description: "Enhanced styling flags for better visual customization",
      link: "/docs/themes",
    },
  ],
};

export const v1_4_4: ChangelogEntry = {
  version: "1.4.4",
  date: "2025-10-15",
  title: "Collapsible Columns Enhancement",
  description:
    "Enhanced collapsible columns with new ShowWhen attribute for better control over column visibility.",
  changes: [
    {
      type: "feature",
      description:
        'collapsible columns new ShowWhen attribute: "parentCollapsed" | "parentExpanded" | "always"',
      link: "/docs/collapsible-columns",
    },
    {
      type: "breaking",
      description: "Removed summaryColumn attribute (replaced by showWhen)",
      link: "/docs/collapsible-columns",
    },
  ],
};

// Array of all changelog entries (newest first)
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  v4_2_1,
  v4_2_0,
  v4_1_9,
  v4_1_8,
  v4_1_7,
  v4_1_6,
  v4_1_5,
  v4_1_4,
  v4_1_3,
  v4_1_2,
  v4_1_1,
  v4_1_0,
  v4_0_9,
  v4_0_8,
  v4_0_7,
  v4_0_6,
  v4_0_5,
  v4_0_3,
  v4_0_1,
  v4_0_0,
  v3_9_9,
  v3_9_8,
  v3_9_7,
  v3_9_6,
  v3_9_5,
  v3_9_3,
  v3_9_2,
  v3_9_1,
  v3_9_0,
  v3_8_9,
  v3_8_7,
  v3_8_6,
  v3_8_5,
  v3_8_4,
  v3_8_3,
  v3_8_1,
  v3_8_0,
  v3_7_3,
  v3_7_2,
  v3_7_1,
  v3_7_0,
  v3_6_8,
  v3_6_4,
  v3_6_3,
  v3_6_2,
  v3_6_0,
  v3_5_3,
  v3_5_2,
  v3_4_2,
  v3_4_0,
  v3_0_4,
  v3_0_0,
  v2_6_3,
  v2_6_2,
  v2_5_7,
  v2_5_6,
  v2_5_3,
  v2_5_0,
  v2_4_8,
  v2_4_4,
  v2_4_3,
  v2_4_2,
  v2_4_1,
  v2_4_0,
  v2_3_8,
  v2_3_1,
  v2_3_0,
  v2_2_9,
  v2_2_7,
  v2_2_6,
  v2_2_1,
  v2_2_0,
  v2_1_7,
  v2_1_6,
  v2_1_5,
  v2_1_4,
  v2_1_3,
  v2_1_0,
  v2_0_9,
  v2_0_8,
  v2_0_6,
  v2_0_4,
  v2_0_3,
  v2_0_2,
  v2_0_1,
  v1_9_8,
  v1_9_7,
  v1_9_5,
  v1_9_4,
  v1_9_3,
  v1_9_2,
  v1_9_0,
  v1_8_9,
  v1_8_8,
  v1_8_6,
  v1_8_5,
  v1_8_4,
  v1_8_2,
  v1_8_1,
  v1_7_9,
  v1_7_6,
  v1_7_5,
  v1_7_0,
  v1_6_7,
  v1_6_6,
  v1_6_1,
  v1_6_0,
  v1_5_6,
  v1_5_5,
  v1_5_1,
  v1_5_0,
  v1_4_7,
  v1_4_4,
];
