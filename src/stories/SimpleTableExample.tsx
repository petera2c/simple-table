import { useState } from "react";
import SimpleTable from "../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS, inventoryData } from "../consts/SampleData";
import CellChangeProps from "../types/CellChangeProps";
import Theme from "../types/Theme";

const THEME_OPTIONS: Theme[] = [
  "dark",
  "desert",
  "forest",
  "high-contrast",
  "light",
  "ocean",
  "pastel",
  "solarized-dark",
  "solarized-light",
  "vibrant",
];

// Function to get theme color
const getThemeColor = (
  theme: Theme
): { backgroundColor: string; color: string } => {
  switch (theme) {
    case "dark":
      return { backgroundColor: "#333", color: "white" };
    case "desert":
      return { backgroundColor: "#C19A6B", color: "white" };
    case "forest":
      return { backgroundColor: "#228B22", color: "white" };
    case "high-contrast":
      return { backgroundColor: "#000", color: "white" };
    case "light":
      return { backgroundColor: "#f0f0f0", color: "black" };
    case "ocean":
      return { backgroundColor: "#1E90FF", color: "white" };
    case "pastel":
      return { backgroundColor: "#FFDAB9", color: "black" };
    case "solarized-dark":
      return { backgroundColor: "#002b36", color: "white" };
    case "solarized-light":
      return { backgroundColor: "#fdf6e3", color: "black" };
    case "vibrant":
      return { backgroundColor: "#FF4500", color: "white" };
    default:
      return { backgroundColor: "#ccc", color: "black" };
  }
};

// Function to get hover color
const getHoverColor = (theme: Theme) => {
  switch (theme) {
    case "dark":
      return "#444";
    case "desert":
      return "#D2B48C";
    case "forest":
      return "#2E8B57";
    case "high-contrast":
      return "#111";
    case "light":
      return "#e0e0e0";
    case "ocean":
      return "#4682B4";
    case "pastel":
      return "#FFE4B5";
    case "solarized-dark":
      return "#073642";
    case "solarized-light":
      return "#eee8d5";
    case "vibrant":
      return "#FF6347";
    default:
      return "#bbb";
  }
};

export const SampleTable = () => {
  // const [headers, setHeaders] = useState(SAMPLE_HEADERS);
  const [rows, setRows] = useState(inventoryData);
  const [theme, setTheme] = useState<Theme>("light");

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex][accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        draggable // Enable draggable columns
        editColumns // Enable editing columns
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        selectableColumns // Select column by clicking on the header. This will override sort on header click
        theme={theme} // Set the theme
        // If using pagination use an auto height
        height="auto"
        shouldPaginate
        rowsPerPage={10}
        // height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {THEME_OPTIONS.map((theme) => {
          const { backgroundColor, color } = getThemeColor(theme);
          return (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              style={{
                backgroundColor,
                color,
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = getHoverColor(theme))
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = backgroundColor)
              }
            >
              {theme}
            </button>
          );
        })}
      </div>
    </div>
  );
};
