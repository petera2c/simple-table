import { renderColumnResizingDemo } from "./demos/column-resizing/ColumnResizingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnResizingDemo(container, {});
if (instance?.mount) instance.mount();