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
