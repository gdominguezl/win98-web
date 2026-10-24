import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const SYSTEM_DIR = "/C:/My Documents/SYSTEM";
const BACKUP = "/C:/My Documents/BACKUP_2359.TXT";
const ITEM_IDS = ["ct-chile-1", "ct-chile-2", "ct-chile-3", "ct-chile-4"];
const NAMES = [
  "VACACIONES_1998.BMP",
  "TAREA_FINAL_FINAL.DOC",
  "NO_ABRIR.TXT",
  "BACKUP_2359.TXT",
];
const TIMES = ["23:41", "23:47", "23:52", "23:59"];
const BACKUP_TEXT =
  "No todas las papeleras guardan archivos.\nMi version fisica recibe aquello que ya no necesitamos.\nBusca el lugar donde la oficina descarta o recicla sus residuos.";

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
}

async function fsExists(page, path) {
  return page.evaluate(async (p) => {
    try {
      await window.fs.promises.stat(p);
      return true;
    } catch {
      return false;
    }
  }, path);
}

async function expectPath(page, path, exists, timeout = 15000) {
  await expect.poll(async () => fsExists(page, path), { timeout }).toBe(exists);
}

async function readFile(page, path) {
  return page.evaluate(async (p) => {
    try {
      return await window.fs.promises.readFile(p, "utf8");
    } catch {
      return null;
    }
  }, path);
}

async function binEntries(page) {
  return page.evaluate(async () => {
    try {
      const metadata = JSON.parse(
        await window.fs.promises.readFile(
          "/C:/Recycled/.metadata.json",
          "utf8",
        ),
      );
      return Object.values(metadata).filter((e) => e && e.originalName);
    } catch {
      return [];
    }
  });
}

async function binIsFull(page) {
  return page.evaluate(
    async () => !(await window.RecycleBinManager.isEmpty("/Recycle Bin")),
  );
}

async function startTeam(page, { office = "chile", keyword = "river" } = {}) {
  await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
  await page.locator(CT_ICON).dblclick();
  const win = page.locator(CT_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator("#ct-team option").first()).toBeAttached({
    timeout: 10000,
  });
  if (office !== "argentina") await win.locator("#ct-office").selectOption(office);
  await win.locator("#ct-keyword").fill(keyword);
  await win.locator("#ct-start").click();
  await expect(win.locator("#ct-status")).toHaveText("This team is running.", {
    timeout: 10000,
  });
  return win;
}

