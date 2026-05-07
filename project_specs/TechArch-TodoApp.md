# Technical Architecture: Simple To-Do App (TodoApp)

**Document Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project Acronym:** TodoApp
**Based On:** PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0

---

## Table of Contents

| # | Section |
|---|---------|
| 1 | [Architectural Overview](#1-architectural-overview) |
| 2 | [Component Architecture](#2-component-architecture) |
| 3 | [Data Model](#3-data-model) |
| 4 | [API Design](#4-api-design) |
| 5 | [Security Architecture](#5-security-architecture) |
| 6 | [Technology Stack](#6-technology-stack) |
| 7 | [Integration Points](#7-integration-points) |

---

## 1. Architectural Overview

### Pattern: Client-Only Single-Page Application (SPA)

TodoApp uses a **client-only, zero-backend architecture**. There is no server, no network requests, and no authentication layer. All application logic, state management, and persistence run entirely within the user's browser.

The architecture follows a simple three-layer model:

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Tab                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  UI / DOM Layer                   │  │
│  │   index.html + style.css                          │  │
│  │   ┌─────────────────┐  ┌────────────────────────┐│  │
│  │   │  Add Input +    │  │   Task List Container  ││  │
│  │   │  Add Button     │  │   (ul#task-list)       ││  │
│  │   └────────┬────────┘  └──────────┬─────────────┘│  │
│  └────────────┼──────────────────────┼──────────────┘  │
│               │  DOM events          │ renderTaskList() │
│  ┌────────────▼──────────────────────▼──────────────┐  │
│  │              Application Logic Layer              │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  app.js  │  │   tasks.js   │  │  render.js │  │  │
│  │  │ (entry,  │→ │ (business    │→ │ (DOM       │  │  │
│  │  │  events) │  │  logic,      │  │  mutations)│  │  │
│  │  └──────────┘  │  state)      │  └────────────┘  │  │
│  │                └──────┬───────┘                  │  │
│  └───────────────────────┼──────────────────────────┘  │
│                           │ readTasks() / writeTasks()  │
│  ┌────────────────────────▼──────────────────────────┐  │
│  │              Persistence Layer                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  storage.js  →  window.localStorage        │  │  │
│  │  │  key: "todoapp_tasks"  (JSON string)        │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Deployment Topology

```
Developer Machine
      │
      │  git push
      ▼
┌─────────────────┐     Static file deploy     ┌──────────────────────┐
│  Git Repository │ ────────────────────────── │  Static Hosting CDN  │
│  (GitHub, etc.) │                            │  (GitHub Pages /     │
└─────────────────┘                            │   Netlify / Vercel)  │
                                               └──────────┬───────────┘
                                                          │  HTTPS
                                                          ▼
                                               ┌──────────────────────┐
                                               │    User's Browser    │
                                               │  index.html          │
                                               │  style.css           │
                                               │  app.js (bundle)     │
                                               └──────────────────────┘
```

**Deployment characteristics:**
- Static files only (HTML + CSS + JS)
- No server process; no database server
- CDN-hosted; served over HTTPS
- Free-tier hosting sufficient (GitHub Pages, Netlify, or Vercel)
- Zero infrastructure maintenance

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| No backend | Client-only | Single-user with no auth requirement; eliminates all server complexity |
| Persistence layer | `window.localStorage` | Native browser API; no dependencies; survives page reload; sufficient for single-user local data |
| State model | Write-then-render | localStorage written before DOM update; ensures storage and UI never diverge |
| Module structure | 4 vanilla JS modules | Separation of concerns without framework overhead; stays under 100 KB bundle budget |
| Event handling | Event delegation on list container | Single listener handles all toggle and delete clicks; avoids per-item listener leak on re-render |
| ID generation | `crypto.randomUUID()` with fallback | Native API preferred; Math.random fallback for non-HTTPS or very old contexts |

---

## 2. Component Architecture

### Module Map

```
src/
├── index.html      ← Shell: markup structure, loads JS
├── style.css       ← All visual styles, task--completed class
├── app.js          ← Entry point; init, event wiring
├── tasks.js        ← Business logic; in-memory state (state.tasks)
├── storage.js      ← localStorage abstraction
└── render.js       ← DOM rendering; stateless
```

### Component Responsibilities

#### `index.html` — Application Shell
- Declares the static DOM skeleton
- Contains: `<input id="add-input">`, `<button id="add-btn">`, `<ul id="task-list">`
- Loads `app.js` as the JS entry point
- No inline scripts or styles

#### `style.css` — Visual Layer
- All layout and visual styling
- Defines `.task--completed` class: `text-decoration: line-through; opacity: 0.5`
- Defines `.task-list__empty` empty-state style
- Touch targets ≥ 44px for mobile compliance
- No external CSS imports (zero CDN dependencies)

#### `app.js` — Entry Point & Event Wiring
**Responsibilities:**
- Fires on `DOMContentLoaded`
- Checks `isStorageAvailable()`; displays storage-unavailable banner if false
- Calls `initTasks()` to hydrate in-memory state and render initial list
- Attaches all event listeners:
  - Add Input `keydown` → Enter key → `addTask()`
  - Add Button `click` → `addTask()`
  - Add Input `input` → `clearValidationMessage()`
  - Task List Container `click` (delegated) → dispatch to `toggleTask()` or `deleteTask()`

**Does NOT:**
- Contain business logic
- Access localStorage directly
- Manipulate DOM beyond event wiring

#### `tasks.js` — Business Logic & State
**Responsibilities:**
- Owns the single in-memory state object: `const state = { tasks: Task[] }`
- Implements `initTasks()`, `addTask()`, `toggleTask()`, `deleteTask()`
- Enforces all validation rules (trim, length check, UUID uniqueness)
- Calls `writeTasks()` before calling `renderTaskList()` (write-then-render)
- Handles `StorageWriteError` by reverting in-memory state and calling `renderTaskList()` to restore UI

**Does NOT:**
- Manipulate the DOM directly
- Call `localStorage` directly

#### `storage.js` — Persistence Abstraction
**Responsibilities:**
- Sole module that touches `window.localStorage`
- Implements `readTasks()`, `writeTasks()`, `isStorageAvailable()`
- Validates parsed data: drops entries missing required fields
- Throws `StorageWriteError` (custom error class) on `setItem` failure

**Does NOT:**
- Contain business logic
- Know about the DOM

#### `render.js` — DOM Rendering
**Responsibilities:**
- Fully stateless; derives DOM entirely from the `Task[]` argument
- Implements `renderTaskList()`, `showValidationMessage()`, `clearValidationMessage()`, `showToast()`
- Clears and fully rebuilds `#task-list` on every `renderTaskList()` call
- Applies `task--completed` CSS class based on `task.completed`
- Sets correct `aria-label` on each checkbox (`"Mark complete"` / `"Mark incomplete"`)
- Toast auto-dismisses after 4 seconds via `setTimeout`

**Does NOT:**
- Read from or write to localStorage
- Hold any state

### Data Flow

```
User Action (click / keydown)
        │
        ▼
   app.js (event handler)
        │
        ▼
   tasks.js (business logic)
     ├─ Validate input
     ├─ Mutate state.tasks
     ├─ storage.js → writeTasks() → localStorage.setItem()
     │     └─ On failure: revert state.tasks
     └─ render.js → renderTaskList(state.tasks) → DOM update
```

---

## 3. Data Model

### Overview

TodoApp has a single data entity: **Task**. There is no relational database. The entire data store is a JSON-serialised array of Task objects persisted in `window.localStorage` under a single fixed key.

### ER Diagram

```
┌─────────────────────────────────────┐
│               TASK                  │
├─────────────────────────────────────┤
│  id         : string (UUID v4)  PK  │
│  text       : string (1–500 chars)  │
│  completed  : boolean               │
│  createdAt  : string (ISO 8601 UTC) │
└─────────────────────────────────────┘

Stored as: localStorage["todoapp_tasks"] → JSON.stringify(Task[])
```

### Task Object — Full Specification

Because TodoApp uses localStorage (not SQL), the "DDL" is expressed as a TypeScript interface and a JSON Schema-style definition. This is the authoritative data contract.

#### TypeScript Interface

```typescript
/**
 * Represents a single task in the TodoApp task list.
 * All fields are required. Fields `id` and `createdAt` are immutable after creation.
 */
interface Task {
  /** UUID v4. Primary key. Assigned at creation. Never mutated. */
  id: string;

  /** User-supplied task description. 1–500 chars (trimmed). No leading/trailing whitespace stored. */
  text: string;

  /** Completion state. false = pending; true = complete. Toggled by F02. */
  completed: boolean;

  /** ISO 8601 UTC timestamp of task creation. e.g. "2026-05-07T14:30:00.000Z". Never mutated. */
  createdAt: string;
}

/** The full storage value: an ordered array of Task objects. */
type TaskArray = Task[];
```

#### Field Constraints Table

| Field | Type | Required | Mutable | Constraints |
|-------|------|----------|---------|-------------|
| `id` | `string` | Yes | No | UUID v4 format; unique within the array; assigned by `crypto.randomUUID()` |
| `text` | `string` | Yes | No | 1–500 characters after trimming; no leading/trailing whitespace stored; internal whitespace preserved |
| `completed` | `boolean` | Yes | Yes | Strictly `true` or `false`; toggled only by F02 (`toggleTask`) |
| `createdAt` | `string` | Yes | No | ISO 8601 UTC format; set to `new Date().toISOString()` at creation moment |

#### localStorage Layout

| Key | Value Type | Description |
|-----|-----------|-------------|
| `"todoapp_tasks"` | `string` (JSON) | `JSON.stringify(Task[])`. Absent until first task is added. Recreated on first write after absence. |

#### Array Invariants

- Ordered by insertion: index `0` = oldest task; newest task always appended to end
- No duplicate `id` values permitted
- Fields `id` and `createdAt` are never modified after initial write
- Malformed entries (missing required fields) are silently dropped by `readTasks()` on load
- Maximum practical size: ~500 tasks × ~200 bytes ≈ 100 KB (well within 5 MB localStorage quota)

#### Canonical Storage Example

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-07T09:00:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "text": "Call the dentist",
    "completed": true,
    "createdAt": "2026-05-07T09:05:00.000Z"
  }
]
```

#### Pseudo-DDL (for documentation / migration reference)

While not SQL, the following pseudo-DDL captures the full schema contract:

```
TABLE: tasks  (stored as JSON array in localStorage["todoapp_tasks"])
─────────────────────────────────────────────────────────────────────
COLUMN      TYPE      NOT NULL  IMMUTABLE  CONSTRAINTS
─────────   ────────  ────────  ─────────  ─────────────────────────────────────────────
id          string    YES       YES        UUID v4 format; unique within array
text        string    YES       YES        Length 1–500 (post-trim); no surrounding whitespace
completed   boolean   YES       NO         true | false only
createdAt   string    YES       YES        ISO 8601 UTC (e.g. "2026-05-07T09:00:00.000Z")
─────────────────────────────────────────────────────────────────────
PRIMARY KEY:  id
ORDERING:     insertion order (index 0 = oldest)
VERSIONING:   none in v1 (schemaVersion field reserved for future use)
```

---

## 4. API Design

TodoApp has no HTTP API. The internal "API" is the public function interface of the four JavaScript modules. All functions are synchronous.

### TypeScript Interfaces — Full Set

```typescript
// ─── Core Data Types ──────────────────────────────────────────────────────────

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

type TaskArray = Task[];

// ─── Result Types ─────────────────────────────────────────────────────────────

interface AddTaskSuccess {
  success: true;
  task: Task;
}

interface AddTaskFailure {
  success: false;
  error: "EMPTY_TEXT" | "TEXT_TOO_LONG" | "STORAGE_WRITE_FAIL";
}

type AddTaskResult = AddTaskSuccess | AddTaskFailure;

// ─── Error Types ──────────────────────────────────────────────────────────────

/**
 * Thrown by writeTasks() when localStorage.setItem throws.
 * Callers must catch and handle (revert state, show toast).
 */
class StorageWriteError extends Error {
  code: "STORAGE_WRITE_FAIL";
}

// ─── Validation Error Codes ───────────────────────────────────────────────────

type ValidationErrorCode = "EMPTY_TEXT" | "TEXT_TOO_LONG";

type StorageErrorCode = "STORAGE_UNAVAILABLE" | "STORAGE_READ_FAIL"
                      | "STORAGE_PARSE_ERROR" | "STORAGE_WRITE_FAIL";

type SystemErrorCode = "TASK_NOT_FOUND" | "UUID_GENERATION_FALLBACK";
```

### Module: `storage.js`

| Function | Signature | Description |
|----------|-----------|-------------|
| `readTasks` | `readTasks(): Task[]` | Reads `localStorage["todoapp_tasks"]`, parses JSON, validates each entry, returns valid `Task[]`. Returns `[]` on any error (missing key, parse failure, unavailable storage). |
| `writeTasks` | `writeTasks(tasks: Task[]): void` | Serialises `tasks` with `JSON.stringify` and writes to `localStorage["todoapp_tasks"]`. **Throws `StorageWriteError`** if `setItem` throws. |
| `isStorageAvailable` | `isStorageAvailable(): boolean` | Tests localStorage accessibility with a test write/delete. Returns `true` if available. Result cached for session. |

```typescript
// storage.js — public interface
declare function readTasks(): Task[];
declare function writeTasks(tasks: Task[]): void;   // throws StorageWriteError
declare function isStorageAvailable(): boolean;
```

### Module: `tasks.js`

| Function | Signature | Description |
|----------|-----------|-------------|
| `initTasks` | `initTasks(): void` | Loads tasks via `readTasks()`, stores in `state.tasks`, calls `renderTaskList()`. Called once on page load. |
| `addTask` | `addTask(text: string): AddTaskResult` | Trims text, validates, generates UUID, constructs Task, writes to storage, updates `state.tasks`, re-renders. Returns success/failure result. |
| `toggleTask` | `toggleTask(taskId: string): void` | Finds task by ID, flips `completed`, writes storage, re-renders. On `StorageWriteError`: reverts flip, re-renders to prior state, shows toast. |
| `deleteTask` | `deleteTask(taskId: string): void` | Filters task by ID from `state.tasks`, writes storage, re-renders. On `StorageWriteError`: keeps original state, re-renders, shows toast. |

```typescript
// tasks.js — public interface
declare function initTasks(): void;
declare function addTask(text: string): AddTaskResult;
declare function toggleTask(taskId: string): void;
declare function deleteTask(taskId: string): void;
```

**Internal state (module-private):**

```typescript
// tasks.js — internal
const state: { tasks: Task[] } = { tasks: [] };
```

### Module: `render.js`

| Function | Signature | Description |
|----------|-----------|-------------|
| `renderTaskList` | `renderTaskList(tasks: Task[]): void` | Clears `#task-list`, renders empty-state if `tasks.length === 0`, otherwise renders one `<li>` per task with checkbox, text span, and delete button. |
| `showValidationMessage` | `showValidationMessage(message: string): void` | Renders/updates `<span id="add-validation-msg" role="alert">` below Add Input. |
| `clearValidationMessage` | `clearValidationMessage(): void` | Empties or removes the validation message element. |
| `showToast` | `showToast(message: string): void` | Renders a toast notification. Auto-dismisses after 4 seconds. |

```typescript
// render.js — public interface
declare function renderTaskList(tasks: Task[]): void;
declare function showValidationMessage(message: string): void;
declare function clearValidationMessage(): void;
declare function showToast(message: string): void;
```

### Module: `app.js`

| Function | Signature | Description |
|----------|-----------|-------------|
| `init` | `init(): void` | Called on `DOMContentLoaded`. Checks storage availability, calls `initTasks()`, wires all event listeners. |

```typescript
// app.js — public interface
declare function init(): void;
```

### Event Binding Table

| Event | Element | Condition | Action |
|-------|---------|-----------|--------|
| `keydown` | `#add-input` | `event.key === "Enter"` | `addTask(inputEl.value)` |
| `click` | `#add-btn` | — | `addTask(inputEl.value)` |
| `input` | `#add-input` | — | `clearValidationMessage()` |
| `click` | `#task-list` (delegated) | Target has class `.task-item__checkbox` | `toggleTask(taskId)` |
| `click` | `#task-list` (delegated) | Target has class `.task-item__delete` | `deleteTask(taskId)` |

### Validation Rules

| Rule | Code | Trigger | User Message |
|------|------|---------|--------------|
| Trimmed text is empty | `EMPTY_TEXT` | Submit with blank/whitespace input | "Task cannot be empty." |
| Trimmed text > 500 chars | `TEXT_TOO_LONG` | Submit with oversized input | "Task must be 500 characters or fewer." |

### Error Handling Matrix

| Error Code | Layer | User-Visible Behaviour | Recovery |
|------------|-------|----------------------|----------|
| `EMPTY_TEXT` | Validation | Inline message below input; focus stays | User corrects text |
| `TEXT_TOO_LONG` | Validation | Inline message below input; focus stays | User shortens text |
| `STORAGE_UNAVAILABLE` | Storage | Non-blocking banner: "Note: tasks won't be saved in this browser session." | App runs in memory-only mode |
| `STORAGE_READ_FAIL` | Storage | Silent; tasks initialised to `[]`; empty state shown | Auto-recovery; memory-only mode |
| `STORAGE_PARSE_ERROR` | Storage | Silent; tasks initialised to `[]`; empty state shown | Auto-recovery; overwritten on next write |
| `STORAGE_WRITE_FAIL` | Storage | Toast: "Unable to save. Try again." State reverted. | User retries action |
| `TASK_NOT_FOUND` | System | None; console error logged | No action needed (defensive guard) |
| `UUID_GENERATION_FALLBACK` | System | None; Math.random fallback used silently | Automatic fallback |

---

## 5. Security Architecture

### Threat Model

TodoApp's attack surface is minimal by design. There is no server, no user accounts, no network communication, and no sensitive data beyond the user's own task text. The primary concerns are:

1. **XSS (Cross-Site Scripting)** — malicious content in task text rendered to DOM
2. **localStorage tampering** — externally injected malicious data loaded on next page visit
3. **Data loss** — accidental or forced localStorage clear

### Authentication & Authorization

**None required.** TodoApp is single-user, local-only. There is no login, no session, no token, and no server to authenticate against. Authorization is implicit: the user running the browser owns all data.

### XSS Prevention

All task text is rendered to the DOM using the DOM API (`textContent`, not `innerHTML`). This is the primary XSS defence.

```typescript
// SAFE — textContent escapes all HTML
span.textContent = task.text;

// NEVER DO THIS — innerHTML interprets task.text as HTML
// span.innerHTML = task.text; ← FORBIDDEN
```

**Rule:** All user-supplied content (task text) MUST be set via `textContent` or `createTextNode()`. `innerHTML` MUST NOT be used with user data anywhere in `render.js`.

### Input Validation

All input is validated in `tasks.js` before reaching storage or the DOM:

- Text is trimmed before validation and storage
- Length capped at 500 characters
- No script injection is possible via `textContent` rendering

### localStorage Data Integrity

On load, `readTasks()` validates every parsed entry:

```typescript
function isValidTask(obj: unknown): obj is Task {
  return (
    typeof obj === "object" && obj !== null &&
    typeof (obj as any).id === "string" &&
    typeof (obj as any).text === "string" &&
    typeof (obj as any).completed === "boolean" &&
    typeof (obj as any).createdAt === "string"
  );
}
```

Entries failing this check are silently dropped. This prevents a tampered or corrupted localStorage value from crashing the app or injecting unexpected state.

### Data Protection

| Concern | Risk | Mitigation |
|---------|------|-----------|
| Data confidentiality | Tasks stored in plaintext in localStorage | Acceptable for v1 personal task list; no sensitive data classification |
| Data at rest | Browser may sync localStorage across devices (some browsers) | Acceptable; single-user app, no cross-device concerns in v1 |
| Data loss | localStorage cleared by browser (private mode, quota, user action) | Graceful degradation to memory-only mode; non-blocking banner shown |
| XSS | Task text rendered to DOM | `textContent` only; `innerHTML` forbidden for user data |
| CSRF | N/A | No server, no forms POST to a backend, no tokens |
| Clickjacking | Low risk for personal local app | Add `X-Frame-Options: DENY` header at hosting level (GitHub Pages / Netlify supports this) |

### Content Security Policy (CSP)

Recommended CSP header (set at hosting/CDN level):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  connect-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

This blocks all external script/style loads, inline scripts, external connections, and framing — consistent with the zero-CDN-dependency design.

---

## 6. Technology Stack

### Runtime Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Markup | HTML5 | — | Application shell and DOM structure |
| Styling | CSS3 | — | Layout, visual design, task completion styling |
| Logic | Vanilla JavaScript (ES2020+) | — | All application logic; no framework required |
| Persistence | `window.localStorage` | Browser API | Single-user task storage; JSON serialisation |
| ID Generation | `crypto.randomUUID()` | Browser API (HTTPS) | UUID v4 task identifiers |
| Serialisation | `JSON.stringify` / `JSON.parse` | Browser API | Task array encoding/decoding |

### Build Tooling (Optional)

| Tool | Version | Role | Required? |
|------|---------|------|-----------|
| Vite | 5.x | Dev server, bundler, HMR | No — plain HTML acceptable for v1 |
| ESLint | 8.x | Linting JS modules | Recommended |
| Prettier | 3.x | Code formatting | Recommended |

**Plain HTML/JS (no build step) is a fully valid v1 implementation.** Vite adds a development server with hot-reload and produces an optimised bundle, but adds no runtime dependencies.

### Hosting

| Option | Tier | Deploy Trigger | Notes |
|--------|------|----------------|-------|
| GitHub Pages | Free | `git push` to `gh-pages` branch | Zero config for static sites |
| Netlify | Free | `git push` to main branch | Auto-deploy; supports custom CSP headers |
| Vercel | Free | `git push` to main branch | Auto-deploy; supports custom headers |

### Browser Compatibility Targets

| Browser | Minimum Version | `localStorage` | `crypto.randomUUID()` | Notes |
|---------|-----------------|---------------|----------------------|-------|
| Chrome | Current stable | ✓ | ✓ (HTTPS) | Primary dev target |
| Firefox | Current stable | ✓ | ✓ (HTTPS) | Tested target |
| Safari | Current stable | ✓ | ✓ (HTTPS) | Tested target |
| Edge | Current stable | ✓ | ✓ (HTTPS) | Tested target |

`crypto.randomUUID()` requires a secure context (HTTPS or localhost). The Math.random fallback handles non-HTTPS edge cases.

### Bundle Size Budget

| Asset | Budget | Notes |
|-------|--------|-------|
| HTML (`index.html`) | < 5 KB | Minimal shell markup |
| CSS (`style.css`) | < 10 KB | Custom styles only; no framework |
| JS (all modules) | < 15 KB | 4 small modules; no dependencies |
| **Total (uncompressed)** | **< 30 KB** | Well under 100 KB PRD requirement |

### Dependencies

**Runtime dependencies: zero.** No npm packages are required at runtime. No CDN imports. No third-party libraries.

**Dev dependencies (optional Vite setup):**

```json
{
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## 7. Integration Points

### Browser APIs (Runtime Dependencies)

| API | Module | Usage | Availability | Fallback |
|-----|--------|-------|-------------|---------|
| `window.localStorage` | `storage.js` | Persist `Task[]` between sessions | All evergreen browsers | In-memory array; storage-unavailable banner shown |
| `crypto.randomUUID()` | `tasks.js` | Generate UUID v4 `id` for new tasks | All evergreen browsers (HTTPS) | `Math.random()`-based UUID v4 approximation |
| `JSON.stringify` | `storage.js` | Serialise `Task[]` to string for storage | Universal | None needed |
| `JSON.parse` | `storage.js` | Deserialise stored string to `Task[]` | Universal | None needed |
| `DOMContentLoaded` event | `app.js` | Trigger `init()` after DOM is ready | Universal | None needed |
| `Event.target` / event delegation | `app.js` | Route click events from `#task-list` | Universal | None needed |
| `setTimeout` | `render.js` | Auto-dismiss toast after 4 seconds | Universal | None needed |

### External Services

**None.** TodoApp makes zero HTTP requests at runtime. There are no:

- External APIs
- Authentication providers (OAuth, OIDC, etc.)
- Analytics or telemetry services
- CDN script/style imports
- Push notification services
- WebSocket connections

### Build / Hosting Integrations (Non-Runtime)

| Service | Integration Type | Trigger | Notes |
|---------|-----------------|---------|-------|
| GitHub | Source control | Manual push | Repository for source code |
| GitHub Pages | Static hosting | Push to `gh-pages` | Automatic static deploy |
| Netlify (alt) | Static hosting | Push to main | Supports `netlify.toml` for CSP headers |
| Vercel (alt) | Static hosting | Push to main | Supports `vercel.json` for custom headers |

### Explicitly Absent Integrations

The following integrations are out of scope for v1:

| Integration | Status | Reason |
|-------------|--------|--------|
| Backend API / REST server | Out of scope | No server by design; client-only architecture |
| Authentication provider | Out of scope | No user accounts; single-user local app |
| Cloud sync / database | Out of scope | All data stays in browser localStorage |
| Analytics / telemetry | Out of scope | No tracking; privacy-respecting by default |
| Third-party UI libraries | Out of scope | Custom CSS only; zero CDN dependencies |
| Service Worker / PWA | Out of scope | Not required for v1 |
| IndexedDB | Out of scope | localStorage sufficient for v1 data volume |

---

## Appendix: File Structure

```
todoapp/
├── index.html          ← Application shell
├── style.css           ← All styles
├── src/
│   ├── app.js          ← Entry point; DOMContentLoaded; event wiring
│   ├── tasks.js        ← Business logic; in-memory state
│   ├── storage.js      ← localStorage abstraction
│   └── render.js       ← DOM rendering; stateless
├── package.json        ← Optional; only needed if using Vite
└── vite.config.js      ← Optional; only needed if using Vite
```

## Appendix: Architectural Constraints Summary

| Constraint | Value | Source |
|------------|-------|--------|
| No backend | Hard constraint | PRD §4, FRD §Global Constraints |
| No authentication | Hard constraint | PRD §9 Out of Scope |
| localStorage only | Hard constraint | FRD §Y0 |
| Write-then-render | Hard constraint | FRD §Global Constraints |
| Total bundle < 100 KB | Hard constraint | PRD §6 NFR, FRD §Global Constraints |
| Interaction latency < 100 ms | Hard constraint | PRD §6 NFR, FRD §Global Constraints |
| WCAG 2.1 AA accessibility | Hard constraint | FRD §Global Constraints |
| Evergreen browser support | Hard constraint | PRD §6 NFR |
| `textContent` for user data (XSS) | Security constraint | This document §5 |
| Event delegation on task list | Architecture decision | Avoids listener leak on re-render |

---

*Document generated: 2026-05-07 | Based on: PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0, .planning/PROJECT.md*
