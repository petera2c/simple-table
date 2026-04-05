import { renderDynamicNestedTablesDemo } from "./demos/dynamic-nested-tables/DynamicNestedTablesDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderDynamicNestedTablesDemo(container, { height: "500px" });