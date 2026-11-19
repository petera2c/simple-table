import { renderColumnPinningDemo } from "./demos/column-pinning/ColumnPinningDemo";

const container = document.getElementById("root")!;
const instance = renderColumnPinningDemo(container, {});
if (instance?.mount) instance.mount();