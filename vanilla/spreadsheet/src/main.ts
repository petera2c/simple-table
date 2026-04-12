import { renderSpreadsheetDemo } from "./demos/spreadsheet/SpreadsheetDemo";

const container = document.getElementById("root")!;
const instance = renderSpreadsheetDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();