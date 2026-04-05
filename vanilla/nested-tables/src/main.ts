import { renderNestedTablesDemo } from "./demos/nested-tables/NestedTablesDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderNestedTablesDemo(container, { height: "500px" });