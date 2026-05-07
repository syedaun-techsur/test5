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
