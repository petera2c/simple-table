import { mount } from "svelte";
import Demo from "./demos/header-renderer/HeaderRendererDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});