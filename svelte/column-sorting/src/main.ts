import { mount } from "svelte";
import Demo from "./demos/column-sorting/ColumnSortingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});