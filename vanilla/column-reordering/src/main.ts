import { renderColumnReorderingDemo } from "./demos/column-reordering/ColumnReorderingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnReorderingDemo(container, {});
if (instance?.mount) instance.mount();