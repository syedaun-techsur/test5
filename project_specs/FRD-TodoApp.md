# FRD: Simple To-Do App (TodoApp)

**Document Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project Acronym:** TodoApp
**Based On:** PRD-TodoApp.md v1.0

---

## Scope

This Functional Requirements Document specifies the exact behaviour of every feature in TodoApp v1. It is the authoritative implementation reference for developers, testers, and reviewers. All four PRD features (F0–F3) are covered in full. The architecture is client-only: no server, no authentication, no external API calls. Persistence is achieved entirely via the browser's `localStorage` API.

---

## How to Read This Document

- **Feature chunks** are prefixed `F{nn}` (zero-padded) and map 1-to-1 with PRD feature IDs.
- **Cross-feature chunks** are prefixed `Y{n}`:
  - `Y0-schema.md` — data model (localStorage structure)
  - `Y1-api.md` — client-side module / function interface
  - `Y2-errors.md` — error catalog
  - `Y3-integrations.md` — browser API dependencies
- Validation rules are **normative** (MUST be enforced).
- Error states list every user-visible and programmatic failure path.
- "API Surface" in a feature chunk is a summary; full signatures live in `Y1-api.md`.
- "Schema Surface" in a feature chunk is a summary; full structure lives in `Y0-schema.md`.

---

## Table of Contents

| Section | File |
|---------|------|
| Header / TOC / Conventions | `00-header.md` (this file) |
| F00 — Add Task | `F00-add-task.md` |
| F01 — View Task List | `F01-view-task-list.md` |
| F02 — Mark Task Complete | `F02-mark-task-complete.md` |
| F03 — Delete Task | `F03-delete-task.md` |
| Y0 — Data Schema | `Y0-schema.md` |
| Y1 — Client API | `Y1-api.md` |
| Y2 — Error Catalog | `Y2-errors.md` |
| Y3 — Integrations | `Y3-integrations.md` |

---

## Cross-Cutting Terminology

| Term | Definition |
|------|-----------|
| **Task** | A single user-created item in the task list, consisting of a text description and a completion state. |
| **Pending** | Default state of a newly created task; the user has not yet marked it complete. |
| **Complete** | State of a task that has been toggled done by the user; visually distinguished from pending tasks. |
| **Task ID** | A unique identifier (`string`, UUID v4) assigned at creation time; never changes; used as the primary key for all operations. |
| **localStorage** | The browser-native `window.localStorage` key-value store used as the sole persistence layer. All reads and writes go through the Storage Module (see `Y1-api.md`). |
| **Storage Key** | The fixed localStorage key `"todoapp_tasks"` under which the serialised task array is stored. |
| **Task Array** | The canonical in-memory and at-rest representation of all tasks: a JSON array of Task objects sorted by creation order. |
| **UI State** | The live DOM representation of the task list; always derived from and kept in sync with the Task Array. |
| **Whitespace-only** | A string that is either empty (`""`) or consists entirely of space, tab, or newline characters. Whitespace-only task text is rejected on submission. |
| **Evergreen Browser** | Chrome, Firefox, Safari, and Edge at their current stable versions — the required compatibility targets. |

---

## Global Constraints

- **No backend.** All logic runs in the browser. No HTTP requests are made to any server.
- **No user accounts.** The app is single-user by design; no authentication layer exists.
- **localStorage is the single source of truth.** Every state mutation MUST be written to localStorage before the UI updates (write-then-render).
- **Performance budget.** Every user interaction (add, toggle, delete) MUST complete within 100 ms end-to-end.
- **Accessibility.** All interactive controls MUST have accessible labels. The full task lifecycle MUST be completable via keyboard alone.
- **Bundle size.** Total page weight (HTML + CSS + JS, uncompressed) MUST remain under 100 KB.

---
---

## F00: Add Task

**PRD Reference:** F0 — Priority P0 (Critical MVP)

**Description:** This feature allows the user to create a new task by typing text into a persistent input field and submitting it via the Enter key or an "Add" button. On successful submission the task is appended to the Task Array, persisted to localStorage, and immediately rendered in the task list. Blank or whitespace-only submissions are silently rejected with an inline validation message. The input field is cleared and refocused after every successful add so the user can immediately enter another task.

