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
