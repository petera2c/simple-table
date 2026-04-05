import { mount } from "svelte";
import Demo from "./demos/column-width/ColumnWidthDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});