import { renderCustomIconsDemo } from "./demos/custom-icons/CustomIconsDemo";

const container = document.getElementById("root")!;
const instance = renderCustomIconsDemo(container, {});
if (instance?.mount) instance.mount();