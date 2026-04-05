import { renderColumnReorderingDemo } from "./demos/column-reordering/ColumnReorderingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnReorderingDemo(container, { height: "500px" });