import { renderColumnPinningDemo } from "./demos/column-pinning/ColumnPinningDemo";

const container = document.getElementById("root")!;
const instance = renderColumnPinningDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();