---

### Terminology

- **Add Input:** The single text `<input>` element always visible at the top (or bottom) of the UI where the user types new task text.
- **Add Button:** The submit control (button element labelled "Add") adjacent to the Add Input.
- **Inline Validation Message:** A non-blocking text message rendered immediately below the Add Input when submission is rejected; disappears when the user begins typing again.

---

### Sub-features

- Always-visible, auto-focused text input field
- Submission via Enter key press on the Add Input
- Submission via Add Button click
- Automatic input clearing and refocus after successful add
- Rejection of blank / whitespace-only input with inline feedback
- Immediate DOM rendering of the new task (no page reload)
- Re-focus of Add Input when the browser tab regains visibility (tab-switch auto-focus)

---

### Process

1. Page loads → Add Input is rendered and receives focus automatically.
1a. When the browser tab transitions from hidden to visible (i.e. the user switches back to the TodoApp tab), the Add Input MUST receive focus automatically via the `visibilitychange` event. This ensures keyboard-only capture is possible immediately on tab switch without a mouse click.
2. User types task text into the Add Input.
3. User triggers submission by pressing **Enter** or clicking the **Add Button**.
4. System trims leading and trailing whitespace from the input value.
5. **If the trimmed value is empty (whitespace-only or blank):**
   a. Display the inline validation message: *"Task cannot be empty."*
   b. Keep focus on the Add Input. Stop processing.
6. **If the trimmed value is non-empty:**
   a. Generate a new unique Task ID (UUID v4).
   b. Construct a Task object: `{ id, text: trimmedValue, completed: false, createdAt: ISO8601 timestamp }`.
   c. Append the Task object to the in-memory Task Array.
   d. Serialise the Task Array and write it to localStorage under key `"todoapp_tasks"`.
   e. Re-render the task list DOM from the updated Task Array.
   f. Clear the Add Input value.
   g. Remove any currently displayed inline validation message.
   h. Return focus to the Add Input.

---

### Inputs

- `taskText` (string, required): Raw value from the Add Input field at time of submission. May be any Unicode text up to 500 characters.

---

### Outputs

- **On success:** A new Task object appended to the Task Array; localStorage updated; new task item rendered at the bottom of the task list; Add Input cleared; focus returned to Add Input.
- **On failure (blank input):** Inline validation message displayed beneath the Add Input; Task Array unchanged; localStorage unchanged; focus remains on Add Input.

---

### Validation Rules

- The trimmed `taskText` MUST NOT be empty (length ≥ 1 after trimming).
- `taskText` MUST NOT exceed 500 characters (trimmed). If it does, display: *"Task must be 500 characters or fewer."*
- Leading and trailing whitespace is always stripped before storing.
- Internal whitespace (e.g. multiple spaces) is preserved as-is.
- A task ID MUST be a UUID v4 and MUST be unique within the Task Array.
- `createdAt` MUST be set to the current UTC time in ISO 8601 format at the moment of creation.

---

### Error States

| Scenario | Trigger | User-Visible Message | Behaviour |
|----------|---------|---------------------|-----------|
| Blank submission | User submits empty or whitespace-only input | "Task cannot be empty." | Inline message shown; input stays focused; no task created |
| Over-length submission | Trimmed text > 500 characters | "Task must be 500 characters or fewer." | Inline message shown; no task created |
| localStorage write failure | `localStorage.setItem` throws (quota exceeded or unavailable) | "Unable to save task. Storage may be full." | Task NOT added to Task Array; UI unchanged; see `Y2-errors.md §STORAGE_WRITE_FAIL` |
| UUID generation failure | Crypto API unavailable | Silent fallback to `Math.random()`-based ID | No user-visible error; degraded but functional |

---

### API Surface (this feature)

| Function | Signature | Description |
|----------|-----------|-------------|
| `addTask(text)` | `addTask(text: string): Task \| ValidationError` | Validates, constructs, persists, and returns the new Task object or a ValidationError |
| `renderTaskList(tasks)` | `renderTaskList(tasks: Task[]): void` | Re-renders the full task list DOM from the provided array |

Full signatures and module layout in `Y1-api.md §Task Operations`.

---

### Schema Surface (this feature)

