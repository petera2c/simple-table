import { renderAnalyticsDemo } from "./demos/analytics/AnalyticsDemo";

const container = document.getElementById("root")!;
const instance = renderAnalyticsDemo(container, {});
if (instance?.mount) instance.mount();