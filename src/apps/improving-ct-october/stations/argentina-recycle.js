import { RecycleBinManager } from "../../../shell/explorer/file-operations/recycle-bin-manager.js";
import clueUrl from "./assets/argentina-clue.png?url";

const ITEM_ID = "ct-argentina-clue";
const RECYCLE_PATH = "/C:/Recycled";
const BASE_NAME = "IMG_0001.png";
const ORIGINAL_DIR = "/C:/My Documents";

async function pathExists(fs, path) {
  try {
    await fs.promises.stat(path);
    return true;
  } catch {
    return false;
  }
}

function variantName(name, index) {
  if (index === 0) return name;
  const dot = name.lastIndexOf(".");
  return `${name.slice(0, dot)}_${index}${name.slice(dot)}`;
}

async function isOwnCopy(fs, path, bytes) {
  try {
    const existing = new Uint8Array(await fs.promises.readFile(path));
    if (existing.length !== bytes.length) return false;
    return existing.every((b, i) => b === bytes[i]);
  } catch {
    return false;
  }
}

async function pickOriginalName(fs, existingEntry, bytes) {
  if (existingEntry && existingEntry.originalName)
    return existingEntry.originalName;
  for (let i = 0; ; i++) {
    const candidate = variantName(BASE_NAME, i);
    const candidatePath = `${ORIGINAL_DIR}/${candidate}`;
    if (!(await pathExists(fs, candidatePath))) return candidate;
    if (await isOwnCopy(fs, candidatePath, bytes)) return candidate;
  }
}

export const id = "recycle-clue";

export async function apply(ctx) {
  const { fs } = ctx;
  const itemPath = `${RECYCLE_PATH}/${ITEM_ID}`;

  await fs.promises.mkdir(RECYCLE_PATH, { recursive: true });

  const response = await fetch(clueUrl);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await fs.promises.writeFile(itemPath, bytes);

  const metadata = await RecycleBinManager.getMetadata(RECYCLE_PATH);
  const name = await pickOriginalName(fs, metadata[ITEM_ID], bytes);
  const originalPath = `${ORIGINAL_DIR}/${name}`;

  metadata[ITEM_ID] = {
    id: ITEM_ID,
    originalPath,
    originalName: name,
    deletionDate: new Date().toISOString(),
  };
  for (let attempt = 0; attempt < 5; attempt++) {
    await RecycleBinManager.saveMetadata(RECYCLE_PATH, metadata);
    const verify = await RecycleBinManager.getMetadata(RECYCLE_PATH);
    if (verify[ITEM_ID]?.originalPath === originalPath) break;
    await new Promise((r) => setTimeout(r, 400));
  }

  await RecycleBinManager.refreshFullState();
  document.dispatchEvent(new CustomEvent("recycle-bin-change"));

  return { id: ITEM_ID, originalPath };
}

export async function remove(ctx, manifest) {
  const { fs } = ctx;
  const itemPath = `${RECYCLE_PATH}/${ITEM_ID}`;
  const originalPath = manifest && manifest.originalPath;

  try {
    await fs.promises.unlink(itemPath);
  } catch {}

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const metadata = await RecycleBinManager.getMetadata(RECYCLE_PATH);
      if (!metadata[ITEM_ID]) break;
      delete metadata[ITEM_ID];
      await RecycleBinManager.saveMetadata(RECYCLE_PATH, metadata);
      const verify = await RecycleBinManager.getMetadata(RECYCLE_PATH);
      if (!verify[ITEM_ID]) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }

  if (originalPath) {
    try {
      await fs.promises.unlink(originalPath);
    } catch {}
  }

  try {
    await RecycleBinManager.refreshFullState();
  } catch {}
  document.dispatchEvent(new CustomEvent("recycle-bin-change"));
}