Creates entries in the `tasks` array stored under localStorage key `"todoapp_tasks"`. Each entry uses the `Task` object shape. Full schema in `Y0-schema.md §Task Object`.

---
---

## F01: View Task List

**PRD Reference:** F1 — Priority P0 (Critical MVP)

**Description:** This feature is responsible for displaying all tasks to the user in a readable, persistent list on the main screen. The list is loaded from localStorage on page initialisation and is kept in sync with the in-memory Task Array at all times — any change made by F00, F02, or F03 is reflected immediately without a page reload. Completed tasks are visually distinguished from pending ones, and an empty-state message is shown when there are no tasks.

---

### Terminology

- **Task List Container:** The DOM element (e.g. `<ul>` or `<ol>`) that holds all rendered task items.
- **Task Item:** A single DOM element (e.g. `<li>`) representing one Task object. Contains the completion checkbox, task text, and delete button.
- **Empty State:** The placeholder message displayed inside the Task List Container when the Task Array contains zero items.
- **Pending Task:** A task whose `completed` field is `false`. Rendered in the default (full-contrast) style.
- **Completed Task:** A task whose `completed` field is `true`. Rendered with strikethrough text and muted (reduced opacity or greyed) colour.
- **Real-time Update:** A DOM mutation triggered synchronously within the same event-handling call that caused the state change — no async delay, no page reload.

---

### Sub-features

- Load and render tasks from localStorage on page initialisation
- Display each task as a task item (checkbox + text + delete button)
- Visually distinguish completed tasks (strikethrough / muted colour)
- Display empty-state message when no tasks exist
- Real-time synchronous update on every state change (add / toggle / delete)
- Preserve creation order (oldest first / newest last by default)

---

### Process

#### On Page Load (initialisation)

1. System calls `loadTasks()` to read `"todoapp_tasks"` from localStorage.
2. If the key is absent or its value is invalid JSON, the Task Array is initialised to `[]` (empty array). Any parse error is silently swallowed (see `Y2-errors.md §STORAGE_PARSE_ERROR`).
3. The parsed/initialised Task Array is stored in memory as the single in-memory state.
4. `renderTaskList(tasks)` is called with the Task Array.

#### On Every State Change (add / toggle / delete)

5. The in-memory Task Array is mutated by the responsible feature module (F00, F02, or F03).
6. The updated Task Array is persisted to localStorage (write-then-render).
7. `renderTaskList(tasks)` is called with the updated Task Array.

#### `renderTaskList(tasks)` Implementation

8. Clear the current contents of the Task List Container.
9. **If `tasks` is empty:**
   - Render the Empty State element inside the Task List Container with text: *"No tasks yet. Add one above!"*
   - Stop.
10. **For each Task object in `tasks` (in array order):**
    a. Create a Task Item element.
    b. Render a checkbox input (`type="checkbox"`) with `aria-label="Mark complete"` (or `"Mark incomplete"` if already complete); set `checked` attribute to match `task.completed`.
    c. Render a `<span>` containing the task text.
    d. If `task.completed === true`: apply CSS class `task--completed` (which sets `text-decoration: line-through` and reduces opacity to 0.5).
    e. Render a delete button with `aria-label="Delete task"` and a visible "×" or trash icon.
    f. Append the Task Item to the Task List Container.

---

### Inputs

- `tasks` (Task[], required): The current in-memory Task Array passed to `renderTaskList`. May be an empty array.
- `localStorage["todoapp_tasks"]` (string | null): JSON-serialised Task Array read on page load.

---

### Outputs

- **Normal (tasks exist):** Task List Container populated with one Task Item per Task object in creation order.
- **Empty state:** Task List Container shows a single empty-state message element.
- **On load with corrupted storage:** Task Array initialised to `[]`; empty state displayed; no error shown to user (silent recovery).

---

### Validation Rules

- `renderTaskList` MUST be called after every state mutation; calling it is the responsibility of the mutating feature (F00/F02/F03).
- The Task List Container MUST be fully cleared and re-rendered on each call (no incremental patching required for v1).
- Task Items MUST be rendered in insertion order (index 0 = oldest = top of list).
- The `checked` attribute of each checkbox MUST exactly reflect `task.completed` at render time.
- The empty-state element MUST NOT be rendered alongside Task Items; it replaces them.
- All Task Item controls (checkbox, delete button) MUST have `aria-label` attributes meeting WCAG 2.1 AA requirements.

