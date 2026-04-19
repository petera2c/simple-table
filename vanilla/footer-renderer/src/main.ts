import { renderFooterRendererDemo } from "./demos/footer-renderer/FooterRendererDemo";

const container = document.getElementById("root")!;
const instance = renderFooterRendererDemo(container, {});
if (instance?.mount) instance.mount();