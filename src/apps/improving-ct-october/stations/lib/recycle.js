import { RecycleBinManager } from "../../../../shell/explorer/file-operations/recycle-bin-manager.js";

export const RECYCLE_PATH = "/C:/Recycled";

export async function pathExists(fs, path) {
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

async function pickOriginalName(fs, existingEntry, baseName, originalDir, bytes) {
  if (existingEntry && existingEntry.originalName)
    return existingEntry.originalName;
  for (let i = 0; ; i++) {
    const candidate = variantName(baseName, i);
    const candidatePath = `${originalDir}/${candidate}`;
    if (!(await pathExists(fs, candidatePath))) return candidate;
    if (await isOwnCopy(fs, candidatePath, bytes)) return candidate;
  }
}

export async function writeBinItem(fs, { id, bytes, originalDir, baseName, deletionDate }) {
  const itemPath = `${RECYCLE_PATH}/${id}`;

  await fs.promises.mkdir(RECYCLE_PATH, { recursive: true });
  await fs.promises.writeFile(itemPath, bytes);

  const metadata = await RecycleBinManager.getMetadata(RECYCLE_PATH);
  const name = await pickOriginalName(fs, metadata[id], baseName, originalDir, bytes);
  const originalPath = `${originalDir}/${name}`;

  metadata[id] = {
    id,
    originalPath,
    originalName: name,
    deletionDate: deletionDate || new Date().toISOString(),
  };
  for (let attempt = 0; attempt < 5; attempt++) {
    await RecycleBinManager.saveMetadata(RECYCLE_PATH, metadata);
    const verify = await RecycleBinManager.getMetadata(RECYCLE_PATH);
    if (verify[id]?.originalPath === originalPath) break;
    await new Promise((r) => setTimeout(r, 400));
  }

  await RecycleBinManager.refreshFullState();
  document.dispatchEvent(new CustomEvent("recycle-bin-change"));

  return { id, originalPath };
}

export async function removeBinItem(fs, { id, originalPath }) {
  const itemPath = `${RECYCLE_PATH}/${id}`;

  try {
    await fs.promises.unlink(itemPath);
  } catch {}

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const metadata = await RecycleBinManager.getMetadata(RECYCLE_PATH);
      if (!metadata[id]) break;
      delete metadata[id];
      await RecycleBinManager.saveMetadata(RECYCLE_PATH, metadata);
      const verify = await RecycleBinManager.getMetadata(RECYCLE_PATH);
      if (!verify[id]) break;
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
