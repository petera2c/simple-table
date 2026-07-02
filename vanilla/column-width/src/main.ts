import { renderColumnWidthDemo } from "./demos/column-width/ColumnWidthDemo";

const container = document.getElementById("root")!;
const instance = renderColumnWidthDemo(container, {});
if (instance?.mount) instance.mount();