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