---

### Error States

| Scenario | Trigger | User-Visible Behaviour | Notes |
|----------|---------|----------------------|-------|
| localStorage unavailable on load | `localStorage.getItem` throws | Tasks initialised to `[]`; empty state shown | See `Y2-errors.md §STORAGE_READ_FAIL` |
| Corrupted JSON in storage | `JSON.parse` throws | Tasks initialised to `[]`; empty state shown | See `Y2-errors.md §STORAGE_PARSE_ERROR` |
| Empty Task Array on load | No tasks saved | Empty-state message shown | Normal expected path for first-ever page visit |
| `renderTaskList` called with null | Programming error | Treat as `[]`; render empty state | Defensive guard in implementation |

---

### API Surface (this feature)

| Function | Signature | Description |
|----------|-----------|-------------|
| `loadTasks()` | `loadTasks(): Task[]` | Reads and parses task array from localStorage; returns `[]` on any error |
| `renderTaskList(tasks)` | `renderTaskList(tasks: Task[]): void` | Clears and re-renders the Task List Container DOM |

Full signatures in `Y1-api.md §Task Operations`.

---

### Schema Surface (this feature)

Reads from localStorage key `"todoapp_tasks"`. Interprets each element as a `Task` object. Full schema in `Y0-schema.md §Task Object`.

---
---

## F02: Mark Task Complete

**PRD Reference:** F2 — Priority P0 (Critical MVP)

**Description:** This feature allows the user to toggle any task between "pending" and "complete" states by interacting with a checkbox on the task item. Toggling is bidirectional: a pending task becomes complete and a complete task reverts to pending. The new state is persisted to localStorage immediately and reflected in the UI via a visual treatment (strikethrough text, muted colour). No confirmation is required.

---

### Terminology

- **Toggle:** The act of flipping a task's `completed` field from `false` → `true` or `true` → `false` in a single user interaction.
- **Completion Checkbox:** The `<input type="checkbox">` rendered on each Task Item; its `checked` state mirrors `task.completed`.
- **Completed Visual Treatment:** The CSS applied when `task.completed === true`: class `task--completed` which applies `text-decoration: line-through` and `opacity: 0.5`.

---

### Sub-features

- Checkbox on each task item reflects current completion state
- Single click/tap toggles completion state
- Completed tasks receive strikethrough + muted visual treatment
- Pending tasks display in full-contrast default style
- Toggle persists to localStorage immediately
- Bidirectional toggle (can un-complete a completed task)

---

### Process

1. The user clicks or taps the Completion Checkbox on a Task Item.
2. System identifies the target task by reading the `data-task-id` attribute from the Task Item element.
3. System looks up the task in the in-memory Task Array by its `id`.
4. System flips `task.completed`: `false` → `true` or `true` → `false`.
5. System serialises the updated Task Array and writes it to localStorage under `"todoapp_tasks"`.
6. System calls `renderTaskList(tasks)` to re-render the task list with the updated state.
7. The toggled Task Item now displays the correct visual treatment (completed or pending style).
8. Focus remains on the toggled checkbox after re-render (or returns to it) so keyboard users can continue navigating without losing position.

---

### Inputs

- `taskId` (string, required): UUID of the task to toggle, sourced from the Task Item's `data-task-id` attribute at event time.

---

### Outputs

- **On success:** `task.completed` field flipped; localStorage updated; task list re-rendered; toggled task item shows updated visual treatment.
- **On task-not-found:** No state change; no UI update; error logged to console (see Error States).

---

### Validation Rules

- The `taskId` MUST match an existing task in the in-memory Task Array. If not found, the operation is a no-op.
- localStorage MUST be written before `renderTaskList` is called (write-then-render).
- After re-render, the checkbox `checked` attribute MUST equal the new `task.completed` value.
- The `aria-label` on the checkbox MUST update on re-render: `"Mark complete"` when `completed === false`, `"Mark incomplete"` when `completed === true`.
- Toggling MUST NOT alter `task.text`, `task.id`, or `task.createdAt`.

---

### Error States

