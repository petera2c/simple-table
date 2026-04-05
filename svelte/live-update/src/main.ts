import { mount } from "svelte";
import Demo from "./demos/live-update/LiveUpdateDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});