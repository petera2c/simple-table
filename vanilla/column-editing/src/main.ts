import { renderColumnEditingDemo } from "./demos/column-editing/ColumnEditingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnEditingDemo(container, { height: "500px" });