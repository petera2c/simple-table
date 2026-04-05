import { mount } from "svelte";
import Demo from "./demos/infrastructure/InfrastructureDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});