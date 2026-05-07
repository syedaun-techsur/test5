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

---

### Process

1. Page loads → Add Input is rendered and receives focus automatically.
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
