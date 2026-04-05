import { renderHRDemo } from "./demos/hr/HRDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderHRDemo(container, { height: "500px" });