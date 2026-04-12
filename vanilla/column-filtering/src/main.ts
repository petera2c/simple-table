import { renderColumnFilteringDemo } from "./demos/column-filtering/ColumnFilteringDemo";

const container = document.getElementById("root")!;
const instance = renderColumnFilteringDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();