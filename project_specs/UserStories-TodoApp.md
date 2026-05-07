# User Stories: Simple To-Do App (TodoApp)

**Document Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project Acronym:** TodoApp
**Based On:** PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0, PERSONAS-TodoApp.md v1.0

---

## Personas

| Persona ID | Name | Role |
|---|---|---|
| PER-01 | **Marcus Webb** | Busy Individual / Daily List Keeper |
| PER-02 | **Priya Nair** | Lightweight Power User / Productivity-Conscious Professional |

---

## Priority Definitions

| Level | Label | Meaning |
|---|---|---|
| **P0** | Critical | Required for MVP launch — app is not shippable without this |
| **P1** | Important | Ship soon after MVP — significant user value |
| **P2** | Nice to Have | Schedule for next cycle — enhances experience |
| **P3** | Future | Backlog consideration — low urgency |

---

## Epic 0: Add Task (F0)

> Allows users to create new tasks by typing text into a persistent input field and submitting via Enter key or Add button. Empty or oversized inputs are rejected with inline feedback.

---

### US-0.1: Add a Task via Keyboard
**As a** Marcus Webb, **I want to** type a task into the input field and press Enter to add it, **so that** I can capture tasks quickly without reaching for the mouse.

**Acceptance Criteria:**
- [ ] The Add Input field is visible on page load
- [ ] The Add Input field receives focus automatically on page load
- [ ] Pressing Enter while the Add Input is focused submits the task
- [ ] The new task appears immediately at the bottom of the task list without a page reload
- [ ] The Add Input is cleared automatically after successful submission
- [ ] Focus returns to the Add Input after successful submission so a second task can be typed immediately

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Add a Task via Button Click
**As a** Marcus Webb, **I want to** click the "Add" button to submit a task, **so that** I have a clear, discoverable way to add tasks when I am not using the keyboard.

**Acceptance Criteria:**
- [ ] An "Add" button is rendered adjacent to the Add Input field
- [ ] Clicking the Add Button with a non-empty input submits the task
- [ ] The new task appears immediately in the task list
- [ ] The Add Input is cleared and refocused after successful button submission

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Reject Blank Submissions
**As a** Priya Nair, **I want to** receive an inline error message when I accidentally submit an empty input, **so that** I know the submission was rejected without any page disruption.

**Acceptance Criteria:**
- [ ] Submitting an empty or whitespace-only input does NOT create a task
- [ ] The inline validation message "Task cannot be empty." appears beneath the Add Input
- [ ] The inline validation message disappears as soon as the user begins typing
- [ ] Focus remains on the Add Input after a rejected blank submission
- [ ] The Task Array and localStorage remain unchanged after a rejected blank submission

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Reject Over-Length Submissions
**As a** Priya Nair, **I want to** see a clear message if my task text is too long, **so that** I understand why the submission failed and can correct it.

**Acceptance Criteria:**
- [ ] Submitting text exceeding 500 characters (after trimming) does NOT create a task
- [ ] The inline validation message "Task must be 500 characters or fewer." appears beneath the Add Input
- [ ] Focus remains on the Add Input after rejection
- [ ] The Task Array and localStorage remain unchanged after rejection

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.5: Strip Surrounding Whitespace from Task Text
**As a** Marcus Webb, **I want to** have leading and trailing whitespace automatically removed from my task text, **so that** accidental spaces do not create oddly formatted tasks.

**Acceptance Criteria:**
- [ ] Leading and trailing whitespace is trimmed from input before the task is stored
- [ ] Internal whitespace (e.g. multiple spaces between words) is preserved exactly as typed
- [ ] The stored `text` field in localStorage contains the trimmed value
- [ ] A submission consisting entirely of whitespace is treated as blank and rejected (see US-0.3)

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: View Task List (F1)

> Displays all tasks in a persistent, real-time list. Tasks load from localStorage on page init, reflect current completion state, and update instantly on every change. An empty state is shown when no tasks exist.

---

### US-1.1: View All Tasks on Page Load
**As a** Marcus Webb, **I want to** see my full task list immediately when I open the app, **so that** I can pick up where I left off without any extra steps.

**Acceptance Criteria:**
- [ ] On page load, the app reads the task list from localStorage key `"todoapp_tasks"`
- [ ] All previously saved tasks are rendered in the task list in creation order (oldest at top)
- [ ] Each task item displays a completion checkbox, the task text, and a delete button
- [ ] The page renders the full task list without requiring any user interaction
- [ ] Corrupted or missing localStorage data results in an empty list with no error shown to the user

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: See Visual Distinction Between Pending and Completed Tasks
**As a** Priya Nair, **I want to** instantly tell which tasks are done and which are still pending by glancing at the list, **so that** I can assess my remaining work in under 3 seconds.

