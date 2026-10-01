import { renderRowGroupingDemo } from "./demos/row-grouping/RowGroupingDemo";

const container = document.getElementById("root")!;
const instance = renderRowGroupingDemo(container, {});
if (instance?.mount) instance.mount();