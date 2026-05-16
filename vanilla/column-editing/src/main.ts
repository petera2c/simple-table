import { renderColumnEditingDemo } from "./demos/column-editing/ColumnEditingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnEditingDemo(container, {});
if (instance?.mount) instance.mount();