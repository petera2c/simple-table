import { mount } from "svelte";
import Demo from "./demos/row-selection/RowSelectionDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});