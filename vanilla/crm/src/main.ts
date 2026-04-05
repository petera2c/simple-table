import { renderCRMDemo } from "./demos/crm/CRMDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCRMDemo(container, { height: "500px" });