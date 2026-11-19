import { renderCollapsibleColumnsDemo } from "./demos/collapsible-columns/CollapsibleColumnsDemo";

const container = document.getElementById("root")!;
const instance = renderCollapsibleColumnsDemo(container, {});
if (instance?.mount) instance.mount();