import { mount } from "svelte";
import Demo from "./demos/programmatic-control/ProgrammaticControlDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});