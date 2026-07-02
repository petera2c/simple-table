import { renderCsvExportDemo } from "./demos/csv-export/CsvExportDemo";

const container = document.getElementById("root")!;
const instance = renderCsvExportDemo(container, {});
if (instance?.mount) instance.mount();