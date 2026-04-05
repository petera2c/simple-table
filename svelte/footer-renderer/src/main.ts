import { mount } from "svelte";
import Demo from "./demos/footer-renderer/FooterRendererDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});