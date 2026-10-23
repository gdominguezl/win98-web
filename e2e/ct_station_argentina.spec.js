import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON =
  '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const BIN_ITEM = "/C:/Recycled/ct-argentina-clue";
const BIN_DIR = "/C:/Recycled";
const DOCS = "/C:/My Documents";
const MARKER = "/C:/.ct_stations.json";

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", {
    state: "hidden",
    timeout: 60000,
  });
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

async function expectPath(page, path, exists, timeout = 15000) {
  await expect.poll(async () => fsExists(page, path), { timeout }).toBe(exists);
}

async function openRecycleBin(page) {
  await page.evaluate(() =>
    window.System.launchApp("explorer", { filePath: "/Recycle Bin" }),
  );
  const win = page.locator('.window[data-app-id="explorer"]');
  await expect(win).toBeVisible({ timeout: 15000 });
  return win;
}

// Seeds a user-owned recycled item with a single metadata write (the manager's
// own first-use double write can truncate .metadata.json under load).
async function seedUserBinItem(page, name) {
  await page.evaluate(
    async ({ docs, name }) => {
      await window.fs.promises.writeFile(`${docs}/${name}`, "mine");
      const metaFile = "/C:/Recycled/.metadata.json";
      await window.fs.promises.mkdir("/C:/Recycled", { recursive: true });
      for (let i = 0; i < 40; i++) {
        let raw = null;
        try {
          raw = await window.fs.promises.readFile(metaFile, "utf8");
        } catch {}
        if (raw !== null && raw.length > 0) {
          try {
            JSON.parse(raw);
            break;
          } catch {}
        }
        if (raw === null) {
          try {
            await window.fs.promises.writeFile(metaFile, "{}");
          } catch {}
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      await window.RecycleBinManager.moveToRecycleBin(`${docs}/${name}`);
      for (let i = 0; i < 40; i++) {
        try {
          const metadata = JSON.parse(
            await window.fs.promises.readFile(
              "/C:/Recycled/.metadata.json",
              "utf8",
            ),
          );
          const names = Object.values(metadata).map((e) => e.originalName);
          if (names.includes(name)) break;
          const entries = await window.fs.promises.readdir("/C:/Recycled");
          const id = entries.find((n) => n !== ".metadata.json");
          if (id) {
            metadata[id] = {
              id,
              originalPath: `${docs}/${name}`,
              originalName: name,
              deletionDate: new Date().toISOString(),
            };
            await window.fs.promises.writeFile(
              "/C:/Recycled/.metadata.json",
              JSON.stringify(metadata, null, 2),
            );
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 250));
      }
      await window.RecycleBinManager.refreshFullState();
    },
    { docs: DOCS, name },
  );
}

async function restoreClueViaMenu(page, name) {
  const win = await openRecycleBin(page);
  const item = win.locator(".explorer-icon", { hasText: name });
  await expect(item).toBeVisible({ timeout: 15000 });
  await item.click({ button: "right" });
  await page.locator('.menu-item:has-text("Restore")').click();
  await expect(item).toBeHidden({ timeout: 15000 });
}

async function openInViewer(page) {
  await page.evaluate(
    (docs) => window.System.launchApp("explorer", { filePath: docs }),
    DOCS,
  );
}

async function startTeam(
  page,
  { office = "argentina", keyword = "onion" } = {},
) {
  await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
  await page.locator(CT_ICON).dblclick();
  const win = page.locator(CT_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator("#ct-team option").first()).toBeAttached({
    timeout: 10000,
  });
  if (office !== "argentina")
    await win.locator("#ct-office").selectOption(office);
  await win.locator("#ct-keyword").fill(keyword);
  await win.locator("#ct-start").click();
  await expect(win.locator("#ct-status")).toHaveText("This team is running.", {
    timeout: 10000,
  });
  return win;
}

test.describe("CT station: Argentina recycle clue", () => {
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
        const ids = Object.keys(metadata);
        for (const id of ids) {
          try {
            await window.fs.promises.unlink(`/C:/Recycled/${id}`);
          } catch {}
          delete metadata[id];
        }
        if (ids.length) {
          await window.fs.promises.writeFile(
            "/C:/Recycled/.metadata.json",
            JSON.stringify(metadata),
          );
        }
      } catch {}
      try {
        for (const name of await window.fs.promises.readdir(
          "/C:/My Documents",
        )) {
          if (/^IMG_0001/.test(name)) {
            await window.fs.promises.unlink(`/C:/My Documents/${name}`);
          }
        }
      } catch {}
      await window.RecycleBinManager.refreshFullState();
    });
  });

  test("argentina team finds the clue in a full Recycle Bin", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await expect
      .poll(async () => binIsFull(page), { timeout: 15000 })
      .toBe(true);
    const entries = await binEntries(page);
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe("ct-argentina-clue");
    expect(entries[0].originalName).toBe("IMG_0001.png");
    expect(entries[0].originalPath).toBe("/C:/My Documents/IMG_0001.png");

    const win = await openRecycleBin(page);
    await expect(
      win.locator(".explorer-icon", { hasText: "IMG_0001.png" }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("restore lands in My Documents and opens in the image viewer", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await restoreClueViaMenu(page, "IMG_0001.png");
    await expectPath(page, `${DOCS}/IMG_0001.png`, true);
    await expectPath(page, BIN_ITEM, false);
    await expect
      .poll(async () => binIsFull(page), { timeout: 15000 })
      .toBe(false);

    await openInViewer(page);
    const docs = page.locator('.window[data-app-id="explorer"]');
    const file = docs
      .locator(".explorer-icon", { hasText: "IMG_0001.png" })
      .last();
    await expect(file).toBeVisible({ timeout: 15000 });
    await file.dblclick();
    await expect(
      page.locator('.window[data-app-id="image-viewer"]'),
    ).toBeVisible({
      timeout: 15000,
    });
  });

  test("finish removes the bin item, the restored copy and the full icon", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await restoreClueViaMenu(page, "IMG_0001.png");
    await expectPath(page, `${DOCS}/IMG_0001.png`, true);

    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, `${DOCS}/IMG_0001.png`, false);
    await expectPath(page, BIN_ITEM, false);
    await expectPath(page, MARKER, false);
    await expect
      .poll(async () => binIsFull(page), { timeout: 15000 })
      .toBe(false);
  });

  test("chile team and no session leave the Recycle Bin untouched", async ({
    page,
  }) => {
    await startTeam(page, { office: "chile", keyword: "river" });
    await page.waitForTimeout(2500);
    expect(await fsExists(page, BIN_ITEM)).toBe(false);
    expect(await binIsFull(page)).toBe(false);
  });

  test("reload keeps one item; a prior restore is not duplicated", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await restoreClueViaMenu(page, "IMG_0001.png");
    await expectPath(page, `${DOCS}/IMG_0001.png`, true);

    await page.reload();
    await page.waitForSelector("#boot-screen", {
      state: "hidden",
      timeout: 60000,
    });
    await expectPath(page, BIN_ITEM, true);
    await expect
      .poll(async () => (await binEntries(page)).length, { timeout: 15000 })
      .toBe(1);
    expect(await fsExists(page, `${DOCS}/IMG_0001.png`)).toBe(true);
  });

  test("a user's own deleted file is left alone by apply and remove", async ({
    page,
  }) => {
    await seedUserBinItem(page, "user-notes.txt");
    await expect
      .poll(async () => (await binEntries(page)).map((e) => e.originalName), {
        timeout: 15000,
      })
      .toContain("user-notes.txt");

    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await expect
      .poll(
        async () =>
          (await binEntries(page)).some((e) => e.id === "ct-argentina-clue"),
        { timeout: 15000 },
      )
      .toBe(true);
    expect(
      (await binEntries(page)).some((e) => e.originalName === "user-notes.txt"),
    ).toBe(true);

    state.sessions[1].finishedAt = new Date().toISOString();
    await expect
      .poll(
        async () => (await binEntries(page)).map((e) => e.originalName).sort(),
        { timeout: 15000 },
      )
      .toEqual(["user-notes.txt"]);
    expect(await binIsFull(page)).toBe(true);
  });

  test("name collision picks the _1 variant and keeps the user file", async ({
    page,
  }) => {
    await page.evaluate(async (docs) => {
      await window.fs.promises.writeFile(`${docs}/IMG_0001.png`, "user file");
    }, DOCS);

    await startTeam(page);
    await expectPath(page, BIN_ITEM, true);
    await expect
      .poll(async () => (await binEntries(page))[0]?.originalName, {
        timeout: 15000,
      })
      .toBe("IMG_0001_1.png");
    expect(
      await page.evaluate(
        async (docs) =>
          window.fs.promises.readFile(`${docs}/IMG_0001.png`, "utf8"),
        DOCS,
      ),
    ).toBe("user file");

    await restoreClueViaMenu(page, "IMG_0001_1.png");
    await expectPath(page, `${DOCS}/IMG_0001_1.png`, true);

    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, `${DOCS}/IMG_0001_1.png`, false);
    expect(
      await page.evaluate(
        async (docs) =>
          window.fs.promises.readFile(`${docs}/IMG_0001.png`, "utf8"),
        DOCS,
      ),
    ).toBe("user file");
  });

  test("normal delete and restore still work with no session", async ({
    page,
  }) => {
    await seedUserBinItem(page, "plain.txt");
    try {
      await expect
        .poll(async () => (await binEntries(page)).map((e) => e.originalName), {
          timeout: 15000,
        })
        .toContain("plain.txt");
    } catch (e) {
      console.log(
        "SEEDDBG",
        await page.evaluate(async () => ({
          dir: await window.fs.promises
            .readdir("/C:/Recycled")
            .catch((x) => "ERR:" + x.code),
          meta: await window.fs.promises
            .readFile("/C:/Recycled/.metadata.json", "utf8")
            .catch((x) => "ERR:" + x.code),
        })),
      );
      throw e;
    }
    const win = await openRecycleBin(page);
    const item = win.locator(".explorer-icon", { hasText: "plain.txt" });
    await expect(item).toBeVisible({ timeout: 15000 });
    await item.click({ button: "right" });
    await page.locator('.menu-item:has-text("Restore")').click();
    await expectPath(page, `${DOCS}/plain.txt`, true);
    await expect
      .poll(async () => binIsFull(page), { timeout: 15000 })
      .toBe(false);
    expect(await fsExists(page, BIN_ITEM)).toBe(false);
  });
});
