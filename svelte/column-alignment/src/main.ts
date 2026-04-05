import { mount } from "svelte";
import Demo from "./demos/column-alignment/ColumnAlignmentDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});