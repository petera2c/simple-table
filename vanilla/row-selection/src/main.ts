import { renderRowSelectionDemo } from "./demos/row-selection/RowSelectionDemo";

const container = document.getElementById("root")!;
const instance = renderRowSelectionDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();