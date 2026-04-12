import { renderCellClickingDemo } from "./demos/cell-clicking/CellClickingDemo";

const container = document.getElementById("root")!;
const instance = renderCellClickingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();