**Acceptance Criteria:**
- [ ] Pending tasks are displayed in full-contrast default style
- [ ] Completed tasks display with strikethrough text and muted/reduced-opacity colour (CSS class `task--completed`)
- [ ] The visual distinction is sufficient to differentiate pending from completed without reading each task carefully
- [ ] Completed and pending tasks share the same list — there is no separate "completed" section in v1

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: See an Empty State When No Tasks Exist
**As a** Marcus Webb, **I want to** see a helpful message when my task list is empty, **so that** I know the app is working and understand I should add a task.

**Acceptance Criteria:**
- [ ] When the Task Array contains zero items, the message "No tasks yet. Add one above!" is displayed inside the Task List Container
- [ ] The empty-state message is NOT shown alongside task items — it is displayed only when the list is empty
- [ ] The empty-state message appears on first-ever page load (no tasks saved yet)
- [ ] The empty-state message appears immediately after the last task is deleted

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Task List Updates Immediately Without Page Reload
**As a** Priya Nair, **I want to** see the task list update in real time whenever I add, complete, or delete a task, **so that** the list always reflects the current state without any delay or manual refresh.

**Acceptance Criteria:**
- [ ] Adding a task appends it to the list immediately (within 100 ms) without a page reload
- [ ] Toggling a task's completion state updates its visual treatment immediately
- [ ] Deleting a task removes it from the list immediately
- [ ] No loading spinner or async delay is visible between user action and DOM update

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.5: Tasks Persist Across Page Refreshes
**As a** Marcus Webb, **I want to** find my task list intact after accidentally closing or refreshing the browser tab, **so that** I never lose tasks I added during a working session.

**Acceptance Criteria:**
- [ ] Every state change (add, toggle, delete) writes the updated Task Array to localStorage before the UI updates
- [ ] After a full page refresh, all tasks that existed before the refresh are re-displayed in the correct order with correct completion states
- [ ] If localStorage is unavailable (e.g. private browsing), a non-blocking banner reads "Note: tasks won't be saved in this browser session."
- [ ] The app remains fully functional in memory-only mode even when localStorage is unavailable

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Mark Task Complete (F2)

> Allows users to toggle any task between pending and complete states via a checkbox. The toggle is bidirectional, persisted immediately to localStorage, and reflected via a visual treatment.

---

### US-2.1: Mark a Task as Complete
**As a** Marcus Webb, **I want to** click a checkbox on a task to mark it complete, **so that** I can track my progress through the day's work with a single click.

**Acceptance Criteria:**
- [ ] Each task item renders a checkbox whose `checked` state matches the task's current `completed` field
- [ ] Clicking an unchecked checkbox sets `completed` to `true` on that task
- [ ] The task immediately displays the completed visual treatment (strikethrough + muted colour)
- [ ] The updated state is written to localStorage before the UI re-renders
- [ ] Only the targeted task's `completed` field is changed — `id`, `text`, and `createdAt` are untouched

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Un-complete a Completed Task
**As a** Marcus Webb, **I want to** click a completed task's checkbox to mark it pending again, **so that** I can correct a task I checked off by mistake or that needs revisiting.

**Acceptance Criteria:**
- [ ] Clicking a checked checkbox sets `completed` back to `false` on that task
- [ ] The task immediately reverts to the pending visual style (full contrast, no strikethrough)
- [ ] The reverted state is written to localStorage before the UI re-renders
- [ ] The toggle is fully bidirectional — the same checkbox click mechanism handles both directions

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Completion State Persists Across Sessions
**As a** Priya Nair, **I want to** find my completed tasks still marked as done after a browser restart, **so that** I can see exactly where I left off when I reopen the app the next morning.

**Acceptance Criteria:**
- [ ] After marking a task complete, a page refresh shows that task still in the completed state
- [ ] After un-completing a task, a page refresh shows that task in the pending state
- [ ] The `completed` boolean is correctly serialised and deserialised from localStorage on every reload

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Accessible Checkbox Labels Update on Toggle
**As a** Priya Nair, **I want to** navigate and toggle tasks using only the keyboard with clear screen-reader labels, **so that** the app is fully operable without a mouse and meets accessibility standards.

**Acceptance Criteria:**
- [ ] Each checkbox has `aria-label="Mark complete"` when the task is pending
- [ ] Each checkbox has `aria-label="Mark incomplete"` when the task is completed
- [ ] After toggling, the `aria-label` on the re-rendered checkbox reflects the new state
- [ ] The checkbox is focusable via keyboard Tab navigation
- [ ] After a toggle via keyboard, focus returns to the toggled checkbox so the user does not lose position

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Delete Task (F3)

> Allows users to permanently remove a task from the list via a delete button on each task item. Deletion is immediate, irreversible, and requires no confirmation dialog.

