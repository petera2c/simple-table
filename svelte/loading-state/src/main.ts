import { mount } from "svelte";
import Demo from "./demos/loading-state/LoadingStateDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});