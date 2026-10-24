import signalsText from "./assets/argentina-signals.txt?raw";

const FILE = "/C:/WINDOWS/Desktop/Communication System.txt";

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

export const id = "signals-file";

export async function apply(ctx) {
  const { fs } = ctx;
  await fs.promises.mkdir("/C:/WINDOWS/Desktop", { recursive: true });
  await writeVerified(
    fs,
    FILE,
    signalsText,
    new TextEncoder().encode(signalsText),
  );
  document.dispatchEvent(new CustomEvent("desktop-refresh"));
  return { path: FILE };
}

export async function remove(ctx, manifest) {
  const { fs } = ctx;
  const path = (manifest && manifest.path) || FILE;
  try {
    await fs.promises.unlink(path);
  } catch {}
  document.dispatchEvent(new CustomEvent("desktop-refresh"));
}
