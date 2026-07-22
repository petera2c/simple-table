import { renderRowSelectionDemo } from "./demos/row-selection/RowSelectionDemo";

const container = document.getElementById("root")!;
const instance = renderRowSelectionDemo(container, {});
if (instance?.mount) instance.mount();