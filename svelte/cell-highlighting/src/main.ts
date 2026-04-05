import { mount } from "svelte";
import Demo from "./demos/cell-highlighting/CellHighlightingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});