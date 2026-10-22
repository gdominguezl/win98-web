# container-delivery Specification

## Purpose
Defines how the Windows 98 Web Edition production build is packaged and served as a container, so a reverse proxy on a shared host can expose it under the `/win98-web/` path of a company domain.

## Requirements

### Requirement: Site is served under the /win98-web/ prefix
The container SHALL serve the production build at the `/win98-web/` path prefix, matching the Vite `base`, so the site behaves the same as on GitHub Pages and in `bun run dev`.

#### Scenario: Main page loads
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web/`
- **THEN** the container responds `200` with the Windows 98 `index.html`

#### Scenario: Hashed and public assets resolve
- **GIVEN** the container is running
- **WHEN** a client requests an asset referenced by `index.html` (for example a file under `/win98-web/assets/` or `/win98-web/os-gui/`)
- **THEN** the container responds `200` with that file

#### Scenario: Paths outside the prefix are not served
- **GIVEN** the container is running
- **WHEN** a client requests `GET /` or `GET /index.html`
- **THEN** the container responds `404` and does not serve the Windows 98 `index.html`

### Requirement: Prefix redirect is host-agnostic
The container MUST redirect `/win98-web` (no trailing slash) to `/win98-web/` using a relative `Location` header that carries no scheme, host or port.

#### Scenario: Missing trailing slash behind a proxy
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web` through a reverse proxy that terminates TLS on a different port
- **THEN** the response is a `301` whose `Location` is exactly `/win98-web/`

### Requirement: Profile deep links boot the app
The container SHALL serve `index.html` with status `200` for single-segment extensionless paths under the prefix (for example `/win98-web/resume`) so the in-app profile logic can read the path.

#### Scenario: Known profile path
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web/resume`
- **THEN** the container responds `200` with `index.html` and the app starts the `resume` profile

#### Scenario: Unknown profile path
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web/not-a-profile`
- **THEN** the container responds `200` with `index.html` and the app itself redirects to `/win98-web/404.html`

#### Scenario: Real directories are not shadowed
- **GIVEN** the container is running
- **WHEN** a client requests a path that is an existing directory with an `index.html` (for example `/win98-web/pipes/`)
- **THEN** the container serves that directory's `index.html`, not the root `index.html`

### Requirement: Missing files return the Blue Screen page
The container SHALL answer requests for non-existent files under the prefix with status `404` and the body of `/win98-web/404.html`.

#### Scenario: Missing static file
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web/images/does-not-exist.png`
- **THEN** the container responds `404` and the body is the Windows 98 `404.html` page

### Requirement: Cache policy keeps the PWA updatable
The container MUST send `Cache-Control: no-cache` for `index.html`, other HTML pages, `sw.js`, `registerSW.js` and `manifest.webmanifest`, and `Cache-Control: public, max-age=31536000, immutable` for files under `/win98-web/assets/`.

#### Scenario: Service worker is revalidated
- **GIVEN** the container is running
- **WHEN** a client requests `GET /win98-web/sw.js`
- **THEN** the response carries `Cache-Control: no-cache`

#### Scenario: Hashed bundle is cached long term
- **GIVEN** the container is running
- **WHEN** a client requests a file under `/win98-web/assets/`
- **THEN** the response carries `Cache-Control: public, max-age=31536000, immutable`

### Requirement: Text assets are compressed
The container SHALL gzip-compress JavaScript, CSS, HTML, JSON, SVG, web manifest and WebAssembly responses when the client sends `Accept-Encoding: gzip`.

#### Scenario: Compressed bundle
- **GIVEN** the container is running
- **WHEN** a client requests a JavaScript file under `/win98-web/assets/` with `Accept-Encoding: gzip`
- **THEN** the response has `Content-Encoding: gzip`

#### Scenario: Binary media is left alone
- **GIVEN** the container is running
- **WHEN** a client requests a PNG or MP3 under `/win98-web/`
- **THEN** the response has no `Content-Encoding` header

### Requirement: Health endpoint for orchestration
The container SHALL expose `GET /healthz` returning `200`, and this endpoint MUST NOT depend on the `/win98-web/` content.

#### Scenario: Healthy container
- **GIVEN** the container is running
- **WHEN** an orchestrator requests `GET /healthz`
- **THEN** the container responds `200`

### Requirement: Reproducible image build
The image SHALL build from a clean checkout using only the committed lockfile and the repository contents, without requiring a pre-existing `node_modules` or `dist`.

#### Scenario: Clean build
- **GIVEN** the container is running
- **WHEN** `docker build` runs on a fresh clone with no `node_modules` and no `dist`
- **THEN** the build succeeds and the resulting image serves the main page at `/win98-web/`