| Scenario | Trigger | User-Visible Behaviour | Notes |
|----------|---------|----------------------|-------|
| Task ID not found in array | Stale DOM / race condition | No change to UI or storage; console error logged | Should not occur in v1 single-threaded model |
| localStorage write failure on toggle | `localStorage.setItem` throws | Toggle reverted in memory; UI re-rendered to previous state; toast shown: "Unable to save. Try again." | See `Y2-errors.md §STORAGE_WRITE_FAIL` |

---

### API Surface (this feature)

| Function | Signature | Description |
|----------|-----------|-------------|
| `toggleTask(taskId)` | `toggleTask(taskId: string): void` | Finds the task by ID, flips `completed`, persists, re-renders |

Full signatures in `Y1-api.md §Task Operations`.

---

### Schema Surface (this feature)

Mutates the `completed` field of a `Task` object within the array stored at localStorage key `"todoapp_tasks"`. Full schema in `Y0-schema.md §Task Object`.

---
---

## F03: Delete Task

**PRD Reference:** F3 — Priority P0 (Critical MVP)

**Description:** This feature allows the user to permanently remove a single task from the list by clicking a delete button on the task item. Deletion is immediate and irreversible — no confirmation dialog is shown. The task is removed from the in-memory Task Array, the updated array is persisted to localStorage, and the task list is re-rendered. If deleting the last task, the empty-state message is shown (see F01).

---

### Terminology

- **Delete Button:** A button element rendered inside each Task Item, labelled with a visible "×" character or trash-can icon and an `aria-label="Delete task"`. Activating it triggers permanent task removal.
- **Permanent Deletion:** The task is removed from both the in-memory Task Array and localStorage. It cannot be recovered within the current session or any future session. There is no undo.

---

### Sub-features

- Delete button visible on each task item (always visible or on hover — implementation choice)
- Immediate removal from Task Array and localStorage on click
- No confirmation dialog
- Task list re-rendered after deletion
- Empty-state message shown if all tasks are deleted (deferred to F01 `renderTaskList`)

---

### Process

1. The user clicks or taps the Delete Button on a Task Item.
2. System reads the `data-task-id` attribute from the Task Item to identify the target task.
3. System removes the task with the matching `id` from the in-memory Task Array (filter operation — all other tasks preserved in order).
4. System serialises the updated Task Array and writes it to localStorage under `"todoapp_tasks"`.
5. System calls `renderTaskList(tasks)` to re-render the task list.
6. The deleted Task Item no longer appears in the list.
7. If the Task Array is now empty, the empty-state message is rendered by `renderTaskList` (see `F01-view-task-list.md §Process step 9`).

---

### Inputs

- `taskId` (string, required): UUID of the task to delete, sourced from the Task Item's `data-task-id` attribute at event time.

---

### Outputs

- **On success:** Task removed from Task Array; localStorage updated; task list re-rendered without the deleted item. If array is now empty, empty-state shown.
- **On task-not-found:** No state change; no UI update; console error logged.

---

### Validation Rules

- The `taskId` MUST match an existing task in the in-memory Task Array. If not found, the operation is a no-op.
- localStorage MUST be written before `renderTaskList` is called (write-then-render).
- After deletion, the Task Array MUST NOT contain any task with the deleted `taskId`.
- All other Task objects MUST remain unmodified (text, completed, id, createdAt unchanged).
- Relative ordering of remaining tasks MUST be preserved.
- There is NO undo mechanism in v1; the operation is final.

---

### Error States

| Scenario | Trigger | User-Visible Behaviour | Notes |
|----------|---------|----------------------|-------|
| Task ID not found in array | Stale DOM reference | No change to UI or storage; console error logged | Defensive guard; should not occur in v1 |
| localStorage write failure on delete | `localStorage.setItem` throws | Deletion reverted in memory; UI re-rendered to show task still present; toast shown: "Unable to save. Try again." | See `Y2-errors.md §STORAGE_WRITE_FAIL` |
| Last task deleted | Array becomes empty | Empty-state message rendered by `renderTaskList` | Normal expected path; not an error |

---

### API Surface (this feature)

| Function | Signature | Description |
|----------|-----------|-------------|
| `deleteTask(taskId)` | `deleteTask(taskId: string): void` | Removes the task by ID from the Task Array, persists, re-renders |

