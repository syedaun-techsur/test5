# UX Mockup — Simple To-Do App (TodoApp)

**Project:** Simple To-Do App (TodoApp)
**Generated:** 2026-05-07
**Based on:** UserStories-TodoApp.md, JOURNEYS-TodoApp.md, PRD-TodoApp.md, FRD-TodoApp.md
**User Stories Covered:** US-0.1 – US-3.4 (18 stories, all P0)

---

## Overview

### UX Approach

TodoApp is a **single-screen, zero-navigation application**. The entire product lives on one page. There are no modals, no routing, no onboarding flows, and no login walls. Every journey — from first visit to daily cleanup — begins and ends on the same screen.

The UX philosophy is **speed over everything**: the fastest path from a thought to a task list entry, and from a completed item to a clean list. Every interaction must feel instantaneous (< 100 ms feedback). Every affordance must be self-evident without instructions.

### Design Principles

| Principle | Rationale | Source |
|-----------|-----------|--------|
| **Zero friction to first task** | Marcus closes the tab if he sees any setup step (JRN-01.1) | US-0.1, US-0.2 |
| **Auto-focus always** | Both personas depend on keyboard-only capture; mouse touch breaks the flow (JRN-01.2, JRN-02.2) | US-0.1, US-2.4 |
| **Instant feedback, no spinners** | Any loading state is visible in meeting-mode and teaches "the app is slow" (JRN-02.2) | US-1.4, PRD NFR |
| **No confirmation dialogs** | A single delete-confirm dialog kills the end-of-day cleanup sweep (JRN-01.3, JRN-02.3) | US-3.1 |
| **Persistent visual state** | Completed vs. pending must be parseable in < 3 seconds at a glance (JRN-01.3, JRN-02.3) | US-1.2 |
| **Trust through persistence** | Priya declares the app unreliable if a single task is missing after restart (JRN-02.1) | US-1.5, US-2.3, US-3.3 |
| **Empty state as signal, not error** | After all tasks are deleted the screen should feel intentional and ready, not broken | US-1.3, US-3.2 |

### Architectural Constraint → UX Implication

The app is **client-only, localStorage-backed, no backend**. This means:
- No loading screens on startup (localStorage read is synchronous)
- No network error states to design for
- No session management or login UI
- All state changes are synchronous → instant DOM updates are achievable and required

### Screen Count

| Screen | Description |
|--------|-------------|
| **Main Screen** | The only screen. Contains: Add Input + Add Button, Task List (with per-item Checkbox + Delete Button), Empty State, validation messages, optional storage-unavailable banner. |

### Flow Count

| Flow ID | Flow Name | Entry | Stories |
|---------|-----------|-------|---------|
| Flow-00 | Add Task | User types in Add Input | US-0.1 – US-0.5 |
| Flow-01 | View & Persist | Page load / tab switch | US-1.1 – US-1.5 |
| Flow-02 | Complete / Un-complete Task | User clicks checkbox | US-2.1 – US-2.4 |
| Flow-03 | Delete Task | User clicks delete button | US-3.1 – US-3.4 |

---
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
---

## Flow 01: View Task List & Persistence

**Trigger:** Page loads (initial visit or browser restart), or any state mutation (add/toggle/delete).
**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5
**Journeys:** JRN-01.1 (Verify stage), JRN-02.1 (Browser Restart Resilience), JRN-02.2 (Submit stage)

```
[Browser navigates to app URL]
    │
    ▼
[DOMContentLoaded fires → init()]
    │
    ├── isStorageAvailable() → false
    │       │
    │       ▼
    │   [Show non-blocking banner:
    │    "Note: tasks won't be saved in this browser session."]
    │   App continues in memory-only mode
    │
    └── isStorageAvailable() → true
            │
            ▼
        [readTasks() from localStorage "todoapp_tasks"]
            │
            ├── Key absent / JSON corrupted → Task Array = []
            │       │
            │       └──▶ [Render empty state]
            │
            └── Valid JSON parsed → Task Array = [task, ...]
                    │
                    ▼
                [renderTaskList(tasks)]
                    │
                    ├── tasks.length === 0
                    │       │
                    │       ▼
                    │   [Empty State: "No tasks yet. Add one above!"]
                    │
                    └── tasks.length > 0
                            │
                            ▼
                        [Each task rendered as Task Item:
                         Checkbox | Task Text | Delete Button]
                            │
                            ├── task.completed === true
                            │   → CSS class task--completed
                            │     (strikethrough + 0.5 opacity)
                            │
                            └── task.completed === false
                                → Default full-contrast style

[On any state mutation (add / toggle / delete)]
    │
    ▼
[writeTasks(updatedArray) → localStorage]  ← write FIRST
    │
    ▼
[renderTaskList(updatedArray)]  ← then render
    │
    ▼
[DOM updated synchronously — no page reload, no spinner]
```

