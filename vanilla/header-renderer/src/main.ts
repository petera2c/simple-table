import { renderHeaderRendererDemo } from "./demos/header-renderer/HeaderRendererDemo";

const container = document.getElementById("root")!;
const instance = renderHeaderRendererDemo(container, {});
if (instance?.mount) instance.mount();