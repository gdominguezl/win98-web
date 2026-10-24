const FOLDER = "/C:/My Documents/SYSTEM";

const FILES = {
  "ERROR.LOG":
    "Y2K AGE CALCULATION FAILURE\n\nSYSTEM CREATED: 1998\nCURRENT SYSTEM YEAR: 2000\nREPORTED AGE: 100\n\nACTION REQUIRED:\nCALCULATE THE TRUE SYSTEM AGE.\nUSE THE RESULT TO RECOVER THE CORRECT MEMORY.",
  "MEMORY.TXT":
    "MEMORIA 1\nDonde todos pueden cocinar y conversar.\n\nMEMORIA 2\nCuando el ruido invade el sistema, alguien cierra una puerta y trabaja en un espacio que no comparte con los demas.\n\nMEMORIA 3\nDonde las visitas anuncian su llegada.\n\nMEMORIA 4\nDonde guardamos las cosas que no utilizamos todos los dias.",
};

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

export const id = "y2k-memory";

export async function apply(ctx) {
  const { fs } = ctx;
  await fs.promises.mkdir(FOLDER, { recursive: true });
  const encoder = new TextEncoder();
  for (const [name, text] of Object.entries(FILES)) {
    await writeVerified(fs, `${FOLDER}/${name}`, text, encoder.encode(text));
  }
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
}
