import { renderHRDemo } from "./demos/hr/HRDemo";

const container = document.getElementById("root")!;
const instance = renderHRDemo(container, {});
if (instance?.mount) instance.mount();