import { renderSpreadsheetDemo } from "./demos/spreadsheet/SpreadsheetDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderSpreadsheetDemo(container, { height: "500px" });