import { renderColumnFilteringDemo } from "./demos/column-filtering/ColumnFilteringDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnFilteringDemo(container, { height: "500px" });