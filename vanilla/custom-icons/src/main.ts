import { renderCustomIconsDemo } from "./demos/custom-icons/CustomIconsDemo";

const container = document.getElementById("root")!;
const instance = renderCustomIconsDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();