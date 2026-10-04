import { renderPivotDemo } from "./demos/pivot/PivotDemo";

const container = document.getElementById("root")!;
const instance = renderPivotDemo(container, {});
if (instance?.mount) instance.mount();