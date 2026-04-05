import { renderFooterRendererDemo } from "./demos/footer-renderer/FooterRendererDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderFooterRendererDemo(container, { height: "500px" });