import { mount } from "svelte";
import Demo from "./demos/column-resizing/ColumnResizingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});