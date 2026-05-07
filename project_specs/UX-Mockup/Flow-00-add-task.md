---

## Flow 00: Add Task

**Trigger:** User types text into the Add Input and presses Enter, or clicks the Add Button.
**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4, US-0.5
**Journeys:** JRN-01.1 (First Task), JRN-01.2 (Mid-Work Capture), JRN-02.2 (Meeting-Mode Capture)

```
[Page Loads]
    │
    ▼
[Add Input — auto-focused, cursor blinking]
    │
    │  User types task text
    ▼
[User presses Enter  ─OR─  clicks Add Button]
    │
    ├── Trimmed value is empty / whitespace-only
    │       │
    │       ▼
    │   [Inline error: "Task cannot be empty."]
    │   Focus stays on Add Input
    │   Error clears on next keystroke
    │       │
    │       └──▶ [User corrects text → retries]
    │
    ├── Trimmed value > 500 characters
    │       │
    │       ▼
    │   [Inline error: "Task must be 500 characters or fewer."]
    │   Focus stays on Add Input
    │       │
    │       └──▶ [User shortens text → retries]
    │
    └── Trimmed value is valid (1–500 chars)
            │
            ▼
        [Write new Task object to localStorage]
            │
            ▼
        [Re-render task list — new item appears at bottom]
            │
            ▼
        [Clear Add Input]  →  [Return focus to Add Input]
            │
            ▼
        [User can immediately type next task]
```

### Steps

1. **Page Load → Auto-focus**
   - On `DOMContentLoaded`, the Add Input receives `focus()` automatically.
   - The cursor is visibly blinking inside the input field — no click needed.
   - The Add Button is rendered immediately adjacent (right side) to the Add Input.
   - *(US-0.1 AC: "Add Input receives focus automatically on page load")*

2. **User Types**
   - Any keystrokes go directly into the Add Input without mouse interaction.
   - The inline validation message (if previously shown) disappears immediately on the first `input` event.
   - *(US-0.3 AC: "inline validation message disappears as soon as the user begins typing")*

3. **Submission Trigger**
   - **Enter key** (US-0.1): `keydown` event on Add Input, key === "Enter".
   - **Add Button click** (US-0.2): `click` event on the Add Button.
   - Both paths enter the same validation logic.

4. **Validation: Blank Check**
   - Input is trimmed. If empty: show `"Task cannot be empty."` inline below the input.
   - Task Array and localStorage unchanged. Focus stays on Add Input.
   - *(US-0.3, US-0.5)*

5. **Validation: Length Check**
   - If trimmed length > 500: show `"Task must be 500 characters or fewer."` inline.
   - Task Array and localStorage unchanged. Focus stays on Add Input.
   - *(US-0.4)*

6. **Successful Add**
   - New Task object created: `{ id: UUID v4, text: trimmedValue, completed: false, createdAt: ISO8601 }`.
   - Task Array written to localStorage **before** DOM update (write-then-render).
   - `renderTaskList()` called — new task item appears at the bottom of the list immediately.
   - Any empty-state message is replaced by the task list.
   - Add Input value cleared; focus returns to Add Input.
   - *(US-0.1 AC: "input cleared automatically"; "focus returns to Add Input")*

7. **Whitespace Stripping (silent)**
   - Stored `text` field contains the trimmed value only.
   - Internal spaces preserved as typed.
   - *(US-0.5)*

### UI Elements Involved

| Element | Role | Behaviour |
|---------|------|-----------|
| Add Input `<input type="text">` | Primary capture field | Auto-focused on load; cleared on success; focus returned on success/failure |
| Add Button `<button>Add</button>` | Submit affordance | Adjacent to Add Input (right side); triggers same logic as Enter |
| Inline Validation `<span role="alert">` | Error feedback | Appears below Add Input on rejection; cleared on next keystroke |
| Task List Container `<ul>` | Output target | Re-rendered with new task appended at bottom |

### States During This Flow

| State | Add Input | Add Button | Validation Message | Task List |
|-------|-----------|-----------|-------------------|-----------|
| Idle (empty input) | Focused, empty | Enabled | Hidden | Shows tasks or empty state |
| Typing | Focused, has text | Enabled | Hidden (cleared on type) | Unchanged |
| Blank submission rejected | Focused, empty/whitespace | Enabled | "Task cannot be empty." | Unchanged |
| Long submission rejected | Focused, long text | Enabled | "Task must be 500 characters or fewer." | Unchanged |
| Successful add | Focused, cleared | Enabled | Hidden | New task appended at bottom |
| Storage write failure | Focused, text preserved | Enabled | Toast: "Unable to save. Try again." | Unchanged |

---
