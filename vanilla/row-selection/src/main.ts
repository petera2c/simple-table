import { renderRowSelectionDemo } from "./demos/row-selection/RowSelectionDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderRowSelectionDemo(container, { height: "500px" });