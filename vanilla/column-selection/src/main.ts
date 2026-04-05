import { renderColumnSelectionDemo } from "./demos/column-selection/ColumnSelectionDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnSelectionDemo(container, { height: "500px" });