import { mount } from "svelte";
import Demo from "./demos/music/MusicDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});