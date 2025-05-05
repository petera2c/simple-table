import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Theme from "../../types/Theme";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";

const EXAMPLE_DATA = generateSpaceData();
const HEADERS = SPACE_HEADERS;

const THEME_OPTIONS: Theme[] = ["sky", "funky", "neutral", "light", "dark"];

const ThemingExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);
  const [theme, setTheme] = useState<Theme>("light");

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prevRows) => {
      const rowIndex = rows.findIndex((r) => r.rowMeta.rowId === row.rowMeta.rowId);
      prevRows[rowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        columnReordering // Enable draggable columns
        editColumns // Enable editing columns
        onCellEdit={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        selectableColumns // Select column by clicking on the header. This will override sort on header click
        theme={theme} // Set the theme
        // If using pagination use an auto height
        shouldPaginate
        rowsPerPage={10}
      />
      <div style={{ display: "flex", overflow: "auto" }}>
        {THEME_OPTIONS.map((theme) => {
          return (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              style={{
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
                fontFamily: "Nunito",
              }}
            >
              {theme}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemingExample;
