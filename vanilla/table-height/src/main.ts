import { renderTableHeightDemo } from "./demos/table-height/TableHeightDemo";

const container = document.getElementById("root")!;
const instance = renderTableHeightDemo(container, {});
if (instance?.mount) instance.mount();