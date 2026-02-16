import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Theme from "../../types/Theme";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to Theming - exported for reuse in stories and tests
export const themingDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  selectableCells: true,
  selectableColumns: true,
  shouldPaginate: true,
  rowsPerPage: 10,
};

const EXAMPLE_DATA = generateSpaceData();
const HEADERS = SPACE_HEADERS;

const THEME_OPTIONS: Theme[] = [
  "sky",
  "violet",
  "neutral",
  "light",
  "dark",
  "modern-light",
  "modern-dark",
];

const ThemingExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState(EXAMPLE_DATA);
  const [theme, setTheme] = useState<Theme>(props.theme ?? "light");

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prevRows) => {
      const rowIndex = prevRows.findIndex((r) => r.id === row.id);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [accessor]: newValue };
        return updatedRows;
      }
      return prevRows;
    });
  };

  return (
    <div>
      <SimpleTable
        {...props}
        defaultHeaders={HEADERS}
        onCellEdit={updateCell}
        rows={rows}
        // Use local theme state if user is interacting with theme buttons, otherwise use props
        theme={theme}
        // Default settings for this example
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        editColumns={props.editColumns ?? true}
        selectableCells={props.selectableCells ?? true}
        selectableColumns={props.selectableColumns ?? true}
        shouldPaginate={props.shouldPaginate ?? true}
        rowsPerPage={props.rowsPerPage ?? 10}
      />
      <div style={{ display: "flex", overflow: "auto", padding: "1rem" }}>
        {THEME_OPTIONS.map((themeOption) => {
          return (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              style={{
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
                fontFamily: "Nunito",
                backgroundColor: theme === themeOption ? "#007acc" : "#f0f0f0",
                color: theme === themeOption ? "white" : "black",
              }}
            >
              {themeOption}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemingExample;
