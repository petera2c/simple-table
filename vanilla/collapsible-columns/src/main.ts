import { renderCollapsibleColumnsDemo } from "./demos/collapsible-columns/CollapsibleColumnsDemo";

const container = document.getElementById("root")!;
const instance = renderCollapsibleColumnsDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();