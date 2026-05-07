---

## Y3: Integrations & External Dependencies

TodoApp is a fully client-side application with no server-side integrations. External dependencies are limited to standard browser APIs and optional build/hosting tooling.

---

### Browser APIs

These are the only "external" dependencies. All are available in every evergreen browser (Chrome, Firefox, Safari, Edge — current stable versions).

| API | Usage | Feature(s) | Fallback |
|-----|-------|-----------|---------|
| `window.localStorage` | Persist Task Array across page reloads | F00, F01, F02, F03 | In-memory array (data lost on reload); non-blocking banner shown to user — see `Y2-errors.md §STORAGE_UNAVAILABLE` |
| `crypto.randomUUID()` | Generate UUID v4 task IDs | F00 | `Math.random()`-based UUID v4 approximation — see `Y2-errors.md §UUID_GENERATION_FALLBACK` |
| `JSON.stringify` / `JSON.parse` | Serialise/deserialise Task Array for storage | F00, F01, F02, F03 | None required — universally available |
| `DOMContentLoaded` event | Trigger app initialisation | app.js | None required |
| `Event.target` / event delegation | Route click events from Task List Container | F02, F03 | None required |

---

### Build & Hosting Tooling (Optional, Non-Runtime)

These are development-time choices and do not affect runtime behaviour.

| Tool | Role | Required? |
|------|------|-----------|
| Vite (or plain HTML) | Build bundler / dev server | No — plain HTML/CSS/JS is acceptable for v1 |
| GitHub Pages / Netlify / Vercel | Static file hosting | Yes (one of these, or equivalent) — free tier sufficient |
| No CDN dependencies | App ships zero external script/style imports | N/A |

---

### Explicitly Absent Integrations

The following integrations are out of scope for v1 by design:

- **No backend API.** No HTTP requests of any kind.
- **No authentication provider** (no OAuth, no OIDC, no session management).
- **No analytics or telemetry** (no tracking scripts).
- **No cloud sync.** Data never leaves the browser.
- **No third-party UI component libraries.** All UI is custom CSS.
- **No push notifications or service workers.** No PWA manifest.

---