Full signatures in `Y1-api.md §Task Operations`.

---

### Schema Surface (this feature)

Removes one entry from the `Task[]` array stored at localStorage key `"todoapp_tasks"`. Full schema in `Y0-schema.md §Task Object`.

---
---

## Y0: Data Schema

TodoApp uses no relational database. All data is stored in the browser's `localStorage` as a single JSON-serialised array under a fixed key. This section defines the complete data model.

---

### Storage Key

| Key | Type | Description |
|-----|------|-------------|
| `"todoapp_tasks"` | `string` (JSON) | JSON-serialised array of `Task` objects. Absent on first use; created on first task add. |

---

### Task Object

Each element in the stored array conforms to the following shape:

```json
{
  "id":        "<UUID v4 string>",
  "text":      "<string, 1–500 chars, trimmed>",
  "completed": false,
  "createdAt": "<ISO 8601 UTC datetime string>"
}
```

#### Field Definitions

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 format; globally unique within the array | Immutable primary key assigned at creation |
| `text` | `string` | Yes | 1–500 characters (trimmed); no surrounding whitespace stored | The user-visible task description |
| `completed` | `boolean` | Yes | `true` or `false` only | Task completion state; toggled by F02 |
| `createdAt` | `string` | Yes | ISO 8601 UTC format e.g. `"2026-05-07T14:30:00.000Z"` | Timestamp of task creation; immutable after creation |

---

### Full Storage Layout Example

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

---

### Constraints & Invariants

- The stored value MUST be valid JSON at all times. The Storage Module always serialises with `JSON.stringify` and parses with `JSON.parse`.
- The array is **ordered by insertion**: index 0 is the oldest task; the newest task is always appended to the end.
- **No duplicate IDs** are permitted within the array. UUID v4 generation makes collisions astronomically unlikely; no deduplication check is required.
- Fields `id` and `createdAt` are **immutable** after creation — no operation modifies them.
- If `localStorage` is unavailable (private browsing, storage quota exceeded), the app degrades to in-memory-only state for the current session. See `Y2-errors.md §STORAGE_UNAVAILABLE`.
- The Storage Module MUST validate that each parsed element has all four required fields before using it; malformed entries are silently dropped and not rendered.

---

### Migration / Versioning

- v1 does not include a schema version field. If a schema version is added in a future version, a `schemaVersion` field will be added to the root level of the stored structure.
- In v1, any stored object missing required fields is discarded on load.

---
---

## Y1: Client-Side API

TodoApp has no HTTP server. The "API" is a set of JavaScript module functions that form the application's internal interface between the UI layer and the persistence layer. All functions are synchronous unless otherwise noted.

---

### Module Structure

```
src/
  storage.js      ← Storage Module: reads/writes localStorage
  tasks.js        ← Task Operations Module: business logic
  render.js       ← Render Module: DOM manipulation
  app.js          ← Entry point: initialisation, event wiring
```

---

### Storage Module (`storage.js`)

Responsible for all direct `localStorage` interaction. All other modules call these functions — they MUST NOT access `localStorage` directly.

#### `readTasks()`

```
readTasks(): Task[]
```

- Reads `localStorage.getItem("todoapp_tasks")`.
- If the value is `null` (key absent), returns `[]`.
- If the value is present, parses with `JSON.parse`.
- If parsing throws, logs the error to console and returns `[]` (see `Y2-errors.md §STORAGE_PARSE_ERROR`).
- Validates each element has all required fields (`id`, `text`, `completed`, `createdAt`); silently drops malformed entries.
- Returns the validated `Task[]` array.

#### `writeTasks(tasks)`

```
writeTasks(tasks: Task[]): void
```

- Serialises `tasks` with `JSON.stringify`.
- Calls `localStorage.setItem("todoapp_tasks", serialised)`.
- If `setItem` throws (quota exceeded or unavailable), catches the error and throws a `StorageWriteError` (see `Y2-errors.md §STORAGE_WRITE_FAIL`) for the caller to handle.

#### `isStorageAvailable()`

```
isStorageAvailable(): boolean
```

