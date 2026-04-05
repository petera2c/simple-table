import { mount } from "svelte";
import Demo from "./demos/themes/ThemesDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});