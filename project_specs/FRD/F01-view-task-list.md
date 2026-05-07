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
