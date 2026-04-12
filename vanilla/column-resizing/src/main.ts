import { renderColumnResizingDemo } from "./demos/column-resizing/ColumnResizingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnResizingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();