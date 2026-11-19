import { renderAnimationsDemo } from "./demos/animations/AnimationsDemo";

const container = document.getElementById("root")!;
const instance = renderAnimationsDemo(container, {});
if (instance?.mount) instance.mount();