import { renderLoadingStateDemo } from "./demos/loading-state/LoadingStateDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderLoadingStateDemo(container, { height: "500px" });