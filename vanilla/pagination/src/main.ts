import { renderPaginationDemo } from "./demos/pagination/PaginationDemo";

const container = document.getElementById("root")!;
const instance = renderPaginationDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();