---

### US-3.1: Delete a Task from the List
**As a** Marcus Webb, **I want to** click a delete button on a task to remove it instantly, **so that** I can clear stale or cancelled tasks without any confirmation prompts slowing me down.

**Acceptance Criteria:**
- [ ] Each task item renders a delete button (labelled "×" or a trash icon) with `aria-label="Delete task"`
- [ ] Clicking the delete button immediately removes the task from both the in-memory Task Array and localStorage
- [ ] The task list re-renders without the deleted item within 100 ms of the click
- [ ] No confirmation dialog is displayed before deletion
- [ ] All other tasks remain unmodified (text, completed state, order, and IDs preserved)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: See Empty State After Deleting the Last Task
**As a** Priya Nair, **I want to** see the empty-state message after I delete my final remaining task, **so that** I know the list is clear and the app is ready for new input.

**Acceptance Criteria:**
- [ ] Deleting the last task in the list causes the empty-state message "No tasks yet. Add one above!" to appear
- [ ] The task list container shows only the empty-state message — no ghost items or blank rows remain
- [ ] The Add Input remains visible and focused so I can immediately start a fresh list

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Deletion Persists Across Sessions
**As a** Marcus Webb, **I want to** confirm that deleted tasks are gone for good after a page refresh, **so that** I am not surprised by tasks reappearing when I reopen the app.

**Acceptance Criteria:**
- [ ] After deleting a task, a full page refresh does NOT restore that task
- [ ] The localStorage `"todoapp_tasks"` array no longer contains the deleted task's entry after deletion
- [ ] Deletion is final — there is no undo mechanism in v1

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Delete Button Accessible via Keyboard
**As a** Priya Nair, **I want to** delete a task using only the keyboard, **so that** I can clean up my list at end-of-day without switching to the mouse.

**Acceptance Criteria:**
- [ ] The delete button on each task item is reachable via keyboard Tab navigation
- [ ] Pressing Enter or Space while the delete button is focused triggers deletion
- [ ] After deletion, keyboard focus moves to a logical adjacent element (next task, previous task, or the Add Input if the list is now empty)
- [ ] The delete button has a visible focus indicator that meets WCAG 2.1 AA contrast requirements

**Priority:** P0 | **Feature Ref:** F3

---

## Story Index

| Story ID | Title | Persona(s) | Priority | Feature Ref |
|---|---|---|---|---|
| US-0.1 | Add a Task via Keyboard | Marcus Webb | P0 | F0 |
| US-0.2 | Add a Task via Button Click | Marcus Webb | P0 | F0 |
| US-0.3 | Reject Blank Submissions | Priya Nair | P0 | F0 |
| US-0.4 | Reject Over-Length Submissions | Priya Nair | P0 | F0 |
| US-0.5 | Strip Surrounding Whitespace | Marcus Webb | P0 | F0 |
| US-1.1 | View All Tasks on Page Load | Marcus Webb | P0 | F1 |
| US-1.2 | See Visual Distinction Between Pending and Completed | Priya Nair | P0 | F1 |
| US-1.3 | See an Empty State When No Tasks Exist | Marcus Webb | P0 | F1 |
| US-1.4 | Task List Updates Immediately Without Page Reload | Priya Nair | P0 | F1 |
| US-1.5 | Tasks Persist Across Page Refreshes | Marcus Webb | P0 | F1 |
| US-2.1 | Mark a Task as Complete | Marcus Webb | P0 | F2 |
| US-2.2 | Un-complete a Completed Task | Marcus Webb | P0 | F2 |
| US-2.3 | Completion State Persists Across Sessions | Priya Nair | P0 | F2 |
| US-2.4 | Accessible Checkbox Labels Update on Toggle | Priya Nair | P0 | F2 |
| US-3.1 | Delete a Task from the List | Marcus Webb | P0 | F3 |
| US-3.2 | See Empty State After Deleting the Last Task | Priya Nair | P0 | F3 |
| US-3.3 | Deletion Persists Across Sessions | Marcus Webb | P0 | F3 |
| US-3.4 | Delete Button Accessible via Keyboard | Priya Nair | P0 | F3 |

**Total Stories:** 18 across 4 epics

---

## Priority Breakdown

| Priority | Story Count | Epics Covered |
|---|---|---|
| P0 — Critical | 18 | F0, F1, F2, F3 |
| P1 — Important | 0 | — |
| P2 — Nice to Have | 0 | — |
| P3 — Future | 0 | — |

> All 18 stories are P0. This reflects the PRD's explicit design decision: TodoApp v1 ships with exactly F0–F3, all of which are classified as Critical MVP. No non-essential features are included in this scope.

---

*Document generated: 2026-05-07 | Based on: PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0, PERSONAS-TodoApp.md v1.0*
