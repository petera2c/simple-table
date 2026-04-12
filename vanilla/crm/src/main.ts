import { renderCRMDemo } from "./demos/crm/CRMDemo";

const container = document.getElementById("root")!;
const instance = renderCRMDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();