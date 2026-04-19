import { renderColumnFilteringDemo } from "./demos/column-filtering/ColumnFilteringDemo";

const container = document.getElementById("root")!;
const instance = renderColumnFilteringDemo(container, {});
if (instance?.mount) instance.mount();