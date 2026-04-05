import { renderCellHighlightingDemo } from "./demos/cell-highlighting/CellHighlightingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCellHighlightingDemo(container, { height: "500px" });