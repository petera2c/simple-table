import { mount } from "svelte";
import Demo from "./demos/column-visibility/ColumnVisibilityDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});