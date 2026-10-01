import { renderPaginationDemo } from "./demos/pagination/PaginationDemo";

const container = document.getElementById("root")!;
const instance = renderPaginationDemo(container, {});
if (instance?.mount) instance.mount();