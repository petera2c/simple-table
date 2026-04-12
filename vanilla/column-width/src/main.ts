import { renderColumnWidthDemo } from "./demos/column-width/ColumnWidthDemo";

const container = document.getElementById("root")!;
const instance = renderColumnWidthDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();