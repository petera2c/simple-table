import { renderColumnSortingDemo } from "./demos/column-sorting/ColumnSortingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnSortingDemo(container, { height: "500px" });