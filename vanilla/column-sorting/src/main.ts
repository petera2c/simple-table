import { renderColumnSortingDemo } from "./demos/column-sorting/ColumnSortingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnSortingDemo(container, {});
if (instance?.mount) instance.mount();