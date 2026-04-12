import { renderCellEditingDemo } from "./demos/cell-editing/CellEditingDemo";

const container = document.getElementById("root")!;
const instance = renderCellEditingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();