### Steps

1. **Page Load Initialisation**
   - `init()` called on `DOMContentLoaded`.
   - Storage availability checked once; result cached for session.
   - If unavailable: non-blocking banner shown at top of page (does not block interaction).
   - *(US-1.5 AC: "If localStorage is unavailable... a non-blocking banner reads...")*

2. **Loading Tasks**
   - `readTasks()` reads `localStorage["todoapp_tasks"]`.
   - On missing key: returns `[]` silently (first-ever visit → empty state).
   - On corrupted JSON: returns `[]` silently (no error shown to user).
   - *(US-1.1 AC: "Corrupted or missing localStorage data results in an empty list with no error shown")*

3. **Rendering the Task List**
   - `renderTaskList(tasks)` fully clears and re-renders the Task List Container on every call.
   - Renders in insertion order: index 0 (oldest) at top, newest at bottom.
   - *(US-1.1 AC: "All previously saved tasks are rendered in creation order (oldest at top)")*

4. **Task Item Anatomy**
   - Each rendered task item contains (left to right): Checkbox, Task Text, Delete Button.
   - Completed tasks: `task--completed` CSS class → `text-decoration: line-through` + `opacity: 0.5`.
   - Pending tasks: no class → full contrast, normal text decoration.
   - *(US-1.2 AC: "Completed tasks display with strikethrough text and muted/reduced-opacity colour")*

5. **Empty State**
   - When Task Array length === 0: render `"No tasks yet. Add one above!"` inside the Task List Container.
   - No task items appear alongside this message.
   - Shown on: first visit, after last task deleted, after corrupted storage load.
   - *(US-1.3 AC: "When the Task Array contains zero items, the message 'No tasks yet. Add one above!' is displayed")*

6. **Real-time Updates**
   - Every mutation writes to localStorage before calling `renderTaskList`.
   - The DOM update is synchronous — no async delay, no spinner, no page reload.
   - Target: DOM updated within 100 ms of user action.
   - *(US-1.4 AC: "Adding a task appends it to the list immediately (within 100 ms)")*

7. **Persistence Across Refreshes**
   - Because every mutation writes to localStorage first, a page refresh restores the exact state.
   - Tasks, completion states, and order all survive a full browser restart.
   - *(US-1.5 AC: "After a full page refresh, all tasks that existed before the refresh are re-displayed")*

### UI Elements Involved

| Element | Role | Notes |
|---------|------|-------|
| Storage Banner `<div role="alert">` | Non-blocking persistence warning | Shown only when localStorage unavailable |
| Task List Container `<ul id="task-list">` | Holds all task items or empty state | Fully replaced on every render call |
| Task Item `<li data-task-id="...">` | One per task | Classes: `task-item`, optionally `task--completed` |
| Empty State `<li class="task-list__empty">` | Zero-task placeholder | Shown only when list is empty |

### States

| State | Task List Container Content | Banner |
|-------|---------------------------|--------|
| First visit (no localStorage key) | Empty state message | Hidden |
| Tasks exist, all pending | List of task items, all full contrast | Hidden |
| Tasks exist, mixed states | List — pending (full) + completed (struck-through + muted) | Hidden |
| All tasks completed | List — all items struck-through + muted | Hidden |
| Last task deleted → empty | Empty state message | Hidden |
| localStorage unavailable | Empty state (or in-memory tasks if already added this session) | Visible: "Note: tasks won't be saved..." |
| Corrupted localStorage on load | Empty state message | Hidden |

---
---

## Flow 02: Complete / Un-complete Task

**Trigger:** User clicks (or activates via keyboard) the Completion Checkbox on a task item.
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4
**Journeys:** JRN-01.3 (Complete stage), JRN-02.1 (Validate Completions stage)

