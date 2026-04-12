import { renderLiveUpdateDemo } from "./demos/live-update/LiveUpdateDemo";

const container = document.getElementById("root")!;
const instance = renderLiveUpdateDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();