import { mount } from "svelte";
import Demo from "./demos/sales/SalesDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});