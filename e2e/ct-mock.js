const LIMIT_MS = 60 * 60 * 1000;

export function freshCtState() {
  return {
    passwords: { argentina: "office-secret", chile: "chile-secret" },
    teams: [
      { id: 1, office: "argentina", name: "Team 1", keyword: "onion" },
      { id: 2, office: "argentina", name: "Team 2", keyword: "candle" },
      { id: 3, office: "chile", name: "Team 1", keyword: "river" },
    ],
    sessions: {},
    nextId: 4,
    resetCalls: 0,
    finishCalls: 0,
    patchPutCalls: 0,
    activeTeamId: 1,
    adminOffice: "argentina",
    patchCodes: {
      argentina: { code: "Y2KPATCH99", isDefault: true, updatedAt: new Date().toISOString() },
      chile: { code: "Y2KPATCH99", isDefault: true, updatedAt: new Date().toISOString() },
    },
  };
}

function activeId(state) {
  return state.activeTeamId || 1;
}

function normalizeCode(value) {
  return String(value ?? "").toUpperCase().replace(/[\s-]/g, "");
}

function validatePatchCode(input, defaults) {
  if (input == null || String(input).trim() === "") return "Enter a code";
  const raw = String(input).trim();
  if (raw.length > 48 || !/^[A-Za-z0-9 -]+$/.test(raw)) {
    return "Use only letters, numbers, spaces and dashes";
  }
  const normalized = normalizeCode(raw);
  if (!/^[A-Z0-9]{4,32}$/.test(normalized)) return "Use 4 to 32 letters or numbers";
  if (defaults.has(normalized)) return "Choose a code different from the default";
  return null;
}

function view(row, now = Date.now()) {
  const startedAt = row?.startedAt || null;
  const finishedAt = row?.finishedAt || null;
  const status = finishedAt ? "finished" : startedAt ? "running" : "ready";
  const elapsedMs = startedAt
    ? Math.max(0, (finishedAt ? Date.parse(finishedAt) : now) - Date.parse(startedAt))
    : null;
  return {
    startedAt,
    finishedAt,
    elapsedMs,
    status,
    overtime: status === "running" && elapsedMs > LIMIT_MS,
    serverNow: new Date(now).toISOString(),
  };
}

function json(route, status, body) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function sessionFor(state, id) {
  if (!state.sessions[id]) state.sessions[id] = { startedAt: null, finishedAt: null };
  return state.sessions[id];
}

function board(state, office) {
  const teams = state.teams
    .filter((team) => team.office === office)
    .map((team) => ({
      id: team.id,
      name: team.name,
      keyword: team.keyword,
      ...view(sessionFor(state, team.id)),
    }));
  const podium = teams
    .filter((team) => team.status === "finished")
    .slice()
    .sort((a, b) => a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name))
    .map((team, index) => ({
      place: index + 1,
      id: team.id,
      name: team.name,
      elapsedMs: team.elapsedMs,
    }));
  return {
    teams,
    runningCount: teams.filter((team) => team.status === "running").length,
    podium,
  };
}