```
[Task Item visible in Task List]
    │
    │  User clicks checkbox  ─OR─  focuses checkbox via Tab + presses Space/Enter
    ▼
[Event: checkbox click / keydown on Completion Checkbox]
    │
    ▼
[Read data-task-id from parent Task Item]
    │
    ▼
[toggleTask(taskId)]
    │
    ├── taskId not found in Task Array (defensive no-op)
    │       │
    │       └──▶ [Console error logged; UI unchanged]
    │
    └── taskId found
            │
            ▼
        [Flip task.completed: false → true  ─OR─  true → false]
            │
            ▼
        [writeTasks(updatedArray) → localStorage]  ← write FIRST
            │
            ▼
        [renderTaskList(updatedArray)]
            │
            ├── task.completed now true
            │       │
            │       ▼
            │   [Task Item: CSS class task--completed added]
            │   [Strikethrough text + 0.5 opacity applied]
            │   [Checkbox aria-label → "Mark incomplete"]
            │   [Checkbox appears checked]
            │
            └── task.completed now false
                    │
                    ▼
                [Task Item: CSS class task--completed removed]
                [Full contrast text, no strikethrough]
                [Checkbox aria-label → "Mark complete"]
                [Checkbox appears unchecked]
            │
            ▼
        [Focus returned to toggled checkbox]
            (keyboard users maintain position)
```

### Steps

1. **Checkbox Interaction**
   - Each Task Item renders a `<input type="checkbox">` as the leftmost element.
   - `checked` attribute reflects `task.completed` at render time.
   - Click target must meet minimum 44 × 44 px touch/click target (WCAG 2.5.5).
   - *(US-2.1 AC: "Each task item renders a checkbox whose checked state matches the task's current completed field")*

2. **Toggle Logic**
   - System reads `data-task-id` from the Task Item wrapping element.
   - `toggleTask(taskId)` flips `task.completed` in the in-memory Task Array.
   - **Write before render**: localStorage is updated before `renderTaskList` is called.
   - *(US-2.1 AC: "The updated state is written to localStorage before the UI re-renders")*

3. **Mark Complete (pending → complete)**
   - Checkbox becomes checked.
   - `task--completed` CSS class applied to Task Item.
   - Text renders with `text-decoration: line-through` and `opacity: 0.5`.
   - `aria-label` on checkbox updates to `"Mark incomplete"`.
   - *(US-2.1 AC: "The task immediately displays the completed visual treatment")*

4. **Un-complete (complete → pending)**
   - Checkbox becomes unchecked.
   - `task--completed` CSS class removed from Task Item.
   - Text returns to full contrast, no strikethrough.
   - `aria-label` on checkbox updates to `"Mark complete"`.
   - *(US-2.2 AC: "The task immediately reverts to the pending visual style")*

5. **Persistence**
   - Because localStorage is written on every toggle, completion states survive page refresh and browser restart.
   - *(US-2.3 AC: "After marking a task complete, a page refresh shows that task still in the completed state")*

6. **Focus Management (Keyboard)**
   - After re-render, focus is returned to the toggled checkbox so keyboard users do not lose their position in the list.
   - *(US-2.4 AC: "After a toggle via keyboard, focus returns to the toggled checkbox so the user does not lose position")*

### UI Elements Involved

| Element | Role | Behaviour on Toggle |
|---------|------|---------------------|
| Completion Checkbox `<input type="checkbox">` | Toggle control | `checked` reflects `completed`; `aria-label` updates on each render |
| Task Item `<li>` | Task container | Receives/loses `task--completed` class |
| Task Text `<span class="task-item__text">` | Text display | Inherits strikethrough + opacity from `task--completed` class |

### States During This Flow

| Task State | Checkbox | Text Style | `aria-label` | CSS Class |
|-----------|----------|-----------|-------------|-----------|
| Pending | Unchecked | Full contrast, no decoration | `"Mark complete"` | `task-item` |
| Completed | Checked | Strikethrough + 0.5 opacity | `"Mark incomplete"` | `task-item task--completed` |
| Toggle in progress | — (synchronous, no interim state) | — | — | — |
| Storage write failure | Reverted to pre-toggle state | Pre-toggle style | Pre-toggle label | Pre-toggle class |

### Storage Write Failure (Edge Case)

If `writeTasks()` throws (quota exceeded / storage disabled mid-session):
- The `completed` flip is **reverted** in memory.
- `renderTaskList` re-renders to the **pre-toggle** state.
- A toast notification appears: `"Unable to save. Try again."`
- Auto-dismisses after 4 seconds.
- *(FRD Y2: STORAGE_WRITE_FAIL)*

---
---

## Flow 03: Delete Task

