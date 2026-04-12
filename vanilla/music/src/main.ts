import { renderMusicDemo } from "./demos/music/MusicDemo";

const container = document.getElementById("root")!;
const instance = renderMusicDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();