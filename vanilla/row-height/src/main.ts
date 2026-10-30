import { renderRowHeightDemo } from "./demos/row-height/RowHeightDemo";

const container = document.getElementById("root")!;
const instance = renderRowHeightDemo(container, {});
if (instance?.mount) instance.mount();