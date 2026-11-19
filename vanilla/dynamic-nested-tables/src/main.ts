import { renderDynamicNestedTablesDemo } from "./demos/dynamic-nested-tables/DynamicNestedTablesDemo";

const container = document.getElementById("root")!;
const instance = renderDynamicNestedTablesDemo(container, {});
if (instance?.mount) instance.mount();