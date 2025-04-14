import { useEffect, useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Theme from "../../types/Theme";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";

/**
 * # Theming Example
 *
 * This example demonstrates the extensive theming capabilities of Simple Table.
 *
 * ## Features Demonstrated
 * - Switching between multiple built-in themes
 * - Theme-specific fonts and styling
 * - Dynamic theme application with the theme prop
 * - Combining theming with other features like pagination and column management
 *
 * Simple Table comes with 12 built-in themes that provide different visual styles:
 * - light: Clean, minimalist design with light colors
 * - dark: Dark mode interface for low-light environments
 * - high-contrast: Enhanced visual distinction for accessibility
 * - pastel: Soft, muted colors for a gentle interface
 * - vibrant: Bold, colorful design for high visual impact
 * - solarized-light/dark: Eye-friendly color schemes based on Solarized
 * - ocean: Blue-themed design inspired by water
 * - forest: Green-themed design inspired by nature
 * - desert: Earthy tones for a warm interface
 * - bubblegum: Playful pink theme
 * - 90s: Retro-styled theme with nostalgic elements
 *
 * Each theme includes customized fonts, colors, spacing, and other styles
 * to create a cohesive visual experience.
 */

const EXAMPLE_DATA = generateSpaceData();
const HEADERS = SPACE_HEADERS;

const THEME_OPTIONS: Theme[] = ["sky", "funky", "neutral", "light", "dark"];

// Utility function to load fonts
const loadFont = (fontName: string) => {
  const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
  if (existingLink) return; // Font already loaded

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    "+"
  )}:wght@400;700&display=swap`;
  link.setAttribute("data-font", fontName);
  document.head.appendChild(link);
};

const ThemingExample = () => {
  // const [headers, setHeaders] = useState(SAMPLE_HEADERS);
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
        height="80vh"
        shouldPaginate
        rowsPerPage={10}
        // height="calc(100dvh - 112px)" // If not using pagination use a fixed height
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
