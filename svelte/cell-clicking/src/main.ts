import { mount } from "svelte";
import Demo from "./demos/cell-clicking/CellClickingDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});