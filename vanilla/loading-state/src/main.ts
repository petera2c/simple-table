import { renderLoadingStateDemo } from "./demos/loading-state/LoadingStateDemo";

const container = document.getElementById("root")!;
const instance = renderLoadingStateDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();