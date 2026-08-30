import { renderCryptoDemo } from "./demos/crypto/CryptoDemo";

const container = document.getElementById("root")!;
const instance = renderCryptoDemo(container, {});
if (instance?.mount) instance.mount();