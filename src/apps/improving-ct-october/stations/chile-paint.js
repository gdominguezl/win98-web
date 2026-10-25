import { setPaintOpenDefault } from "../../paint/challenge.js";
import bmpUrl from "./assets/puerta.bmp?url";

const PATH = "/C:/My Documents/PUERTA.BMP";

async function writeVerified(fs, path, expected) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await fs.promises.writeFile(path, expected);
    try {
      const bytes = await fs.promises.readFile(path);
      if (bytes.length === expected.length) {
        let equal = true;
        for (let i = 0; i < expected.length; i++) {
          if (bytes[i] !== expected[i]) {
            equal = false;
            break;
          }
        }
        if (equal) return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
}

export const id = "paint-puerta";

export async function apply(ctx) {
  const { fs } = ctx;
  const response = await fetch(bmpUrl);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await fs.promises.mkdir("/C:/My Documents", { recursive: true });
  await writeVerified(fs, PATH, bytes);
  setPaintOpenDefault("bmp");
  return { path: PATH };
}

export async function remove(ctx, manifest) {
  const { fs } = ctx;
  const path = (manifest && manifest.path) || PATH;
  try {
    await fs.promises.unlink(path);
  } catch {}
  setPaintOpenDefault(null);
}