- Tests whether `localStorage` is accessible by attempting a small test write/delete.
- Returns `true` if available, `false` otherwise.
- Called once on page load; result cached for the session.

---

### Task Operations Module (`tasks.js`)

Contains business logic. Maintains the in-memory Task Array (`state.tasks`). Calls the Storage Module for persistence and the Render Module for display.

#### `initTasks()`

```
initTasks(): void
```

- Called once on page load (from `app.js`).
- Calls `readTasks()` to load persisted tasks.
- Stores result in module-level `state.tasks`.
- Calls `renderTaskList(state.tasks)`.

#### `addTask(text)`

```
addTask(text: string): { success: boolean; error?: string }
```

- Trims `text`.
- Validates: length ≥ 1 and ≤ 500. Returns `{ success: false, error: "EMPTY_TEXT" }` or `{ success: false, error: "TEXT_TOO_LONG" }` on failure.
- Generates a UUID v4 `id` (uses `crypto.randomUUID()` with fallback to `Math.random`-based generator).
- Constructs `Task` object with `completed: false` and `createdAt: new Date().toISOString()`.
- Calls `writeTasks([...state.tasks, newTask])`.
- On `StorageWriteError`: returns `{ success: false, error: "STORAGE_WRITE_FAIL" }`.
- On success: appends to `state.tasks`, calls `renderTaskList(state.tasks)`, returns `{ success: true }`.

#### `toggleTask(taskId)`

```
toggleTask(taskId: string): void
```

- Finds the task in `state.tasks` by `id`. If not found, logs console error and returns.
- Flips `task.completed`.
- Calls `writeTasks(state.tasks)`.
- On `StorageWriteError`: reverts the flip, calls `renderTaskList(state.tasks)`, shows storage error toast.
- On success: calls `renderTaskList(state.tasks)`.

#### `deleteTask(taskId)`

```
deleteTask(taskId: string): void
```

- Filters `state.tasks` to remove the task with matching `id`. If not found, logs console error and returns.
- Calls `writeTasks(filtered)`.
- On `StorageWriteError`: keeps original `state.tasks`, calls `renderTaskList(state.tasks)`, shows storage error toast.
- On success: sets `state.tasks = filtered`, calls `renderTaskList(state.tasks)`.

---

### Render Module (`render.js`)

Responsible for all DOM mutations. Stateless — always derives DOM from the passed task array.

#### `renderTaskList(tasks)`

```
renderTaskList(tasks: Task[]): void
```

- Clears the Task List Container element (`#task-list`).
- If `tasks.length === 0`: renders `<li class="task-list__empty">No tasks yet. Add one above!</li>` and returns.
- Otherwise, for each task in order:
  - Creates `<li data-task-id="{task.id}" class="task-item [task--completed]">` (applies `task--completed` class if `task.completed === true`).
  - Creates `<input type="checkbox" aria-label="{Mark complete|Mark incomplete}" [checked]>` and attaches the toggle event listener.
  - Creates `<span class="task-item__text">{task.text}</span>`.
  - Creates `<button class="task-item__delete" aria-label="Delete task">×</button>` and attaches the delete event listener.
  - Appends all child elements to the `<li>`, then appends `<li>` to the Task List Container.

#### `showValidationMessage(message)`

```
showValidationMessage(message: string): void
```

- Renders or updates an inline `<span id="add-validation-msg" role="alert">` below the Add Input with the given message.

#### `clearValidationMessage()`

```
clearValidationMessage(): void
```

- Removes or empties the inline validation message element.

#### `showToast(message)`

```
showToast(message: string): void
```

- Renders a temporary toast notification for non-blocking system errors (e.g. storage failures).
- Toast auto-dismisses after 4 seconds.

---

### Entry Point (`app.js`)

#### `init()`

```
init(): void
```

- Called on `DOMContentLoaded`.
- Checks `isStorageAvailable()`; if unavailable, shows a non-blocking banner: *"Note: tasks won't be saved in this browser session."*
- Calls `initTasks()` to load and render persisted tasks.
- Attaches event listeners:
  - Add Input `keydown` → if `Enter` key, call `addTask(inputEl.value)`.
  - Add Button `click` → call `addTask(inputEl.value)`.
  - Add Input `input` → call `clearValidationMessage()`.
  - Task List Container `click` (event delegation) → dispatch to `toggleTask` or `deleteTask` based on element class.