**Trigger:** User clicks (or activates via keyboard) the Delete Button on a task item.
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4
**Journeys:** JRN-01.3 (Delete stage), JRN-02.3 (Delete First Item + Delete Remaining stages)

```
[Task Item visible in Task List]
    │
    │  User clicks "×" / trash icon  ─OR─  focuses Delete Button via Tab + presses Enter/Space
    ▼
[Event: click / keydown on Delete Button]
    │
    ▼
[Read data-task-id from parent Task Item]
    │
    ▼
[deleteTask(taskId)] — NO confirmation dialog
    │
    ├── taskId not found in Task Array (defensive no-op)
    │       │
    │       └──▶ [Console error logged; UI unchanged]
    │
    └── taskId found
            │
            ▼
        [Filter task from in-memory Task Array]
            │
            ▼
        [writeTasks(filteredArray) → localStorage]  ← write FIRST
            │
            ▼
        [renderTaskList(filteredArray)]
            │
            ├── filteredArray.length > 0
            │       │
            │       ▼
            │   [Task list re-renders without deleted item]
            │   [Focus moves to next task, or previous task,
            │    or Add Input if list now empty]
            │
            └── filteredArray.length === 0
                    │
                    ▼
                [Empty state: "No tasks yet. Add one above!"]
                [Add Input remains visible and focused]
```

### Steps

1. **Delete Button Placement & Visibility**
   - Each Task Item renders a Delete Button as the rightmost element.
   - The Delete Button displays a `"×"` character or a trash-can icon.
   - It must be **always visible** (not hover-only) to support mobile touch and rapid deletion sweeps.
   - Minimum 44 × 44 px touch/click target.
   - *(US-3.1 AC: "Each task item renders a delete button (labelled '×' or a trash icon) with aria-label='Delete task'")*

2. **Deletion — No Confirmation**
   - Clicking the Delete Button immediately triggers `deleteTask(taskId)`.
   - **No confirmation dialog is shown.** Ever.
   - Deletion is permanent and irreversible in v1.
   - *(US-3.1 AC: "No confirmation dialog is displayed before deletion")*
   - *(JRN-01.3, JRN-02.3 Risk: "A confirmation dialog here is a known drop-off trigger")*

3. **Write Before Render**
   - The filtered Task Array is written to localStorage **before** `renderTaskList` is called.
   - Ensures the deletion survives an immediate page refresh.
   - *(US-3.3 AC: "After deleting a task, a full page refresh does NOT restore that task")*

4. **Re-render After Deletion**
   - `renderTaskList` is called with the filtered array.
   - The deleted task item disappears from the DOM within 100 ms of the click.
   - All other tasks remain in their original order with their original states.
   - *(US-3.1 AC: "The task list re-renders without the deleted item within 100 ms of the click")*
   - *(US-3.1 AC: "All other tasks remain unmodified")*

5. **Empty State After Last Deletion**
   - If the filtered array is empty, `renderTaskList` renders: `"No tasks yet. Add one above!"`.
   - The Add Input remains visible and focused.
   - *(US-3.2 AC: "Deleting the last task in the list causes the empty-state message to appear")*
   - *(US-3.2 AC: "The Add Input remains visible and focused so I can immediately start a fresh list")*

6. **Focus Management (Keyboard)**
   - After deletion, keyboard focus moves in this priority order:
     1. Next task's Delete Button (if a task below the deleted one exists)
     2. Previous task's Delete Button (if the deleted task was at the bottom)
     3. Add Input (if the list is now empty)
   - *(US-3.4 AC: "After deletion, keyboard focus moves to a logical adjacent element")*

### UI Elements Involved

| Element | Role | Behaviour on Delete |
|---------|------|---------------------|
| Delete Button `<button class="task-item__delete">` | Trigger deletion | `aria-label="Delete task"`; always visible; no confirm |
| Task Item `<li data-task-id="...">` | Deleted unit | Removed from DOM after write-then-render |
| Task List Container `<ul>` | List host | Re-rendered; shows empty state if array empty |
| Add Input | Next action affordance | Focused after last task is deleted |

### States During This Flow

| Scenario | Before Delete | After Delete |
|----------|--------------|-------------|
| Delete one of many tasks | N task items | N-1 task items; others unchanged |
| Delete last remaining task | 1 task item | Empty state: "No tasks yet. Add one above!" |
| Delete completed task | Task with `task--completed` styling | Task removed; list re-renders correctly |
| Delete pending task | Task with default styling | Task removed; list re-renders correctly |
| Storage write failure | N task items | Deletion reverted; N task items shown; toast: "Unable to save. Try again." |

