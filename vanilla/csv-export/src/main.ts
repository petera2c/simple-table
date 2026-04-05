import { renderCsvExportDemo } from "./demos/csv-export/CsvExportDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCsvExportDemo(container, { height: "500px" });