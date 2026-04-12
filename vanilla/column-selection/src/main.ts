import { renderColumnSelectionDemo } from "./demos/column-selection/ColumnSelectionDemo";

const container = document.getElementById("root")!;
const instance = renderColumnSelectionDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();