import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public/logo-mark.svg");
const svg = readFileSync(svgPath);

await sharp(svg).resize(192, 192).png().toFile(join(root, "public/pwa-192x192.png"));
await sharp(svg).resize(512, 512).png().toFile(join(root, "public/pwa-512x512.png"));

console.log("Wrote public/pwa-192x192.png and public/pwa-512x512.png from logo-mark.svg");
