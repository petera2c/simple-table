import { mount } from "svelte";
import Demo from "./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});