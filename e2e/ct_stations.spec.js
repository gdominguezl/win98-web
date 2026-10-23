import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const ENGINE = "/win98-web/src/apps/improving-ct-october/stations/engine.js";
const MARKER = "/C:/.ct_stations.json";
const PROBE_DIR = "/C:/CT_TEST";

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
}

function stationSource() {
  return `
    (office, id, fail) => ({
      id,
      apply: async (ctx) => {
        if (fail) throw new Error("probe apply failed");
        window.__probeApplies = window.__probeApplies || {};
        window.__probeApplies[id] = (window.__probeApplies[id] || 0) + 1;
        await ctx.fs.promises.mkdir("${PROBE_DIR}", { recursive: true });
        await ctx.fs.promises.writeFile("${PROBE_DIR}/" + id + ".txt", ctx.office);
        return { paths: ["${PROBE_DIR}/" + id + ".txt"] };
      },
      remove: async (ctx, manifest) => {
        for (const p of (manifest && manifest.paths) || []) {
          try { await ctx.fs.promises.unlink(p); } catch {}
        }
        try { await ctx.fs.promises.rmdir("${PROBE_DIR}"); } catch {}
      },
    })
  `;
}

// Registers the fake station in the live engine module (same URL main.js resolves).
async function registerProbe(page, { office = "argentina", id = "ct-test-probe", fail = false } = {}) {
  await page.evaluate(
    async ({ engine, office, id, fail, source }) => {
      const factory = eval(source);
      const module = await import(engine);
      module.registerStation(office, { id, load: async () => factory(office, id, fail) });
    },
    { engine: ENGINE, office, id, fail, source: stationSource() },
  );
}

