import { renderColumnPinningDemo } from "./demos/column-pinning/ColumnPinningDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnPinningDemo(container, { height: "500px" });