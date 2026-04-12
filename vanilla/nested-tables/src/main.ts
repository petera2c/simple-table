import { renderNestedTablesDemo } from "./demos/nested-tables/NestedTablesDemo";

const container = document.getElementById("root")!;
const instance = renderNestedTablesDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();