test.describe("CT stations: Chile recycle and Y2K clues", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async () => {
      sessionStorage.clear();
      try {
        const metadata = JSON.parse(
          await window.fs.promises.readFile(
            "/C:/Recycled/.metadata.json",
            "utf8",
          ),
        );
        for (const id of Object.keys(metadata)) {
          if (!id.startsWith("ct-chile-")) continue;
          try {
            await window.fs.promises.unlink(`/C:/Recycled/${id}`);
          } catch {}
          try {
            await window.fs.promises.unlink(metadata[id].originalPath);
          } catch {}
          delete metadata[id];
        }
        await window.fs.promises.writeFile(
          "/C:/Recycled/.metadata.json",
          JSON.stringify(metadata),
        );
      } catch {}
      try {
        for (const name of [
          "VACACIONES_1998.BMP",
          "TAREA_FINAL_FINAL.DOC",
          "NO_ABRIR.TXT",
          "BACKUP_2359.TXT",
        ]) {
          await window.fs.promises.unlink(`/C:/My Documents/${name}`);
        }
      } catch {}
      try {
        for (const name of await window.fs.promises.readdir(
          "/C:/My Documents/SYSTEM",
        )) {
          await window.fs.promises.unlink(`/C:/My Documents/SYSTEM/${name}`);
        }
        await window.fs.promises.rmdir("/C:/My Documents/SYSTEM");
      } catch {}
      await window.RecycleBinManager.refreshFullState();
    });
  });

  test("chile bin shows the four files with 1999-12-31 deletion times", async ({
    page,
  }) => {
    await startTeam(page);
    await expect.poll(() => binEntries(page), { timeout: 15000 }).toEqual(
      expect.arrayContaining(
        NAMES.map((n) => expect.objectContaining({ originalName: n })),
      ),
    );
    const entries = (await binEntries(page)).filter((e) =>
      ITEM_IDS.includes(e.id),
    );
    expect(entries).toHaveLength(4);
    for (const [i, name] of NAMES.entries()) {
      const entry = entries.find((e) => e.originalName === name);
      expect(entry.originalPath).toBe(`/C:/My Documents/${name}`);
      expect(entry.deletionDate).toContain("1999-12-31");
      expect(entry.deletionDate).toContain(TIMES[i]);
    }
    expect(await binIsFull(page)).toBe(true);
  });

  test("restore BACKUP_2359.TXT through the bin UI and open it", async ({
    page,
  }) => {
    await startTeam(page);
    await expect.poll(() => binEntries(page), { timeout: 15000 }).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ originalName: "BACKUP_2359.TXT" }),
      ]),
    );

    await page.evaluate(() =>
      window.System.launchApp("explorer", { filePath: "/Recycle Bin" }),
    );
    const win = page.locator('.window[data-app-id="explorer"]');
    await expect(win).toBeVisible({ timeout: 15000 });
    const item = win.locator(".explorer-icon", { hasText: "BACKUP_2359.TXT" });
    await expect(item).toBeVisible({ timeout: 15000 });
    await item.click({ button: "right" });
    await page.locator('.menu-item:has-text("Restore")').click();
    await expect(item).toBeHidden({ timeout: 15000 });

    await expectPath(page, BACKUP, true);
    const text = await readFile(page, BACKUP);
    expect(text).toBe(BACKUP_TEXT);
  });

  test("the Y2K files hold the supplied texts and not the answer", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, `${SYSTEM_DIR}/ERROR.LOG`, true);
    await expectPath(page, `${SYSTEM_DIR}/MEMORY.TXT`, true);

    expect(await readFile(page, `${SYSTEM_DIR}/ERROR.LOG`)).toBe(
      "Y2K AGE CALCULATION FAILURE\n\nSYSTEM CREATED: 1998\nCURRENT SYSTEM YEAR: 2000\nREPORTED AGE: 100\n\nACTION REQUIRED:\nCALCULATE THE TRUE SYSTEM AGE.\nUSE THE RESULT TO RECOVER THE CORRECT MEMORY.",
    );
    const memory = await readFile(page, `${SYSTEM_DIR}/MEMORY.TXT`);
    expect(memory).toContain("MEMORIA 1");
    expect(memory).toContain("MEMORIA 2");
    expect(memory).toContain("MEMORIA 3");
    expect(memory).toContain("MEMORIA 4");
    expect(memory).not.toContain("OFICINA PRIVADA");
    expect(memory).not.toContain("OFICINA");

    const throwback = await page.evaluate(async () =>
      window.fs.promises.readdir("/C:/THROWBACK"),
    );
    expect(throwback.sort()).toEqual(["ERROR.LOG", "MEMORY.TXT", "PLANO.TXT"]);
  });

  test("finish removes bin items, restored copies and SYSTEM", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, `${SYSTEM_DIR}/ERROR.LOG`, true);
    await page.evaluate(async () => {
      const metadata = JSON.parse(
        await window.fs.promises.readFile(
          "/C:/Recycled/.metadata.json",
          "utf8",
        ),
      );
      const entry = metadata["ct-chile-4"];
      const data = await window.fs.promises.readFile(
        `/C:/Recycled/ct-chile-4`,
      );
      await window.fs.promises.mkdir("/C:/My Documents", { recursive: true });
      await window.fs.promises.writeFile(entry.originalPath, data);
      delete metadata["ct-chile-4"];
      await window.fs.promises.writeFile(
        "/C:/Recycled/.metadata.json",
        JSON.stringify(metadata),
      );
    });

    state.sessions[3].finishedAt = new Date().toISOString();
    await expectPath(page, SYSTEM_DIR, false);
    await expectPath(page, BACKUP, false);
    for (const id of ITEM_IDS) {
      await expectPath(page, `/C:/Recycled/${id}`, false);
    }
    const names = (await binEntries(page)).map((e) => e.originalName);
    for (const name of NAMES) expect(names).not.toContain(name);
  });

  test("admin restart removes the clues", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, `${SYSTEM_DIR}/ERROR.LOG`, true);
    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, SYSTEM_DIR, false);
    await expectPath(page, `/C:/Recycled/ct-chile-1`, false);
  });

  test("argentina team and no session get none of the chile clues", async ({
    page,
  }) => {
    await startTeam(page, { office: "argentina", keyword: "onion" });
    await page.waitForTimeout(2500);
    expect(await fsExists(page, SYSTEM_DIR)).toBe(false);
    const names = (await binEntries(page)).map((e) => e.originalName);
    for (const name of NAMES) expect(names).not.toContain(name);
  });

  test("reload keeps the clues", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page);
    await expectPath(page, `${SYSTEM_DIR}/ERROR.LOG`, true);
    await page.reload();
    await page.waitForSelector("#boot-screen", {
      state: "hidden",
      timeout: 60000,
    });
    await expectPath(page, `${SYSTEM_DIR}/ERROR.LOG`, true);
    await expect.poll(() => binEntries(page), { timeout: 15000 }).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ originalName: "BACKUP_2359.TXT" }),
      ]),
    );
  });
});