### Rapid Deletion Sweep (Priya's End-of-Day Reset Pattern)

For the scenario where a user deletes 5+ completed tasks in sequence (JRN-02.3):
- The Delete Button must be always-visible (never hover-only), so each successive click requires no mouse re-positioning.
- Each deletion completes in < 100 ms, making rapid successive clicks smooth.
- No dialog, no animation delay between deletions.
- After each deletion, the list immediately re-renders — the next item's Delete Button is in a predictable position.

---
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
---

## Interaction Patterns

### Pattern 1: Auto-Focus on Load and Return Focus on Action

**When to use:** Page load, successful task add, rejected submission.
**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4
**Journeys:** JRN-01.1, JRN-01.2, JRN-02.2

**Behaviour:**
- On `DOMContentLoaded`, call `focus()` on the Add Input.
- On successful add: after clearing input value, call `focus()` on Add Input.
- On rejected submission (blank, too long): after showing validation message, focus remains on (or returns to) Add Input.
- Never require the user to click the input field to begin typing.

**Why it matters:**
Marcus's mid-work capture (JRN-01.2) and Priya's meeting-mode capture (JRN-02.2) both depend entirely on the input being keyboard-ready when the tab is activated. Any scenario that forces a mouse click to focus the input field breaks the keyboard-only flow.

**Implementation note:** `visibilitychange` or `focus` event on the window/tab can be used to re-focus the Add Input when the user switches back to the tab.

---

### Pattern 2: Write-Then-Render (Synchronous State Update)

**When to use:** Every state mutation — add task, toggle completion, delete task.
**User Stories:** US-1.4, US-1.5, US-2.1, US-2.3, US-3.1, US-3.3
**Journeys:** All 6 journeys

**Behaviour:**
1. Mutate the in-memory Task Array.
2. Call `writeTasks(updatedArray)` → localStorage write.
3. Call `renderTaskList(updatedArray)` → DOM update.

The DOM is never updated before localStorage is written. This guarantees that a page refresh immediately after any action restores the correct state.

**Why no spinner:** localStorage operations are synchronous. There is no async gap between user action and DOM update. A spinner would be misleading and would violate the < 100 ms feedback requirement.

---

### Pattern 3: Inline Validation (Not Toast) for Input Errors

**When to use:** Add Task submission failures (blank, too long).
**User Stories:** US-0.3, US-0.4

**Behaviour:**
- Validation errors appear as a `<span role="alert">` directly below the Add Input.
- The message appears immediately on failed submission (same event tick).
- The message disappears on the next `input` event — as soon as the user types a character.
- Focus remains on the Add Input — no disruption to typing flow.

**Why inline, not toast:**
Inline messages are directly spatially associated with the input that caused the error. For a single-field submission, inline is faster to read and less disruptive. Toast is reserved for system/storage errors (Pattern 4).

---

### Pattern 4: Toast for System / Storage Errors

**When to use:** `writeTasks()` throws (quota exceeded, storage disabled mid-session).
**User Stories:** US-1.5 (edge case)
**FRD Reference:** Y2 — STORAGE_WRITE_FAIL

**Behaviour:**
- A floating toast notification appears in the corner of the screen.
- Message: `"Unable to save. Try again."` (for write failures) or `"Note: tasks won't be saved in this browser session."` (for unavailability — as a banner at page top).
- Auto-dismisses after 4 seconds with no user action required.
- The UI state is reverted to match localStorage (consistency between in-memory state and what will survive a reload).

**Why not inline:** Storage errors are not caused by a specific form field — they are system-level. Toast is the appropriate pattern for non-blocking system notifications.

---

### Pattern 5: Always-Visible Delete Button (No Hover-Gating)

**When to use:** Every task item, at all times.
**User Stories:** US-3.1, US-3.4
**Journeys:** JRN-02.3 (Rapid Deletion Sweep)

**Behaviour:**
- The Delete Button (`×` or trash icon) is visible on every task item at all times.
- It is NOT hidden behind a hover state.
- It is NOT shown only on focus.

**Why always-visible:**
Priya's end-of-day sweep (JRN-02.3) requires clicking 5 delete buttons in rapid succession. A hover-only trigger forces slow, deliberate mouse positioning between each deletion. Always-visible buttons allow fast, rhythmic clicking without repositioning between items.

