import { renderColumnSortingDemo } from "./demos/column-sorting/ColumnSortingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnSortingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();