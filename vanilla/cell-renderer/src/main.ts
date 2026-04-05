import { renderCellRendererDemo } from "./demos/cell-renderer/CellRendererDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCellRendererDemo(container, { height: "500px" });