On mobile, hover states don't exist — always-visible is the only option for touch interfaces.

---

### Pattern 6: No Confirmation Dialogs

**When to use:** Delete Task flow — always.
**User Stories:** US-3.1
**Journeys:** JRN-01.3, JRN-02.3

**Behaviour:**
- Clicking the Delete Button immediately removes the task. No "Are you sure?" dialog.
- Deletion is final. No undo.

**Why:**
Both Marcus (JRN-01.3) and Priya (JRN-02.3) identify confirmation dialogs as the primary abandonment trigger for cleanup sweeps. A single confirmation prompt stops the deletion momentum. For a simple personal task list, the cost of accidental deletion is low enough that the friction of confirmation outweighs the benefit.

---

### Pattern 7: Complete Task List Re-render on Every Mutation

**When to use:** Every state change (add / toggle / delete).
**User Stories:** US-1.4
**FRD Reference:** F01, renderTaskList()

**Behaviour:**
- `renderTaskList(tasks)` clears the Task List Container and re-renders all items from scratch on every call.
- No incremental patching, no virtual DOM diffing (v1 scope).
- This is acceptable for the expected list sizes (< 100 items for a personal daily task app).

**Why full re-render:**
Simplicity. For v1 scope, a full re-render is easier to reason about and guarantees the DOM always exactly reflects the in-memory state. The 100 ms performance budget is achievable with a full re-render for typical list sizes.

---

### Pattern 8: Empty State as Completion Signal

**When to use:** Task Array is empty (first visit, after last deletion).
**User Stories:** US-1.3, US-3.2
**Journeys:** JRN-02.3 (Verify Clean List stage)

**Behaviour:**
- When tasks array is empty, render: `"No tasks yet. Add one above!"`
- Style: calm, centered, secondary colour — not an error state.
- The Add Input remains visible and focused above the empty state.
- The message is warm and instructional on first visit; on post-deletion, it functions as a "clean slate" confirmation.

**Why tone matters:**
For Priya's end-of-day reset (JRN-02.3), the empty state is a reward: "I finished everything." The message must not look like a warning or error. A friendly empty state reinforces the daily use habit.

---
---

## Responsive Considerations

TodoApp is a single-screen application with a minimal layout. Responsive design is straightforward: the layout column narrows on smaller viewports but the component order and hierarchy remain identical across breakpoints.

---

### Desktop (> 1024 px)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              ┌──────────────────────────────────────────────┐   │
│              │           Simple To-Do App                   │   │
│              ├─────────────────────────────────┬────────────┤   │
│              │  Add Input (text field)         │  Add Btn   │   │
│              ├─────────────────────────────────┴────────────┤   │
│              │ ○  Task text here...                  [ × ]  │   │
│              │ ☑  ~~Completed task~~          (muted)[ × ]  │   │
│              │ ○  Another pending task               [ × ]  │   │
│              └──────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- **Max content width:** ~600–700 px, centered horizontally on wide viewports.
- Wide margins on either side — no need to stretch to full browser width.
- Add Input and Add Button on the same row.
- Delete Buttons always visible on right edge of each task item.
- Comfortable vertical spacing between task items.

---

### Tablet (768 px – 1024 px)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         ┌──────────────────────────────────┐     │
│         │        Simple To-Do App          │     │
│         ├────────────────────────┬─────────┤     │
│         │  Add Input             │  Add    │     │
│         ├────────────────────────┴─────────┤     │
│         │ ○  Task text here...      [ × ]  │     │
│         │ ☑  ~~Done task~~  (muted) [ × ]  │     │
│         │ ○  Pending task           [ × ]  │     │
│         └──────────────────────────────────┘     │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout identical to desktop; content column narrows to fit viewport.
- Add Input still shares a row with Add Button — sufficient horizontal space.
- Touch targets already sized at 44 × 44 px — no additional changes required.
- No layout changes needed vs. desktop.

---

### Mobile (< 768 px)

```
┌────────────────────────────────────────┐
│         Simple To-Do App              │
├──────────────────────────┬────────────┤
│  Add Input               │  Add Btn   │  ← Same row, full width
├──────────────────────────┴────────────┤
│                                       │
│ ○  Task text here...          [ × ]   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│ ☑  ~~Completed task~~  (muted)[ × ]   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│ ○  Pending task               [ × ]   │
│                                       │
└────────────────────────────────────────┘
```

