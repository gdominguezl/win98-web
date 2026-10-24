import {
  setHelpOverride,
  setStartDirOverride,
} from "../../../system/dos-shell.js";
import memoryText from "./assets/argentina-memory.txt?raw";
import errorText from "./assets/argentina-error.log?raw";
import planoText from "./assets/argentina-plano.txt?raw";
import helpText from "./assets/argentina-help.txt?raw";

const FOLDER = "/C:/THROWBACK";

const FILES = {
  "MEMORY.TXT": memoryText,
  "ERROR.LOG": errorText,
  "PLANO.TXT": planoText,
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

export const id = "throwback-folder";

export async function apply(ctx) {
  const { fs } = ctx;
  await fs.promises.mkdir(FOLDER, { recursive: true });
  try {
    for (const name of await fs.promises.readdir(FOLDER)) {
      try {
        await fs.promises.unlink(`${FOLDER}/${name}`);
      } catch {}
    }
  } catch {}

  const encoder = new TextEncoder();
  for (const [name, text] of Object.entries(FILES)) {
    await writeVerified(fs, `${FOLDER}/${name}`, text, encoder.encode(text));
  }

  setHelpOverride(helpText.split("\n"));
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
