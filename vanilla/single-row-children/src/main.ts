import { renderSingleRowChildrenDemo } from "./demos/single-row-children/SingleRowChildrenDemo";

const container = document.getElementById("root")!;
const instance = renderSingleRowChildrenDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();