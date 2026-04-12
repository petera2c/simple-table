import { render } from "solid-js/web";
import Demo from "./demos/csv-export/CsvExportDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);