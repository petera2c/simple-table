import { mount } from "svelte";
import Demo from "./demos/row-height/RowHeightDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});