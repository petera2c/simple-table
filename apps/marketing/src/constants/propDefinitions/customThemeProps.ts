import type { PropInfo } from "./types";

export const CUSTOM_THEME_PROPS: PropInfo[] = [
  {
    key: "rowHeight",
    name: "rowHeight",
    required: false,
    description:
      "Height of table rows in pixels. This value is used for virtualization calculations and cannot be styled through CSS. If not specified, uses the default value of 40px.",
    type: "number",
    example: `customTheme={{
  rowHeight: 32
}}`,
  },
  {
    key: "headerHeight",
    name: "headerHeight",
    required: false,
    description:
      "Height of the table header in pixels. This value is used for virtualization calculations and cannot be styled through CSS. If not specified, uses the default value of 40px.",
    type: "number",
    example: `customTheme={{
  headerHeight: 48
}}`,
  },
  {
    key: "footerHeight",
    name: "footerHeight",
    required: false,
    description:
      "Height of the table footer in pixels. This value is used for virtualization calculations and cannot be styled through CSS. If not specified, uses the default value of 50px.",
    type: "number",
    example: `customTheme={{
  footerHeight: 60
}}`,
  },
  {
    key: "rowSeparatorWidth",
    name: "rowSeparatorWidth",
    required: false,
    description:
      "Width of separators between rows in pixels. This value affects virtualization calculations and cannot be styled through CSS. If not specified, uses the default value of 1px.",
    type: "number",
    example: `customTheme={{
  rowSeparatorWidth: 2
}}`,
  },
  {
    key: "borderWidth",
    name: "borderWidth",
    required: false,
    description:
      "General border width in pixels (e.g., table borders, header borders). This value affects layout calculations and cannot be styled through CSS. If not specified, uses the default value of 1px.",
    type: "number",
    example: `customTheme={{
  borderWidth: 2
}}`,
  },
  {
    key: "pinnedBorderWidth",
    name: "pinnedBorderWidth",
    required: false,
    description:
      "Width of borders for pinned columns in pixels. This value affects layout calculations for pinned columns and cannot be styled through CSS. If not specified, uses the default value of 2px.",
    type: "number",
    example: `customTheme={{
  pinnedBorderWidth: 3
}}`,
  },
  {
    key: "nestedGridBorderWidth",
    name: "nestedGridBorderWidth",
    required: false,
    description:
      "Border width for nested grid tables (top + bottom) in pixels. This value affects nested table layout calculations and cannot be styled through CSS. If not specified, uses the default value of 2px.",
    type: "number",
    example: `customTheme={{
  nestedGridBorderWidth: 3
}}`,
  },
  {
    key: "nestedGridPaddingTop",
    name: "nestedGridPaddingTop",
    required: false,
    description:
      "Top padding for nested grids in pixels. This value affects nested table layout calculations and cannot be styled through CSS. If not specified, uses the default value of 8px.",
    type: "number",
    example: `customTheme={{
  nestedGridPaddingTop: 12
}}`,
  },
  {
    key: "nestedGridPaddingBottom",
    name: "nestedGridPaddingBottom",
    required: false,
    description:
      "Bottom padding for nested grids in pixels. This value affects nested table layout calculations and cannot be styled through CSS. If not specified, uses the default value of 8px.",
    type: "number",
    example: `customTheme={{
  nestedGridPaddingBottom: 12
}}`,
  },
  {
    key: "nestedGridPaddingLeft",
    name: "nestedGridPaddingLeft",
    required: false,
    description:
      "Left padding for nested grids in pixels. This value affects nested table layout calculations and cannot be styled through CSS. If not specified, uses the default value of 16px.",
    type: "number",
    example: `customTheme={{
  nestedGridPaddingLeft: 20
}}`,
  },
  {
    key: "nestedGridPaddingRight",
    name: "nestedGridPaddingRight",
    required: false,
    description:
      "Right padding for nested grids in pixels. This value affects nested table layout calculations and cannot be styled through CSS. If not specified, uses the default value of 16px.",
    type: "number",
    example: `customTheme={{
  nestedGridPaddingRight: 20
}}`,
  },
  {
    key: "nestedGridMaxHeight",
    name: "nestedGridMaxHeight",
    required: false,
    description:
      "Maximum height for nested grids in pixels. This value controls how tall nested tables can grow before scrolling. If not specified, nested grids will grow to fit their content.",
    type: "number",
    example: `customTheme={{
  nestedGridMaxHeight: 400
}}`,
  },
  {
    key: "selectionColumnWidth",
    name: "selectionColumnWidth",
    required: false,
    description:
      "Width of the row selection checkbox column in pixels. This value affects layout calculations and cannot be styled through CSS. If not specified, uses the default value of 40px.",
    type: "number",
    example: `customTheme={{
  selectionColumnWidth: 50
}}`,
  },
];
