import { renderCellHighlightingDemo } from "./demos/cell-highlighting/CellHighlightingDemo";

const container = document.getElementById("root")!;
const instance = renderCellHighlightingDemo(container, {});
if (instance?.mount) instance.mount();