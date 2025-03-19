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

const THEME_OPTIONS: Theme[] = [
  "90s",
  "bubblegum",
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

// Utility function to load fonts
const loadFont = (fontName: string) => {
  const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
  if (existingLink) return; // Font already loaded

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700&display=swap`;
  link.setAttribute("data-font", fontName);
  document.head.appendChild(link);
};

// Function to get theme color
const getThemeColor = (theme: Theme): { backgroundColor: string; color: string } => {
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
    case "bubblegum":
      return { backgroundColor: "#FFC0CB", color: "black" };
    case "90s":
      return { backgroundColor: "#87CEEB", color: "black" };
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
    case "bubblegum":
      return "#FFB6C1";
    case "90s":
      return "#ADD8E6";
    default:
      return "#bbb";
  }
};

const ThemingExample = () => {
  // const [headers, setHeaders] = useState(SAMPLE_HEADERS);
  const [rows, setRows] = useState(EXAMPLE_DATA);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    switch (theme) {
      case "light":
        loadFont("Nunito");
        break;
      case "dark":
        loadFont("Open Sans");
        break;
      case "pastel":
        loadFont("Comic Sans MS");
        break;
      case "vibrant":
        loadFont("Lobster");
        break;
      case "solarized-light":
      case "solarized-dark":
        loadFont("Georgia");
        break;
      case "desert":
        loadFont("Times New Roman");
        break;
      case "forest":
        loadFont("Tahoma");
        break;
      case "ocean":
        loadFont("Verdana");
        break;
      case "bubblegum":
        loadFont("Pacifico");
        break;
      case "90s":
        loadFont("Courier New");
        break;
      default:
        loadFont("Nunito"); // Default font
        break;
    }
  }, [theme]);

  const updateCell = ({ accessor, newRowIndex, newValue, originalRowIndex, row }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        draggable // Enable draggable columns
        editColumns // Enable editing columns
        onCellChange={updateCell} // Handle cell changes
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
                padding: "0.25rem 0.5rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
                fontFamily: "Nunito",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = getHoverColor(theme))}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backgroundColor)}
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
