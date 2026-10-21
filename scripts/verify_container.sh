#!/usr/bin/env bash
# Verifies the win98-web container image against the container-delivery spec.
# Usage: scripts/verify_container.sh <base-url>   e.g. http://localhost:8080
# Exits non-zero on the first failed assertion.

set -euo pipefail

BASE="${1:-}"
if [ -z "$BASE" ]; then
  echo "usage: $0 <base-url>" >&2
  exit 2
fi
BASE="${BASE%/}"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

pass() {
  echo "ok: $1"
}

# status_of <path> [extra curl args...] -> HTTP status on stdout
status_of() {
  local path="$1"
  shift
  curl -sS -o /dev/null -w '%{http_code}' "$@" "${BASE}${path}"
}

# headers_of <path> [extra curl args...] -> headers on stdout
headers_of() {
  local path="$1"
  shift
  curl -sSI "$@" "${BASE}${path}"
}

body_of() {
  local path="$1"
  shift
  curl -sS "$@" "${BASE}${path}"
}

header_value() { # header_value <headers> <name>; prints empty string if absent
  printf '%s' "$1" | tr -d '\r' | { grep -i "^$2:" || true; } | head -1 | cut -d: -f2- | sed 's/^ *//;s/ *$//'
}

INDEX_TITLE='Windows 98 Web Edition - Nostalgic Browser Experience'
BSOD_TITLE='Windows 98 - Not Found'

echo "Verifying win98-web container at ${BASE}"

# 1. Main page loads
[ "$(status_of /win98-web/)" = "200" ] || fail "GET /win98-web/ did not return 200"
index_body="$(body_of /win98-web/)"
printf '%s' "$index_body" | grep -q "$INDEX_TITLE" || fail "GET /win98-web/ did not return the app index.html"
pass "GET /win98-web/ -> 200 index.html"

# Pick a hashed JS asset from index.html for later checks
asset_js="$(printf '%s' "$index_body" | grep -o 'assets/[^"'"'"']*\.js' | head -1)"
[ -n "$asset_js" ] || fail "could not find an assets/*.js reference in index.html"

# 2. Hashed and public assets resolve
[ "$(status_of "/win98-web/${asset_js}")" = "200" ] || fail "GET /win98-web/${asset_js} did not return 200"
pass "GET /win98-web/${asset_js} -> 200"
[ "$(status_of '/win98-web/os-gui/$Window.js')" = "200" ] || fail 'GET /win98-web/os-gui/$Window.js did not return 200'
pass 'GET /win98-web/os-gui/$Window.js -> 200'

# 3. Paths outside the prefix are not served
for p in / /index.html; do
  [ "$(status_of "$p")" = "404" ] || fail "GET ${p} did not return 404"
  body_of "$p" | grep -q "$INDEX_TITLE" && fail "GET ${p} served the app index.html"
done
pass "GET / and /index.html -> 404 (app not served)"

# 4. Prefix redirect is host-agnostic
loc="$(header_value "$(headers_of /win98-web)" Location)"
[ "$loc" = "/win98-web/" ] || fail "GET /win98-web Location is '${loc}', expected exactly /win98-web/"
code="$(status_of /win98-web)"
[ "$code" = "301" ] || fail "GET /win98-web returned ${code}, expected 301"
loc="$(header_value "$(headers_of /win98-web -H 'Host: example.com:8443')" Location)"
[ "$loc" = "/win98-web/" ] || fail "GET /win98-web with proxy Host header returned Location '${loc}', expected exactly /win98-web/"
pass "GET /win98-web -> 301 Location: /win98-web/ (host-agnostic)"

# 5. Profile deep links boot the app
for p in /win98-web/resume /win98-web/not-a-profile; do
  [ "$(status_of "$p")" = "200" ] || fail "GET ${p} did not return 200"
  body_of "$p" | grep -q "$INDEX_TITLE" || fail "GET ${p} did not serve index.html"
done
pass "GET /win98-web/resume and /win98-web/not-a-profile -> 200 index.html"

# 6. Real directories are not shadowed
pipes_body="$(body_of /win98-web/pipes/)"
printf '%s' "$pipes_body" | grep -q '3D Pipes Screensaver' || fail "GET /win98-web/pipes/ did not serve the pipes index.html"
pass "GET /win98-web/pipes/ -> pipes index.html"

# 7. Missing files return the Blue Screen page
[ "$(status_of /win98-web/images/does-not-exist.png)" = "404" ] || fail "GET /win98-web/images/does-not-exist.png did not return 404"
body_of /win98-web/images/does-not-exist.png | grep -q "$BSOD_TITLE" || fail "GET /win98-web/images/does-not-exist.png did not return the BSOD 404.html body"
pass "GET /win98-web/images/does-not-exist.png -> 404 with BSOD body"

# 8. Cache policy
for p in /win98-web/ /win98-web/sw.js /win98-web/manifest.webmanifest /win98-web/about.html; do
  cc="$(header_value "$(headers_of "$p")" Cache-Control)"
  [ "$cc" = "no-cache" ] || fail "GET ${p} Cache-Control is '${cc}', expected no-cache"
done
pass "index.html, sw.js, manifest.webmanifest, about.html -> Cache-Control: no-cache"

cc="$(header_value "$(headers_of "/win98-web/${asset_js}" -H 'Accept-Encoding: gzip')" Cache-Control)"
[ "$cc" = "public, max-age=31536000, immutable" ] || fail "GET /win98-web/${asset_js} Cache-Control is '${cc}'"
pass "/win98-web/${asset_js} -> Cache-Control: ${cc}"

# 9. Compression
ce="$(header_value "$(headers_of "/win98-web/${asset_js}" -H 'Accept-Encoding: gzip')" Content-Encoding)"
[ "$ce" = "gzip" ] || fail "GET /win98-web/${asset_js} with Accept-Encoding: gzip has Content-Encoding '${ce}'"
pass "/win98-web/${asset_js} -> Content-Encoding: gzip"

ce="$(header_value "$(headers_of /win98-web/img/energystar.png -H 'Accept-Encoding: gzip')" Content-Encoding)"
[ -z "$ce" ] || fail "GET /win98-web/img/energystar.png has unexpected Content-Encoding '${ce}'"
pass "/win98-web/img/energystar.png -> no Content-Encoding"

song='/win98-web/songs/anosci%20-%20Blank%20VHS%20Tape%20Jingle%20Collection/anosci%20-%20Blank%20VHS%20Tape%20Jingle%20Collection%20-%2003%20gentle%20envelopment.ogg'
[ "$(status_of "$song" -H 'Accept-Encoding: gzip')" = "200" ] || fail "GET ${song} did not return 200"
ce="$(header_value "$(headers_of "$song" -H 'Accept-Encoding: gzip')" Content-Encoding)"
[ -z "$ce" ] || fail "GET ${song} has unexpected Content-Encoding '${ce}'"
pass "${song} -> 200, no Content-Encoding"

# 10. Health endpoint
[ "$(status_of /healthz)" = "200" ] || fail "GET /healthz did not return 200"
body="$(body_of /healthz)"
[ "$body" = "ok" ] || fail "GET /healthz body is '${body}', expected 'ok'"
pass "GET /healthz -> 200 ok"

echo "All container checks passed."
