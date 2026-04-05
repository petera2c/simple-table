import { renderRowHeightDemo } from "./demos/row-height/RowHeightDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderRowHeightDemo(container, { height: "500px" });