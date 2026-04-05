import { mount } from "svelte";
import Demo from "./demos/external-filter/ExternalFilterDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});