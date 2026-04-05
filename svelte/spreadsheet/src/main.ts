import { mount } from "svelte";
import Demo from "./demos/spreadsheet/SpreadsheetDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});