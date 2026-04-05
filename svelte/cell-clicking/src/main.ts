import { mount } from "svelte";
import Demo from "./demos/cell-clicking/CellClickingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});