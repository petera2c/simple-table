import { mount } from "svelte";
import Demo from "./demos/csv-export/CsvExportDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});