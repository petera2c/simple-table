import { mount } from "svelte";
import Demo from "./demos/column-filtering/ColumnFilteringDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});