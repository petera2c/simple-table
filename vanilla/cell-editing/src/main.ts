import { renderCellEditingDemo } from "./demos/cell-editing/CellEditingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCellEditingDemo(container, { height: "500px" });