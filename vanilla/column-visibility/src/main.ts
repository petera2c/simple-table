import { renderColumnVisibilityDemo } from "./demos/column-visibility/ColumnVisibilityDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnVisibilityDemo(container, { height: "500px" });