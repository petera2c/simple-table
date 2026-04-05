import { renderCellClickingDemo } from "./demos/cell-clicking/CellClickingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCellClickingDemo(container, { height: "500px" });