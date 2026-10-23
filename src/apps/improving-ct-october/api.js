const TOKEN_KEY = "ct-october-token";
const ROLE_KEY = "ct-october-role";

function base() {
  const configured = import.meta.env.VITE_CT_API_URL;
  return configured == null ? "" : String(configured).replace(/\/$/, "");
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getRole() {
  try {
    return sessionStorage.getItem(ROLE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveSession(token, role) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

async function request(path, { method = "GET", body, auth = true, clearOnUnauthorized = true } = {}) {
  const headers = { "content-type": "application/json" };
  const token = auth ? getToken() : "";
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${base()}/ct${path}`, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body),
  });
  if (response.status === 401 && token && clearOnUnauthorized) clearSession();
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  return { status: response.status, body: payload };
}

export function listTeams(office) {
  return request(`/teams?office=${encodeURIComponent(office)}`, { auth: false });
}

export function teamLogin(office, teamId, keyword) {
  return request("/team/login", {
    method: "POST",
    auth: false,
    body: { office, teamId, keyword },
  });
}

export function teamStart() {
  return request("/team/start", { method: "POST" });
}

export function getSession() {
  return request("/session");
}

export function finishPatch(code) {
  return request("/finish", { method: "POST", body: { code }, clearOnUnauthorized: false });
}

export function adminLogin(office, password) {
  return request("/admin/login", {
    method: "POST",
    auth: false,
    body: { office, password },
  });
}

export function adminTeams() {
  return request("/admin/teams");
}

export function createTeam(name, keyword) {
  return request("/admin/teams", { method: "POST", body: { name, keyword } });
}

export function updateTeam(id, body) {
  return request(`/admin/teams/${id}`, { method: "PATCH", body });
}

export function deleteTeam(id) {
  return request(`/admin/teams/${id}`, { method: "DELETE" });
}

export function adminBoard() {
  return request("/admin/board");
}

export function adminReset() {
  return request("/admin/reset", { method: "POST" });
}
