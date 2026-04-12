import { renderCellHighlightingDemo } from "./demos/cell-highlighting/CellHighlightingDemo";

const container = document.getElementById("root")!;
const instance = renderCellHighlightingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();