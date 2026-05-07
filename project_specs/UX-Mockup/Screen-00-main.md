---

## Screen 00: Main Screen (The Only Screen)

**Purpose:** The single screen that handles the complete user journey — add tasks, view them, mark complete, delete.
**User Stories:** All 18 (US-0.1 – US-3.4)
**Journeys:** All 6 (JRN-01.1 – JRN-02.3)

---

### Layout — Default State (Tasks Exist)

```
┌─────────────────────────────────────────────────────────────┐
│                    Simple To-Do App                         │  ← App title / h1
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────┐  ┌─────────┐  │
│  │  What needs to be done?                 │  │  Add    │  │  ← Add Input + Add Button
│  └─────────────────────────────────────────┘  └─────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ○  Buy groceries                                    [ × ]  │  ← Pending task
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│  ☑  ~~Call the dentist~~                  (muted)   [ × ]  │  ← Completed task
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│  ○  Review the contract                              [ × ]  │  ← Pending task
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│  ○  Send invoice to client                           [ × ]  │  ← Pending task
│                                                             │
└─────────────────────────────────────────────────────────────┘

Legend:
  ○  = unchecked checkbox (pending)
  ☑  = checked checkbox (completed)
  ~~text~~  = strikethrough text
  (muted)   = reduced opacity (0.5)
  [ × ]     = Delete Button
```

### Layout — Empty State

```
┌─────────────────────────────────────────────────────────────┐
│                    Simple To-Do App                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────┐  ┌─────────┐  │
│  │  What needs to be done?         [cursor]│  │  Add    │  │  ← Auto-focused
│  └─────────────────────────────────────────┘  └─────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│          No tasks yet. Add one above!                       │  ← Empty state message
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Layout — Validation Error State

```
┌─────────────────────────────────────────────────────────────┐
│                    Simple To-Do App                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────┐  ┌─────────┐  │
│  │                                 [cursor]│  │  Add    │  │
│  └─────────────────────────────────────────┘  └─────────┘  │
│  ⚠ Task cannot be empty.                                    │  ← Inline validation
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ... task list unchanged ...                                │
└─────────────────────────────────────────────────────────────┘
```

### Layout — localStorage Unavailable (Banner)

```
┌─────────────────────────────────────────────────────────────┐
│  ℹ Note: tasks won't be saved in this browser session.      │  ← Non-blocking banner
├─────────────────────────────────────────────────────────────┤
│                    Simple To-Do App                         │
├─────────────────────────────────────────────────────────────┤
│  ... normal Add Input + Task List below ...                 │
└─────────────────────────────────────────────────────────────┘
```

### Layout — Storage Write Failure Toast

```
┌─────────────────────────────────────────────────────────────┐
│  ... normal screen content ...                              │
│                                                             │
│                                        ┌─────────────────┐ │
│                                        │ ⚠ Unable to     │ │  ← Toast (bottom-right
│                                        │   save.         │ │    or top-right)
│                                        │   Try again.    │ │
│                                        └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
Toast auto-dismisses after 4 seconds.
```

---

### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| **Primary** | Add Input field | Top of page, full-width minus button | First thing user interacts with; auto-focused on load |
| **Primary** | Add Button | Adjacent to Add Input (right) | Immediate, discoverable submit affordance |
| **Primary** | Task Text (pending) | Body of each task item, full contrast | Core information — what needs to be done |
| **Secondary** | Completion Checkbox | Left of task text, per item | Important control but secondary to reading the text |
| **Secondary** | Delete Button | Right of task text, per item | Destructive action; visible but not dominant |
| **Secondary** | Task Text (completed) | Body of task item, 0.5 opacity + strikethrough | Still visible but visually de-prioritised |
| **Tertiary** | Empty State Message | Inside Task List Container, centered | Only shown when no tasks; calm, not alarming |
| **Tertiary** | Inline Validation Message | Below Add Input | Only shown on submission failure; contextual |
| **Tertiary** | Storage Unavailable Banner | Top of page, above title | Rare scenario; non-blocking |
| **Tertiary** | Storage Write Failure Toast | Overlay, corner of screen | Rare scenario; auto-dismisses |

---

### Component Specifications

#### Add Input

| Property | Value |
|----------|-------|
| Element | `<input type="text" id="task-input">` |
| Placeholder | `"What needs to be done?"` (or similar) |
| Max length hint | None (validation handled programmatically, not via `maxlength`) |
| Auto-focus | On `DOMContentLoaded` AND on every successful task add |
| Width | Full available width minus Add Button |
| Keyboard | Enter key submits; any character clears validation message |

#### Add Button

| Property | Value |
|----------|-------|
| Element | `<button id="add-btn" type="button">Add</button>` |
| Placement | Immediately right of Add Input, same row |
| State | Always enabled (validation happens on submit, not on button state) |
| Min size | 44 × 44 px (WCAG 2.5.5) |

#### Task Item (per task)

| Sub-element | Element | Key Attributes | Notes |
|-------------|---------|----------------|-------|
| Completion Checkbox | `<input type="checkbox">` | `aria-label="Mark complete"` OR `"Mark incomplete"` | Checked = completed |
| Task Text | `<span class="task-item__text">` | — | Text content = `task.text` |
| Delete Button | `<button class="task-item__delete">` | `aria-label="Delete task"` | Label: `×` or trash icon |
| Task Item wrapper | `<li data-task-id="[uuid]">` | `class="task-item [task--completed]"` | `task--completed` when `completed === true` |

#### Empty State

| Property | Value |
|----------|-------|
| Element | `<li class="task-list__empty">` inside `<ul id="task-list">` |
| Text | `"No tasks yet. Add one above!"` |
| Style | Centered, muted/secondary color — calm, not error-like |
| Shown | Only when Task Array length === 0 |

#### Inline Validation Message

| Property | Value |
|----------|-------|
| Element | `<span id="add-validation-msg" role="alert">` |
| Placement | Directly below the Add Input, above the task list |
| Messages | `"Task cannot be empty."` or `"Task must be 500 characters or fewer."` |
| Dismissed | On next `input` event in the Add Input |

---

### All Screen States

| State Name | What's Visible | Triggered By |
|-----------|---------------|-------------|
| **First Visit Empty** | Add Input (focused) + Add Button + Empty State message | First page load, no localStorage data |
| **Tasks Loaded** | Add Input + Add Button + Task List (mixed pending/complete) | Page load with stored tasks |
| **Typing** | Add Input with text + Add Button + Task List unchanged | User keystroke in Add Input |
| **Submission Rejected (blank)** | Inline validation "Task cannot be empty." + Add Input focused | Enter/button click with empty input |
| **Submission Rejected (too long)** | Inline validation "Task must be 500 chars or fewer." + input focused | Enter/button click with >500 chars |
| **Task Added** | New task item at bottom of list; Add Input cleared and focused | Successful add |
| **Task Completed** | Toggled item has strikethrough + muted style + checked checkbox | Checkbox click on pending task |
| **Task Un-completed** | Toggled item returns to full contrast + unchecked checkbox | Checkbox click on completed task |
| **Task Deleted** | Item removed from list; others unchanged | Delete Button click |
| **Last Task Deleted** | Empty state: "No tasks yet. Add one above!"; Add Input focused | Delete Button on last task |
| **Storage Unavailable** | Banner: "Note: tasks won't be saved..." + normal UI below | init() detects no localStorage |
| **Storage Write Fail** | Toast: "Unable to save. Try again." (auto-dismisses 4s) | writeTasks() throws |

---
