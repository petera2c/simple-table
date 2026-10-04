import { renderAggregateFunctionsDemo } from "./demos/aggregate-functions/AggregateFunctionsDemo";

const container = document.getElementById("root")!;
const instance = renderAggregateFunctionsDemo(container, {});
if (instance?.mount) instance.mount();