import { renderMusicDemo } from "./demos/music/MusicDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderMusicDemo(container, { height: "500px" });