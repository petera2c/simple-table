import { renderCellClickingDemo } from "./demos/cell-clicking/CellClickingDemo";

const container = document.getElementById("root")!;
const instance = renderCellClickingDemo(container, {});
if (instance?.mount) instance.mount();