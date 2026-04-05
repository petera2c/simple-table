import { renderThemesDemo } from "./demos/themes/ThemesDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderThemesDemo(container, { height: "500px" });