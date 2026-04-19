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
  const [starData, setStarData] = useState(INITIAL_STAR_DATA);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    null,
  );

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...starData].sort((a, b) => {
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setStarData(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return "↕️";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

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
      case "violet":
        return {
          baseColor: "#6b7280",
          hoverColor: "#8b5cf6",
          sortActiveColor: "#a855f7",
        };
      case "sky":
        return {
          baseColor: "#6b7280",
          hoverColor: "#0ea5e9",
          sortActiveColor: "#0284c7",
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

  // Custom header layout + styling. Use the column label as React text (same idea as
  // packages/examples/react header-renderer demo). Do not put core's `components.labelContent`
  // in JSX unless it is a React element: before the adapter maps slots, it is a live DOM
  // node — truthy so `|| header.label` never runs, and React will not render raw Nodes.
  const createHeaderRenderer = (key: string, label: string) => {
    return (_props: HeaderRendererProps) => {
      const colors = getThemeColors(theme);

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            color: colors.baseColor,
            fontWeight: 600,
            fontSize: "14px",
            padding: "4px 12px",
            transition: "all 0.2s ease",
          }}
          onClick={() => handleSort(key)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.hoverColor;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.baseColor;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>{label}</span>
          <span
            style={{
              fontSize: "12px",
              opacity: 0.7,
              transition: "all 0.2s ease",
              color: sortConfig && sortConfig.key === key ? colors.sortActiveColor : "inherit",
              fontWeight: sortConfig && sortConfig.key === key ? 700 : 400,
            }}
          >
            {getSortIndicator(key)}
          </span>
        </div>
      );
    };
  };

  const headers: ReactHeaderObject[] = useMemo(
    () => [
      {
        accessor: "id",
        label: "ID",
        width: 80,
        type: "number",
        headerRenderer: createHeaderRenderer("id", "ID"),
      },
      {
        accessor: "starName",
        label: "Star Name",
        width: 200,
        type: "string",
        headerRenderer: createHeaderRenderer("starName", "Star Name"),
      },
      {
        accessor: "constellation",
        label: "Constellation",
        width: 150,
        type: "string",
        headerRenderer: createHeaderRenderer("constellation", "Constellation"),
      },
      {
        accessor: "magnitude",
        label: "Magnitude",
        width: 120,
        type: "number",
        isSortable: true,
        filterable: true,
        headerRenderer: ({ components, header }: HeaderRendererProps) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {components?.labelContent ?? <span>{header.label}</span>}
            {components?.sortIcon}
            {components?.filterIcon}
            {components?.collapseIcon}
          </div>
        ),
        align: "right",
      },
      {
        accessor: "spectralClass",
        label: "Spectral Class",
        width: 140,
        type: "string",
        headerRenderer: createHeaderRenderer("spectralClass", "Class"),
      },
      {
        accessor: "distanceLY",
        label: "Distance (LY)",
        width: 130,
        type: "number",
        headerRenderer: createHeaderRenderer("distanceLY", "Distance"),
      },
    ],
    [sortConfig, theme],
  );

  return (
    <SimpleTable
      columnResizing
      defaultHeaders={headers}
      height={height}
      rows={starData}
      selectableCells
      theme={theme}
    />
  );
};

export default HeaderRendererDemo;
