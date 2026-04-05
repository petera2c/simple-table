import { mount } from "svelte";
import Demo from "./demos/hr/HRDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});