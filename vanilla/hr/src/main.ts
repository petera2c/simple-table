import { renderHRDemo } from "./demos/hr/HRDemo";

const container = document.getElementById("root")!;
const instance = renderHRDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();