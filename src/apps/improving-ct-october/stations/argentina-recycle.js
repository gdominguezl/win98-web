import { writeBinItem, removeBinItem } from "./lib/recycle.js";
import clueUrl from "./assets/argentina-clue.png?url";

const ITEM_ID = "ct-argentina-clue";
const BASE_NAME = "IMG_0001.png";
const ORIGINAL_DIR = "/C:/My Documents";

export const id = "recycle-clue";

export async function apply(ctx) {
  const { fs } = ctx;
  const response = await fetch(clueUrl);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return writeBinItem(fs, {
    id: ITEM_ID,
    bytes,
    originalDir: ORIGINAL_DIR,
    baseName: BASE_NAME,
  });
}

export async function remove(ctx, manifest) {
  const { fs } = ctx;
  await removeBinItem(fs, {
    id: ITEM_ID,
    originalPath: manifest && manifest.originalPath,
  });
}
