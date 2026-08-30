import { renderMusicDemo } from "./demos/music/MusicDemo";

const container = document.getElementById("root")!;
const instance = renderMusicDemo(container, {});
if (instance?.mount) instance.mount();