// Same registration but installed before the app boots (survives the reload).
async function registerProbeOnBoot(page, options = {}) {
  const { office = "argentina", id = "ct-test-probe", fail = false } = options;
  await page.addInitScript(
    ({ engine, office, id, fail, source }) => {
      window.__ctStationReady = import(engine).then((module) => {
        const factory = eval(source);
        module.registerStation(office, { id, load: async () => factory(office, id, fail) });
      });
    },
    { engine: ENGINE, office, id, fail, source: stationSource() },
  );
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

async function readMarker(page) {
  return page.evaluate(async (p) => {
    try {
      return JSON.parse(await window.fs.promises.readFile(p, "utf8"));
    } catch {
      return null;
    }
  }, MARKER);
}

async function expectPath(page, path, exists, timeout = 15000) {
  await expect
    .poll(() => fsExists(page, path), { timeout })
    .toBe(exists);
}

async function startTeam(page, { office = "argentina", keyword = "onion" } = {}) {
  await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
  await page.locator(CT_ICON).dblclick();
  const win = page.locator(CT_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator("#ct-team option").first()).toBeAttached({ timeout: 10000 });
  if (office !== "argentina") await win.locator("#ct-office").selectOption(office);
  await win.locator("#ct-keyword").fill(keyword);
  await win.locator("#ct-start").click();
  await expect(win.locator("#ct-status")).toHaveText("This team is running.", { timeout: 10000 });
  return win;
}

test.describe("CT stations", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async ({ marker, dir }) => {
      try { await window.fs.promises.unlink(marker); } catch {}
      try {
        for (const name of await window.fs.promises.readdir(dir)) {
          await window.fs.promises.unlink(`${dir}/${name}`);
        }
        await window.fs.promises.rmdir(dir);
      } catch {}
      sessionStorage.clear();
    }, { marker: MARKER, dir: PROBE_DIR });
  });

  test("idle: no session, no marker, nothing applied", async ({ page }) => {
    await registerProbe(page);
    await page.waitForTimeout(2500);
    expect(await fsExists(page, MARKER)).toBe(false);
    expect(await fsExists(page, PROBE_DIR)).toBe(false);
  });

  test("applies the office station when a team starts", async ({ page }) => {
    await registerProbe(page);
    await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);
    const marker = await readMarker(page);
    expect(marker?.office).toBe("argentina");
    expect(Object.keys(marker?.stations || {}).sort()).toEqual(["ct-test-probe", "recycle-clue"]);
    expect(await page.evaluate(() => window.__probeApplies["ct-test-probe"])).toBe(1);
  });

  test("a team of the other office gets no station", async ({ page }) => {
    await registerProbe(page);
    await startTeam(page, { office: "chile", keyword: "river" });
    await page.waitForTimeout(2500);
    expect(await fsExists(page, MARKER)).toBe(false);
    expect(await fsExists(page, PROBE_DIR)).toBe(false);
  });

  test("removes everything when the patch is accepted", async ({ page }) => {
    await registerProbe(page);
    await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);
    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, false);
    await expectPath(page, MARKER, false);
  });

  test("removes when an admin restart readies the team", async ({ page }) => {
    await registerProbe(page);
    await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);
    state.sessions[1] = { startedAt: null, finishedAt: null };
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, false);
    await expectPath(page, MARKER, false);
  });

  test("leaves nothing after Start a new game", async ({ page }) => {
    await registerProbe(page);
    const win = await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);
    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, MARKER, false);
    await expect(win.locator("#ct-new-game-button")).toBeVisible({ timeout: 15000 });
    await win.locator("#ct-new-game-button").click();
    await expect(win.locator("#ct-crew")).toBeVisible();
    await page.waitForTimeout(1500);
    expect(await fsExists(page, MARKER)).toBe(false);
    expect(await fsExists(page, PROBE_DIR)).toBe(false);
  });

  test("rejoining applies once and does not duplicate", async ({ page }) => {
    test.setTimeout(120000);
    await registerProbe(page);
    await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);

    await registerProbeOnBoot(page);
    await page.reload();
    await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
    await expect
      .poll(async () => page.evaluate(() => window.__probeApplies?.["ct-test-probe"] || 0), {
        timeout: 15000,
      })
      .toBe(1);
    const files = await page.evaluate(async (dir) => window.fs.promises.readdir(dir), PROBE_DIR);
    expect(files).toEqual(["ct-test-probe.txt"]);
    const marker = await readMarker(page);
    expect(Object.keys(marker?.stations || {}).sort()).toEqual(["ct-test-probe", "recycle-clue"]);
  });

  test("cleans a leftover marker and files on a sessionless boot", async ({ page }) => {
    test.setTimeout(120000);
    await page.evaluate(
      async ({ marker, dir }) => {
        await window.fs.promises.mkdir(dir, { recursive: true });
        await window.fs.promises.writeFile(`${dir}/ct-test-probe.txt`, "argentina");
        await window.fs.promises.writeFile(
          marker,
          JSON.stringify({
            office: "argentina",
            stations: { "ct-test-probe": { paths: [`${dir}/ct-test-probe.txt`] } },
          }),
        );
      },
      { marker: MARKER, dir: PROBE_DIR },
    );
    await registerProbeOnBoot(page);
    await page.reload();
    await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, false);
    await expectPath(page, MARKER, false);
  });

  test("a failing station does not stop the others or the timer", async ({ page }) => {
    await registerProbe(page, { id: "ct-test-broken", fail: true });
    await registerProbe(page);
    await startTeam(page);
    await expectPath(page, `${PROBE_DIR}/ct-test-probe.txt`, true);
    await expect(page.locator("#ct-timer")).toBeVisible({ timeout: 15000 });
    const marker = await readMarker(page);
    expect(Object.keys(marker?.stations || {}).sort()).toEqual(["ct-test-probe", "recycle-clue"]);
  });

  test("an old tab with a token but no stored office applies nothing", async ({ page }) => {
    await registerProbe(page);
    state.sessions[1] = { startedAt: new Date().toISOString(), finishedAt: null };
    await page.evaluate(() => {
      sessionStorage.setItem("ct-october-token", "team-token");
      sessionStorage.setItem("ct-october-role", "team");
    });
    await page.waitForTimeout(6500);
    expect(await fsExists(page, MARKER)).toBe(false);
    expect(await fsExists(page, PROBE_DIR)).toBe(false);
  });
});
