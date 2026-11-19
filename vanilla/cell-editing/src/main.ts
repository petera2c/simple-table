import { renderCellEditingDemo } from "./demos/cell-editing/CellEditingDemo";

const container = document.getElementById("root")!;
const instance = renderCellEditingDemo(container, {});
if (instance?.mount) instance.mount();