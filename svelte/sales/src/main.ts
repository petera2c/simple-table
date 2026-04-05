import { mount } from "svelte";
import Demo from "./demos/sales/SalesDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});