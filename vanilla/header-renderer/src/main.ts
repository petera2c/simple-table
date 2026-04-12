import { renderHeaderRendererDemo } from "./demos/header-renderer/HeaderRendererDemo";

const container = document.getElementById("root")!;
const instance = renderHeaderRendererDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();