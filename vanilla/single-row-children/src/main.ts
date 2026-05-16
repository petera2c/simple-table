import { renderSingleRowChildrenDemo } from "./demos/single-row-children/SingleRowChildrenDemo";

const container = document.getElementById("root")!;
const instance = renderSingleRowChildrenDemo(container, {});
if (instance?.mount) instance.mount();