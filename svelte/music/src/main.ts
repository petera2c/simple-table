import { mount } from "svelte";
import Demo from "./demos/music/MusicDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});