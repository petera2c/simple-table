import { renderColumnWidthDemo } from "./demos/column-width/ColumnWidthDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnWidthDemo(container, { height: "500px" });