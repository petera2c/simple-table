import { mount } from "svelte";
import Demo from "./demos/table-height/TableHeightDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});