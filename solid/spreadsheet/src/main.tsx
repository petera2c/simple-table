import { render } from "solid-js/web";
import Demo from "./demos/spreadsheet/SpreadsheetDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);