import { renderHeaderRendererDemo } from "./demos/header-renderer/HeaderRendererDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderHeaderRendererDemo(container, { height: "500px" });