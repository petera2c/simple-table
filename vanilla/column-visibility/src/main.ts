import { renderColumnVisibilityDemo } from "./demos/column-visibility/ColumnVisibilityDemo";

const container = document.getElementById("root")!;
const instance = renderColumnVisibilityDemo(container, {});
if (instance?.mount) instance.mount();