async function handle(route, state) {
  const request = route.request();
  const url = new URL(request.url());
  const path = url.pathname.replace(/\/$/, "");
  const method = request.method();
  const body = method === "GET" ? {} : request.postDataJSON() || {};
  const office = url.searchParams.get("office") || body.office;

  if (path.endsWith("/ct/teams") && method === "GET") {
    return json(route, 200, {
      teams: state.teams
        .filter((team) => team.office === office)
        .map((team) => ({ id: team.id, name: team.name })),
    });
  }

  if (path.endsWith("/ct/team/login") && method === "POST") {
    const team = state.teams.find((item) => item.id === Number(body.teamId) && item.office === office);
    const keyword = String(team?.keyword || "").trim().toLowerCase();
    if (!team || keyword !== String(body.keyword || "").trim().toLowerCase()) {
      return json(route, 401, { error: "Wrong keyword" });
    }
    state.activeTeamId = team.id;
    return json(route, 200, { token: "team-token", session: view(sessionFor(state, team.id)) });
  }

  if (path.endsWith("/ct/team/start") && method === "POST") {
    const row = sessionFor(state, activeId(state));
    if (!row.startedAt) row.startedAt = new Date().toISOString();
    return json(route, 200, { session: view(row) });
  }

  if (path.endsWith("/ct/session") && method === "GET") {
    return json(route, 200, { session: view(sessionFor(state, activeId(state))) });
  }

  if (path.endsWith("/ct/finish") && method === "POST") {
    state.finishCalls += 1;
    const row = sessionFor(state, activeId(state));
    if (!row.startedAt) return json(route, 409, { error: "team_reset" });
    const team = state.teams.find((item) => item.id === activeId(state));
    const expected = normalizeCode(state.patchCodes[team?.office || "argentina"].code);
    if (normalizeCode(body.code) !== expected) return json(route, 401, { error: "Wrong code" });
    if (!row.finishedAt) row.finishedAt = new Date().toISOString();
    return json(route, 200, { session: view(row) });
  }

  if (path.endsWith("/ct/admin/login") && method === "POST") {
    if (state.passwords[office] !== body.password) return json(route, 401, { error: "Wrong password" });
    state.adminOffice = office;
    return json(route, 200, { token: "admin-token" });
  }

  if (path.endsWith("/ct/admin/patch-code")) {
    const token = request.headers()["authorization"] || "";
    if (token !== "Bearer admin-token") return json(route, 401, { error: "Authentication required" });
    const row = state.patchCodes[state.adminOffice];
    if (method === "GET") {
      return json(route, 200, { patchCode: row.code, isDefault: row.isDefault, updatedAt: row.updatedAt });
    }
    if (method === "PUT") {
      state.patchPutCalls += 1;
      const error = validatePatchCode(body.code, new Set(["Y2KPATCH99"]));
      if (error) return json(route, 400, { error });
      row.code = String(body.code).trim();
      row.isDefault = false;
      row.updatedAt = new Date().toISOString();
      return json(route, 200, { patchCode: row.code, isDefault: false, updatedAt: row.updatedAt });
    }
  }

  if (path.endsWith("/ct/admin/teams") && method === "GET") {
    return json(route, 200, {
      teams: state.teams
        .filter((team) => team.office === state.adminOffice)
        .map((team) => ({ id: team.id, name: team.name, keyword: team.keyword })),
    });
  }

  if (path.endsWith("/ct/admin/teams") && method === "POST") {
    const team = {
      id: state.nextId,
      office: state.adminOffice,
      name: String(body.name || "").trim(),
      keyword: String(body.keyword || "").trim(),
    };
    state.nextId += 1;
    state.teams.push(team);
    return json(route, 201, { team: { id: team.id, name: team.name, keyword: team.keyword } });
  }

  const teamMatch = path.match(/\/ct\/admin\/teams\/(\d+)$/);
  if (teamMatch && method === "PATCH") {
    const team = state.teams.find((item) => item.id === Number(teamMatch[1]));
    if (!team) return json(route, 404, { error: "Team not found" });
    if (body.name) team.name = body.name;
    if (body.keyword) team.keyword = body.keyword;
    return json(route, 200, { team: { id: team.id, name: team.name, keyword: team.keyword } });
  }

  if (teamMatch && method === "DELETE") {
    state.teams = state.teams.filter((item) => item.id !== Number(teamMatch[1]));
    return json(route, 200, { ok: true });
  }

  const restartMatch = path.match(/\/ct\/admin\/teams\/(\d+)\/reset$/);
  if (restartMatch && method === "POST") {
    const team = state.teams.find((item) => item.id === Number(restartMatch[1]) && item.office === state.adminOffice);
    if (!team) return json(route, 404, { error: "Team not found" });
    state.sessions[team.id] = { startedAt: null, finishedAt: null };
    return json(route, 200, { runningCount: 0 });
  }

  if (path.endsWith("/ct/admin/board") && method === "GET") {
    return json(route, 200, board(state, state.adminOffice));
  }

  if (path.endsWith("/ct/admin/reset") && method === "POST") {
    state.resetCalls += 1;
    for (const team of state.teams) {
      if (team.office !== state.adminOffice) continue;
      state.sessions[team.id] = { startedAt: null, finishedAt: null };
    }
    return json(route, 200, { runningCount: 0 });
  }

  return json(route, 404, { error: "Not mocked" });
}

export async function installCt(page, state) {
  await page.route("**/ct/**", (route) => handle(route, state));
}
