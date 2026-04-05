import { renderLiveUpdateDemo } from "./demos/live-update/LiveUpdateDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderLiveUpdateDemo(container, { height: "500px" });