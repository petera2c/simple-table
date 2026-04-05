import { renderEmptyStateDemo } from "./demos/empty-state/EmptyStateDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderEmptyStateDemo(container, { height: "500px" });