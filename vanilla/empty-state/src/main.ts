import { renderEmptyStateDemo } from "./demos/empty-state/EmptyStateDemo";

const container = document.getElementById("root")!;
const instance = renderEmptyStateDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();