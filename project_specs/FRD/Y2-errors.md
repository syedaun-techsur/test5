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