**Key mobile adjustments:**

| Element | Mobile Behaviour | Rationale |
|---------|----------------|-----------|
| Add Input + Add Button | Same row; input fills remaining width; button fixed width | Preserves single-row layout; avoids stacked submit |
| Task Item height | Increased minimum row height (min 48–56 px) | Comfortable touch tap target for checkbox and delete |
| Checkbox | 44 × 44 px minimum tap target (padding around `<input>`) | WCAG 2.5.5; fat-finger-safe |
| Delete Button | 44 × 44 px minimum tap target; always visible | No hover state on touch — must be permanently visible |
| Task text | Wraps naturally; no truncation | Short tasks stay single-line; longer tasks wrap gracefully |
| Inline validation | Below Add Input; full width | Readable on narrow viewports |
| Toast | Top-center or bottom-center on mobile (not corner) | Corners can be obscured by system chrome on mobile |
| Storage banner | Full-width at top | Consistent with desktop; easy to dismiss by reading |
| Empty state | Centered in list area; font size readable | Same copy; slightly larger padding on mobile |

**Input keyboard on mobile:**
- Tapping the Add Input opens the software keyboard.
- The task list scrolls to keep the Add Input in view (standard browser scroll-to-focused behaviour).
- After adding a task, focus returns to Add Input — software keyboard stays open, allowing rapid task entry.
- *(US-0.1, US-0.2: "The Add Input is cleared and refocused after successful submission")*

---

### Breakpoint Summary

| Breakpoint | Max Content Width | Add Row | Task Item Height | Delete Visibility |
|------------|-----------------|---------|-----------------|------------------|
| Desktop > 1024 px | 600–700 px centered | Input + Button on same row | ~40 px | Always visible |
| Tablet 768–1024 px | ~90% of viewport | Input + Button on same row | ~44 px | Always visible |
| Mobile < 768 px | Full viewport width with padding | Input + Button on same row | ~48–56 px | Always visible |

---
---

## Accessibility Notes

**Standard:** WCAG 2.1 Level AA
**User Stories:** US-2.4, US-3.4 (explicit accessibility ACs)
**PRD NFR:** "Keyboard-navigable; all interactive elements have accessible labels; sufficient color contrast"

---

### 1. Keyboard Navigation

The complete task lifecycle — add, view, complete, delete — must be operable without a mouse.

#### Tab Order

```
[Add Input]  →  [Add Button]  →  [Task 1: Checkbox]  →  [Task 1: Delete Button]
  →  [Task 2: Checkbox]  →  [Task 2: Delete Button]  →  ... (repeating per task)
```

| Element | Tab Stop | Activation Key |
|---------|----------|---------------|
| Add Input | Yes | Enter = submit task |
| Add Button | Yes | Enter / Space = submit task |
| Completion Checkbox | Yes | Space = toggle (native checkbox behaviour) |
| Delete Button | Yes | Enter / Space = delete task |
| Empty State message | No (not interactive) | — |
| Inline validation message | No (announced via `role="alert"`) | — |
| Storage banner | No (informational) | — |
| Toast | No (informational; auto-dismisses) | — |

#### Focus Management Rules

| Action | Focus Destination After |
|--------|------------------------|
| Successful task add | Add Input (re-focused) |
| Blank submission rejected | Add Input (focus stays) |
| Long submission rejected | Add Input (focus stays) |
| Checkbox toggled | Same checkbox (re-focused after re-render) |
| Task deleted (next task exists) | Next task's Delete Button |
| Task deleted (no next task, previous exists) | Previous task's Delete Button |
| Last task deleted (list now empty) | Add Input |

*(US-2.4: "After a toggle via keyboard, focus returns to the toggled checkbox")*
*(US-3.4: "After deletion, keyboard focus moves to a logical adjacent element")*

#### Focus Indicators

- All interactive elements must have a **visible focus ring** when focused via keyboard.
- The focus ring must meet WCAG 2.1 AA contrast requirements (minimum 3:1 ratio between focus indicator and adjacent background).
- *(US-3.4 AC: "The delete button has a visible focus indicator that meets WCAG 2.1 AA contrast requirements")*
- Do not use `outline: none` without providing an equivalent custom focus style.

---

### 2. ARIA Labels

