import type { PropInfo } from "./types";

export const FOOTER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "currentPage",
    name: "currentPage",
    required: true,
    description: "The current page number (1-based index).",
    type: "number",
    example: `props.currentPage // 1, 2, 3, etc.`,
  },
  {
    key: "startRow",
    name: "startRow",
    required: true,
    description: "The starting row number for the current page (1-based index).",
    type: "number",
    example: `props.startRow // 1, 11, 21, etc.`,
  },
  {
    key: "endRow",
    name: "endRow",
    required: true,
    description: "The ending row number for the current page (1-based index).",
    type: "number",
    example: `props.endRow // 10, 20, 30, etc.`,
  },
  {
    key: "totalRows",
    name: "totalRows",
    required: true,
    description: "The total number of rows in the table.",
    type: "number",
    example: `props.totalRows // 100, 250, etc.`,
  },
  {
    key: "totalPages",
    name: "totalPages",
    required: true,
    description: "The total number of pages based on rowsPerPage.",
    type: "number",
    example: `props.totalPages // 5, 10, etc.`,
  },
  {
    key: "rowsPerPage",
    name: "rowsPerPage",
    required: true,
    description: "The number of rows displayed per page.",
    type: "number",
    example: `props.rowsPerPage // 10, 25, 50, etc.`,
  },
  {
    key: "hasPrevPage",
    name: "hasPrevPage",
    required: true,
    description: "Boolean indicating if there is a previous page available.",
    type: "boolean",
    example: `props.hasPrevPage // true or false`,
  },
  {
    key: "hasNextPage",
    name: "hasNextPage",
    required: true,
    description: "Boolean indicating if there is a next page available.",
    type: "boolean",
    example: `props.hasNextPage // true or false`,
  },
  {
    key: "onPrevPage",
    name: "onPrevPage",
    required: true,
    description: "Function to navigate to the previous page.",
    type: "() => void",
    example: `<button onClick={props.onPrevPage} disabled={!props.hasPrevPage}>
  Previous
</button>`,
  },
  {
    key: "onNextPage",
    name: "onNextPage",
    required: true,
    description: "Async function to navigate to the next page.",
    type: "() => Promise<void>",
    example: `<button onClick={props.onNextPage} disabled={!props.hasNextPage}>
  Next
</button>`,
  },
  {
    key: "onPageChange",
    name: "onPageChange",
    required: true,
    description: "Function to navigate to a specific page number.",
    type: "(page: number) => void",
    example: `<button onClick={() => props.onPageChange(3)}>
  Go to Page 3
</button>`,
  },
  {
    key: "prevIcon",
    name: "prevIcon",
    required: false,
    description: "Optional custom icon for the previous page button.",
    type: "ReactNode",
    example: `props.prevIcon // Custom icon component`,
  },
  {
    key: "nextIcon",
    name: "nextIcon",
    required: false,
    description: "Optional custom icon for the next page button.",
    type: "ReactNode",
    example: `props.nextIcon // Custom icon component`,
  },
];
