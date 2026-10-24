import { writeBinItem, removeBinItem } from "./lib/recycle.js";
import bmpUrl from "./assets/chile-vacaciones.bmp?url";

const ORIGINAL_DIR = "/C:/My Documents";

const ITEMS = [
  {
    id: "ct-chile-1",
    baseName: "VACACIONES_1998.BMP",
    deletionDate: "1999-12-31T23:41:00.000Z",
    load: async () => {
      const response = await fetch(bmpUrl);
      return new Uint8Array(await response.arrayBuffer());
    },
  },
  {
    id: "ct-chile-2",
    baseName: "TAREA_FINAL_FINAL.DOC",
    deletionDate: "1999-12-31T23:47:00.000Z",
    text: "TAREA DE MS-DOS - VERSION FINAL FINAL\n\nEntregar antes del 31/12/1999.\nPendiente: revisar la memoria correcta.\nNo entregar copias.",
  },
  {
    id: "ct-chile-3",
    baseName: "NO_ABRIR.TXT",
    deletionDate: "1999-12-31T23:52:00.000Z",
    text: "No hay nada aqui. Te lo dije.",
  },
  {
    id: "ct-chile-4",
    baseName: "BACKUP_2359.TXT",
    deletionDate: "1999-12-31T23:59:00.000Z",
    text: "No todas las papeleras guardan archivos.\nMi version fisica recibe aquello que ya no necesitamos.\nBusca el lugar donde la oficina descarta o recicla sus residuos.",
  },
];

export const id = "recycle-clue";

export async function apply(ctx) {
  const { fs } = ctx;
  const encoder = new TextEncoder();
  const manifests = [];
  for (const item of ITEMS) {
    const bytes = item.load
      ? await item.load()
      : encoder.encode(item.text ?? "");
    const manifest = await writeBinItem(fs, {
      id: item.id,
      bytes,
      originalDir: ORIGINAL_DIR,
      baseName: item.baseName,
      deletionDate: item.deletionDate,
    });
    manifests.push(manifest);
  }
  return { items: manifests };
}

export async function remove(ctx, manifest) {
  const { fs } = ctx;
  const items = manifest && manifest.items;
  for (const item of ITEMS) {
    const owned = items && items.find((m) => m.id === item.id);
    await removeBinItem(fs, {
      id: item.id,
      originalPath: owned && owned.originalPath,
    });
  }
}
