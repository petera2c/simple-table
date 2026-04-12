import { renderRowHeightDemo } from "./demos/row-height/RowHeightDemo";

const container = document.getElementById("root")!;
const instance = renderRowHeightDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();