| Element | `aria-label` / Role | Dynamic? | Rule |
|---------|---------------------|----------|------|
| Add Input | `aria-label="Add a new task"` or descriptive `<label>` | No | Associates label with input |
| Add Button | `aria-label="Add task"` (if no visible label text) or button text "Add" | No | Button text is sufficient if present |
| Completion Checkbox | `aria-label="Mark complete"` (pending) / `aria-label="Mark incomplete"` (completed) | **Yes — updates on every re-render** | Reflects current actionable state |
| Delete Button | `aria-label="Delete task"` | No | Describes the action |
| Inline Validation | `role="alert"` | No | Screen reader announces message immediately on insertion |
| Storage Banner | `role="alert"` | No | Announced on page load if shown |
| Toast | `role="alert"` | No | Announced immediately when injected into DOM |
| Task List Container | `<ul>` or `<ol>` with implicit list role | No | Semantic list element is sufficient |
| Empty State | `<li>` or `<p>` within list — no special ARIA needed | No | Plain text; screen reader reads naturally |

*(US-2.4 AC: "Each checkbox has aria-label='Mark complete' when pending; 'Mark incomplete' when completed")*

---

### 3. Color Contrast

| Element | Minimum Contrast Ratio | Notes |
|---------|----------------------|-------|
| Pending task text | 4.5:1 (text vs. background) | WCAG 1.4.3 AA for normal text |
| Completed task text (muted, 0.5 opacity) | 3:1 or higher after opacity applied | Use a muted color that still meets 3:1 against background, not pure opacity |
| Empty state message text | 4.5:1 | Secondary text but must still be readable |
| Inline validation error text | 4.5:1 | Error messages must be clearly readable |
| Placeholder text in Add Input | 3:1 (placeholder text WCAG relaxed threshold) | Use a sufficiently contrasted placeholder |
| Focus ring | 3:1 (focus indicator vs adjacent background) | WCAG 2.1 1.4.11 Non-text contrast |
| Delete Button icon `×` | 3:1 (icon vs. background) | Non-text contrast threshold |

**Important note on completed task opacity:**
Using `opacity: 0.5` on the entire task item reduces contrast dynamically based on the background. To reliably meet WCAG AA at 3:1, consider using a fixed muted color value (e.g. `color: #767676` on white background = 4.54:1) **instead of or in addition to** opacity reduction. Do not rely solely on `opacity: 0.5` to differentiate completed tasks — also use `text-decoration: line-through` as a second non-color indicator.

---

### 4. Screen Reader Behaviour

| User Action | Screen Reader Should Announce |
|-------------|-------------------------------|
| Page load | Page title + Add Input label (auto-focused, so announced first) |
| Empty state on load | "No tasks yet. Add one above!" (as part of list) |
| Blank submission | "Task cannot be empty." (via `role="alert"` on inline validation span) |
| Long submission | "Task must be 500 characters or fewer." (via `role="alert"`) |
| Successful task add | New task item in list; list now has N items (SR may announce count on re-render) |
| Checkbox toggle (pending → complete) | Checkbox now checked; `aria-label` = "Mark incomplete" |
| Checkbox toggle (complete → pending) | Checkbox now unchecked; `aria-label` = "Mark complete" |
| Task deleted | Item removed from list; focus moves to next element (announced by SR) |
| Storage unavailable banner | "Note: tasks won't be saved in this browser session." (via `role="alert"`) |
| Storage write failure toast | "Unable to save. Try again." (via `role="alert"`) |

---

### 5. Touch Target Sizes

| Element | Minimum Size | Reference |
|---------|-------------|-----------|
| Completion Checkbox (visual + padding) | 44 × 44 px | WCAG 2.5.5 |
| Delete Button (visual + padding) | 44 × 44 px | WCAG 2.5.5 |
| Add Button | 44 × 44 px | WCAG 2.5.5 |
| Add Input height | 44 px minimum | Consistent with button |

Use CSS padding on the checkbox and delete button to expand the clickable/tappable area beyond the visible icon size without enlarging the icon visually.

---

### 6. Non-Color Differentiation

Tasks must be distinguishable between pending and completed by means **other than color alone** (WCAG 1.4.1):

| Differentiator | Pending | Completed |
|---------------|---------|-----------|
| Text decoration | None | `text-decoration: line-through` |
| Color / opacity | Full contrast | Muted (reduced, but meeting 3:1 minimum) |
| Checkbox state | Unchecked | Checked |
| `aria-label` | "Mark complete" | "Mark incomplete" |

The strikethrough text decoration is the primary non-color differentiator. Color and opacity are secondary reinforcements.

---
