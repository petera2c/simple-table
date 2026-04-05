import { renderSingleRowChildrenDemo } from "./demos/single-row-children/SingleRowChildrenDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderSingleRowChildrenDemo(container, { height: "500px" });