// The World Today - Sunday, 22 November 2026.
// Entry point: place the pre-rendered poster image where the harness
// expects it, at $MAKEFUN_OUTPUT_DIR/entry.png (or /output by default).
// The poster itself is drawn from poster.html by render.mjs; this file
// only moves the finished bytes, so both runs produce identical output.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const folder = dirname(fileURLToPath(import.meta.url));
const posterPath = join(folder, "entry.png");
const outFolder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outFolder, "entry.png");

const imageBytes = readFileSync(posterPath);
if (!existsSync(outFolder)) {
  mkdirSync(outFolder, { recursive: true });
}
writeFileSync(outPath, imageBytes);
console.log(`poster copied to ${outPath} (${imageBytes.length} bytes)`);
