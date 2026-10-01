import { renderCRMDemo } from "./demos/crm/CRMDemo";

const container = document.getElementById("root")!;
const instance = renderCRMDemo(container, {});
if (instance?.mount) instance.mount();