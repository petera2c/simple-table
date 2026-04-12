import { renderTableHeightDemo } from "./demos/table-height/TableHeightDemo";

const container = document.getElementById("root")!;
const instance = renderTableHeightDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();