---
---

## Y2: Error Catalog

This section catalogs all error scenarios across all features of TodoApp. Because the app is client-only with no HTTP server, "errors" are JavaScript-level failures surfaced to the user via inline messages, toast notifications, or silent console logs. There are no HTTP status codes.

---

### Error Classification

| Level | Description | User Visibility |
|-------|-------------|----------------|
| **Validation** | User input fails a business rule | Inline message beneath the input |
| **Storage** | localStorage read/write fails | Toast notification |
| **System** | Internal programming error (unexpected state) | Silent (console error only) |

---

### Validation Errors

#### `EMPTY_TEXT`

- **Feature:** F00 (Add Task)
- **Trigger:** User submits the Add Input when the trimmed value is empty (blank or whitespace-only).
- **User Message:** *"Task cannot be empty."*
- **Behaviour:** Inline message shown beneath Add Input. Input stays focused. Task not created.
- **Recovery:** User types a non-empty value and resubmits.

#### `TEXT_TOO_LONG`

- **Feature:** F00 (Add Task)
- **Trigger:** User submits the Add Input when the trimmed value exceeds 500 characters.
- **User Message:** *"Task must be 500 characters or fewer."*
- **Behaviour:** Inline message shown beneath Add Input. Input stays focused. Task not created.
- **Recovery:** User shortens the text and resubmits.

---

### Storage Errors

#### `STORAGE_UNAVAILABLE`

- **Features:** All (detected at init)
- **Trigger:** `isStorageAvailable()` returns `false` on page load (e.g. private/incognito mode, browser settings, storage quota).
- **User Message (banner):** *"Note: tasks won't be saved in this browser session."*
- **Behaviour:** App operates in in-memory-only mode for the session. Tasks are visible and fully functional but lost on page reload.
- **Recovery:** User re-enables storage or uses a non-private browser session.

#### `STORAGE_READ_FAIL`

- **Feature:** F01 (View Task List — on load)
- **Trigger:** `localStorage.getItem` throws an unexpected exception.
- **User Message:** None (silent failure).
- **Behaviour:** Task Array initialised to `[]`. Empty state displayed. Error logged to console.
- **Recovery:** Automatic — app functions in memory-only mode.

#### `STORAGE_PARSE_ERROR`

- **Feature:** F01 (View Task List — on load)
- **Trigger:** `JSON.parse` throws when parsing the value of `"todoapp_tasks"`.
- **User Message:** None (silent failure).
- **Behaviour:** Task Array initialised to `[]`. Corrupted data left in localStorage (not overwritten until next write). Empty state displayed.
- **Recovery:** Automatic — app functions in memory-only mode until a successful write overwrites the corrupted value.

#### `STORAGE_WRITE_FAIL`

- **Features:** F00, F02, F03
- **Trigger:** `localStorage.setItem` throws (quota exceeded, storage disabled mid-session).
- **User Message (toast):** *"Unable to save. Try again."*
- **Behaviour:**
  - F00 (add): Task NOT added to Task Array. UI unchanged.
  - F02 (toggle): Completed flag reverted. UI re-rendered to pre-toggle state.
  - F03 (delete): Deletion reverted. UI re-rendered to show task still present.
- **Recovery:** Toast auto-dismisses after 4 seconds. User may retry the action.

---

### System Errors

#### `TASK_NOT_FOUND`

- **Features:** F02, F03
- **Trigger:** The `taskId` passed to `toggleTask` or `deleteTask` does not match any task in the current in-memory Task Array.
- **User Message:** None.
- **Behaviour:** Operation is a no-op. Error logged to console: `[TodoApp] Task not found: {taskId}`.
- **Recovery:** None needed — this indicates a stale DOM reference, which should not occur in normal operation.

#### `UUID_GENERATION_FALLBACK`

- **Feature:** F00 (Add Task)
- **Trigger:** `crypto.randomUUID()` is unavailable (very old browser or non-HTTPS context).
- **User Message:** None.
- **Behaviour:** ID generated using a `Math.random()`-based UUID v4 approximation. Task added normally.
- **Recovery:** Automatic fallback — no user action required.

---
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
