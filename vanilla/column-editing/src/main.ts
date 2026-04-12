import { renderColumnEditingDemo } from "./demos/column-editing/ColumnEditingDemo";

const container = document.getElementById("root")!;
const instance = renderColumnEditingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();