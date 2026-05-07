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
