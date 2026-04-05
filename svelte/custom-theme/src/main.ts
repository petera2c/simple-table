import { mount } from "svelte";
import Demo from "./demos/custom-theme/CustomThemeDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});