import { renderColumnResizingDemo } from "./demos/column-resizing/ColumnResizingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnResizingDemo(container, { height: "500px" });