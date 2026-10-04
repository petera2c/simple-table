import { renderCellRendererDemo } from "./demos/cell-renderer/CellRendererDemo";

const container = document.getElementById("root")!;
const instance = renderCellRendererDemo(container, {});
if (instance?.mount) instance.mount();