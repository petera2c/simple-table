import { mount } from "svelte";
import Demo from "./demos/manufacturing/ManufacturingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});