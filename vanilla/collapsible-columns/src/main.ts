import { renderCollapsibleColumnsDemo } from "./demos/collapsible-columns/CollapsibleColumnsDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCollapsibleColumnsDemo(container, { height: "500px" });