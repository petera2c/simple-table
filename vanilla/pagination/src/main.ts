import { renderPaginationDemo } from "./demos/pagination/PaginationDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderPaginationDemo(container, { height: "500px" });