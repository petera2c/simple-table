import React, { useMemo, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, HeaderRendererProps, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Initial astronomical data
const INITIAL_STAR_DATA = [
  {
    id: 1,
    starName: "Sirius",
    constellation: "Canis Major",
    magnitude: -1.46,
    spectralClass: "A1V",
    distanceLY: 8.6,
  },
  {
    id: 2,
    starName: "Canopus",
    constellation: "Carina",
    magnitude: -0.74,
    spectralClass: "F0II",
    distanceLY: 310,
  },
  {
    id: 3,
    starName: "Arcturus",
    constellation: "Boötes",
    magnitude: -0.05,
    spectralClass: "K1.5IIIFe-0.5",
    distanceLY: 37,
  },
  {
    id: 4,
    starName: "Vega",
    constellation: "Lyra",
    magnitude: 0.03,
    spectralClass: "A0Va",
    distanceLY: 25,
  },
  {
    id: 5,
    starName: "Capella",
    constellation: "Auriga",
    magnitude: 0.08,
    spectralClass: "G5III",
    distanceLY: 43,
  },
  {
    id: 6,
    starName: "Rigel",
    constellation: "Orion",
    magnitude: 0.13,
    spectralClass: "B8Ia",
    distanceLY: 860,
  },
  {
    id: 7,
    starName: "Procyon",
    constellation: "Canis Minor",
    magnitude: 0.34,
    spectralClass: "F5IV-V",
    distanceLY: 11.5,
  },
  {
    id: 8,
    starName: "Betelgeuse",
    constellation: "Orion",
    magnitude: 0.42,
    spectralClass: "M1-2Ia-Iab",
    distanceLY: 640,
  },
  {
    id: 9,
    starName: "Achernar",
    constellation: "Eridanus",
    magnitude: 0.46,
    spectralClass: "B6Vep",
    distanceLY: 139,
  },
  {
    id: 10,
    starName: "Hadar",
    constellation: "Centaurus",
    magnitude: 0.61,
    spectralClass: "B1III",
    distanceLY: 390,
  },
  {
    id: 11,
    starName: "Altair",
    constellation: "Aquila",
    magnitude: 0.77,
    spectralClass: "A7V",
    distanceLY: 17,
  },
  {
    id: 12,
    starName: "Acrux",
    constellation: "Crux",
    magnitude: 0.81,
    spectralClass: "B0.5IV",
    distanceLY: 320,
  },
];

const HeaderRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  // Theme-based color configuration
  const getThemeColors = (theme?: Theme) => {
    switch (theme) {
      case "modern-dark":
        return {
          baseColor: "#d1d5db",
          hoverColor: "#f3f4f6",
          sortActiveColor: "#60a5fa",
        };
      case "dark":
        return {
          baseColor: "#9ca3af",
          hoverColor: "#e5e7eb",
          sortActiveColor: "#60a5fa",
        };
      case "modern-light":
        return {
          baseColor: "#6b7280",
          hoverColor: "#111827",
          sortActiveColor: "#3b82f6",
        };
      case "neutral":
        return {
          baseColor: "#525252",
          hoverColor: "#737373",
          sortActiveColor: "#404040",
        };
      case "light":
      default:
        return {
          baseColor: "#374151",
          hoverColor: "#6366f1",
          sortActiveColor: "#4f46e5",
        };
    }
  };

  // Custom header layout + styling. Each renderer is mounted as its own React component
  // (the adapter renders `<Component {...props} />`), so hooks like `useState` are safe.
  // Local pin state + hover should survive sort/filter icon refreshes; if the header
  // remounts on sort, the pin snaps back off (visible flicker / lost state).
  const createHeaderRenderer = (key: string, label: string, icon: string, sublabel: string) => {
    const HeaderCell = ({ components }: HeaderRendererProps) => {
      const colors = getThemeColors(theme);
      const [hovered, setHovered] = useState(false);
      const [pinned, setPinned] = useState(false);

      return (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            cursor: "pointer",
            userSelect: "none",
            paddingLeft: 12,
            paddingRight: 4,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: 8,
              fontSize: 14,
              backgroundColor: hovered ? `${colors.sortActiveColor}1f` : `${colors.baseColor}14`,
              transition: "background-color 140ms ease",
            }}
          >
            {icon}
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: hovered ? colors.hoverColor : colors.baseColor,
                transition: "color 140ms ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: colors.baseColor,
                opacity: 0.55,
                whiteSpace: "nowrap",
              }}
            >
              {sublabel}
            </span>
          </span>
          <button
            type="button"
            aria-label={pinned ? `Unpin ${label}` : `Pin ${label}`}
            aria-pressed={pinned}
            title="Pin stays on until remount — click, then sort this column"
            onClick={(event) => {
              event.stopPropagation();
              setPinned((value) => !value);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 22,
              height: 22,
              padding: 0,
              border: "none",
              borderRadius: 6,
              background: pinned ? `${colors.sortActiveColor}22` : "transparent",
              color: pinned ? colors.sortActiveColor : colors.baseColor,
              opacity: pinned ? 1 : 0.45,
              cursor: "pointer",
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            {pinned ? "★" : "☆"}
          </button>
          {components?.filterIcon}
          {components?.sortIcon}
        </div>
      );
    };

    return HeaderCell;
  };

  const headers: ReactHeaderObject[] = useMemo(
    () => [
      {
        accessor: "id",
        label: "ID",
        width: 120,
        type: "number",
        headerRenderer: createHeaderRenderer("id", "ID", "#", "Catalog"),
        isSortable: true,
      },
      {
        accessor: "starName",
        label: "Star Name",
        width: 140,
        type: "string",
        headerRenderer: createHeaderRenderer("starName", "Star Name", "⭐", "Designation"),
        isSortable: true,
      },
      {
        accessor: "constellation",
        label: "Constellation",
        width: 170,
        type: "string",
        headerRenderer: createHeaderRenderer("constellation", "Constellation", "✦", "Region"),
        isSortable: true,
      },
      {
        accessor: "magnitude",
        label: "Magnitude",
        width: 140,
        type: "number",
        isSortable: true,
        filterable: true,
        headerRenderer: createHeaderRenderer("magnitude", "Magnitude", "✨", "Brightness"),
        align: "right",
      },
      {
        accessor: "spectralClass",
        label: "Spectral Class",
        width: 150,
        type: "string",
        headerRenderer: createHeaderRenderer("spectralClass", "Class", "🌡️", "Spectral"),
        isSortable: true,
      },
      {
        accessor: "distanceLY",
        label: "Distance (LY)",
        width: 150,
        type: "number",
        headerRenderer: createHeaderRenderer("distanceLY", "Distance", "📡", "Light Years"),
        isSortable: true,
      },
    ],
    [theme],
  );

  return (
    <SimpleTable
      columnResizing
      defaultHeaders={headers}
      height={height}
      rows={INITIAL_STAR_DATA}
      selectableCells
      theme={theme}
      customTheme={{
        headerHeight: 48,
      }}
    />
  );
};

export default HeaderRendererDemo;
