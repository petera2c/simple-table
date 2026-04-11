import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the public directory exists
const publicDir = join(__dirname, "../public");
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Convert SVG to PNG
sharp(join(publicDir, "og-image.svg"))
  .resize(1200, 630, {
    fit: "contain",
    background: { r: 248, g: 250, b: 252, alpha: 1 },
  })
  .png()
  .toFile(join(publicDir, "og-image.png"))
  .then(() => {
    console.log("OG image generated successfully!");
  })
  .catch((err) => {
    console.error("Error generating OG image:", err);
  });
