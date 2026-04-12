import { renderAggregateFunctionsDemo } from "./demos/aggregate-functions/AggregateFunctionsDemo";

const container = document.getElementById("root")!;
const instance = renderAggregateFunctionsDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();