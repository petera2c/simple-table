import { renderTableHeightDemo } from "./demos/table-height/TableHeightDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderTableHeightDemo(container, { height: "500px" });