import {
  setHelpOverride,
  setStartDirOverride,
} from "../../../system/dos-shell.js";
import planoText from "./assets/plano.txt?raw";

const FOLDER = "/C:/THROWBACK";

const FILES = {
  "MEMORY.TXT":
    "MEMORY BANK UNAVAILABLE.\nACCESS RESERVED FOR FINAL DIAGNOSTIC.",
  "ERROR.LOG":
    "23:51 — CLOCK DESYNCHRONIZED\n23:54 — AUDIO MEMORY RECOVERED\n23:57 — LOCATION MAP CORRUPTED\n23:59 — AGE CALCULATION FAILED",
};

const HELP_LINES = [
  "DIR             Muestra los archivos disponibles.",
  "TYPE ARCHIVO    Abre un archivo de texto.",
  "CD CARPETA      Ingresa a una carpeta.",
  "",
  "CLS             Limpia la pantalla.",
  "HELP            Muestra esta ayuda.",
  "EXIT            Cierra esta ventana.",
];

async function writeVerified(fs, path, content, expected) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await fs.promises.writeFile(path, content);
    try {
      const read = await fs.promises.readFile(path);
      const bytes =
        typeof read === "string" ? new TextEncoder().encode(read) : read;
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

export const id = "throwback-folder";

export async function apply(ctx) {
  const { fs } = ctx;
  await fs.promises.mkdir(FOLDER, { recursive: true });

  const encoder = new TextEncoder();
  for (const [name, text] of Object.entries(FILES)) {
    await writeVerified(fs, `${FOLDER}/${name}`, text, encoder.encode(text));
  }
  await writeVerified(fs, `${FOLDER}/PLANO.TXT`, planoText, encoder.encode(planoText));

  setHelpOverride(HELP_LINES);
  setStartDirOverride("C:\\");
  return { folder: FOLDER };
}

export async function remove(ctx) {
  const { fs } = ctx;
  try {
    const entries = await fs.promises.readdir(FOLDER);
    for (const name of entries) {
      try {
        await fs.promises.unlink(`${FOLDER}/${name}`);
      } catch {}
    }
    await fs.promises.rmdir(FOLDER);
  } catch {}
  setHelpOverride(null);
  setStartDirOverride(null);
}
