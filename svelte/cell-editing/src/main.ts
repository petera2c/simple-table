import { mount } from "svelte";
import Demo from "./demos/cell-editing/CellEditingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});