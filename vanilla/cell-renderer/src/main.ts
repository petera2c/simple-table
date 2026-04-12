import { renderCellRendererDemo } from "./demos/cell-renderer/CellRendererDemo";

const container = document.getElementById("root")!;
const instance = renderCellRendererDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();