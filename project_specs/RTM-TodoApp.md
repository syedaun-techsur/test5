# Requirements Traceability Matrix: Simple To-Do App (TodoApp)

**Document Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project Acronym:** TodoApp
**Based On:** PRD-TodoApp.md v1.0 | FRD-TodoApp.md v1.0 | TechArch-TodoApp.md v1.0 | UserStories-TodoApp.md v1.0

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides complete bidirectional traceability between all TodoApp specification documents. It ensures every business requirement defined in the Product Requirements Document is decomposed into functional specifications, mapped to a technical architecture decision or component, and covered by at least one user story with acceptance criteria.

TodoApp v1 is a client-only, single-user web application delivering a core task management loop: add, view, complete, and delete tasks. The entire scope is captured in four PRD features (F0–F3), all rated P0 (Critical MVP). Every requirement traces upward to a business goal (frictionless task tracking, zero-login simplicity) and downward to a concrete technical specification, module, and user story. This document serves as the authoritative audit trail for any reviewer, developer, or tester to confirm that nothing has been added, dropped, or implemented without a corresponding requirement.

Traceability is maintained across five levels:

1. **PRD Features (F0–F3)** — product-level capabilities with priority and acceptance criteria
2. **FRD Requirements (F00–F03, Y0–Y3)** — precise behavioural specifications per feature and cross-cutting concern
3. **TechArch Specifications** — architectural decisions, module responsibilities, data model, security rules, and technology choices that realise each FRD requirement
4. **User Stories (US-x.x)** — user-facing acceptance criteria decomposed from PRD features, linked to personas
5. **Test Cases (TEST-xxx)** — derived test coverage mapped to each user story

---

## 2. Requirements Summary

### Functional Requirements by Feature

- **F0 — Add Task (PRD F0 / FRD F00):** User can type and submit a task via Enter key or Add button; blank and over-length inputs are rejected with inline feedback; input clears and refocuses after each successful add; whitespace is trimmed before storage.
- **F1 — View Task List (PRD F1 / FRD F01):** Tasks load from localStorage on page init; list renders in creation order; completed tasks are visually distinguished; empty state shown when no tasks exist; list updates synchronously on every mutation.
- **F2 — Mark Task Complete (PRD F2 / FRD F02):** Checkbox on each task toggles `completed` state bidirectionally; visual treatment (strikethrough + muted colour) applied immediately; state persisted to localStorage before re-render; `aria-label` updates on toggle.
- **F3 — Delete Task (PRD F3 / FRD F03):** Delete button on each task permanently removes task from Task Array and localStorage with no confirmation dialog; list re-renders immediately; empty state shown if last task deleted.

### Cross-Cutting Requirements

- **Y0 — Data Schema:** Single `Task` entity with four immutable/mutable fields (`id`, `text`, `completed`, `createdAt`) stored as JSON array under localStorage key `"todoapp_tasks"`.
- **Y1 — Client API:** Four synchronous JS modules (`app.js`, `tasks.js`, `storage.js`, `render.js`) with fully specified public function signatures.
- **Y2 — Error Catalog:** Eight distinct error codes across validation, storage, and system layers with defined user-visible behaviour and recovery paths.
- **Y3 — Integrations:** Five browser APIs (`localStorage`, `crypto.randomUUID`, `JSON`, `DOMContentLoaded`, event delegation); zero external service dependencies.

### Non-Functional Requirements Summary

- **Performance:** All user interactions complete within 100 ms end-to-end.
- **Reliability:** localStorage written before DOM update (write-then-render) on every state change.
- **Accessibility:** WCAG 2.1 AA — keyboard-navigable, `aria-label` on all interactive controls.
- **Compatibility:** Chrome, Firefox, Safari, Edge (current stable).
- **Bundle Size:** Total page weight < 100 KB uncompressed (target: < 30 KB).
- **Security:** `textContent` only for user data (XSS prevention); input validation in `tasks.js`; localStorage data integrity validated on load.
- **Simplicity:** Zero runtime dependencies; no backend; no authentication.

### Story Coverage Summary

- **Total User Stories:** 18 across 4 epics, all P0 Critical
- **Total Test Cases (derived):** 59 across all features
- **Overall Traceability Coverage:** 100% — every PRD feature maps to ≥1 FRD requirement, ≥1 TechArch spec, and ≥1 User Story

---

## 3. Traceability Matrix

### 3.1 PRD Feature → FRD Requirement → TechArch Spec → User Story

| PRD Feature | FRD Requirement | TechArch Specification | User Story |
|---|---|---|---|
| **F0: Add Task** | F00: Add Task — always-visible input, Enter/button submit | `app.js` event wiring: `keydown`→Enter, `#add-btn` click | US-0.1: Add via Keyboard |
| **F0: Add Task** | F00: Add Task — button submission path | `app.js` event wiring: `#add-btn` click → `addTask()` | US-0.2: Add via Button Click |
| **F0: Add Task** | F00: Add Task — blank/whitespace rejection + inline message | `tasks.js` `addTask()` validation (EMPTY_TEXT); `render.js` `showValidationMessage()` | US-0.3: Reject Blank Submissions |
| **F0: Add Task** | F00: Add Task — 500-char limit enforcement | `tasks.js` `addTask()` validation (TEXT_TOO_LONG); `render.js` `showValidationMessage()` | US-0.4: Reject Over-Length Submissions |
| **F0: Add Task** | F00: Add Task — whitespace trimming before storage | `tasks.js` `addTask()` — trims text before validation and Task construction | US-0.5: Strip Surrounding Whitespace |
| **F1: View Task List** | F01: View Task List — load and render from localStorage on init | `storage.js` `readTasks()`; `tasks.js` `initTasks()`; `render.js` `renderTaskList()` | US-1.1: View All Tasks on Page Load |
| **F1: View Task List** | F01: View Task List — completed vs. pending visual distinction | `render.js` `renderTaskList()` applies `task--completed` CSS class; `style.css` defines `text-decoration: line-through; opacity: 0.5` | US-1.2: Visual Distinction Pending/Completed |
| **F1: View Task List** | F01: View Task List — empty state message | `render.js` `renderTaskList()` renders `<li class="task-list__empty">No tasks yet. Add one above!</li>` when array is empty | US-1.3: Empty State When No Tasks Exist |
| **F1: View Task List** | F01: View Task List — synchronous real-time update | Write-then-render pattern: `writeTasks()` → `renderTaskList()` called synchronously in same event handler | US-1.4: List Updates Immediately |
| **F1: View Task List** | F01: View Task List — persistence across page refreshes; Y3: `window.localStorage` integration | `storage.js` `writeTasks()` called on every state change; `readTasks()` on page load; STORAGE_UNAVAILABLE banner | US-1.5: Tasks Persist Across Refreshes |
| **F2: Mark Task Complete** | F02: Mark Task Complete — checkbox toggle (pending → complete) | `tasks.js` `toggleTask()` flips `completed`; `app.js` event delegation on `#task-list` (`.task-item__checkbox`) | US-2.1: Mark Task as Complete |
| **F2: Mark Task Complete** | F02: Mark Task Complete — bidirectional toggle (complete → pending) | `tasks.js` `toggleTask()` — `false → true` or `true → false`; `render.js` `renderTaskList()` re-renders correct style | US-2.2: Un-complete a Task |
| **F2: Mark Task Complete** | F02: Mark Task Complete — completion state persists to localStorage | `tasks.js` `toggleTask()` calls `writeTasks()` before `renderTaskList()`; Y0 schema: `completed` boolean field | US-2.3: Completion State Persists |
| **F2: Mark Task Complete** | F02: Mark Task Complete — accessible checkbox labels update on toggle; FRD Global: WCAG 2.1 AA | `render.js` `renderTaskList()` sets `aria-label="Mark complete"` or `"Mark incomplete"` per `task.completed`; keyboard focus restored after re-render | US-2.4: Accessible Labels Update on Toggle |
| **F3: Delete Task** | F03: Delete Task — immediate deletion, no confirmation | `tasks.js` `deleteTask()` filters Task Array; `app.js` event delegation on `#task-list` (`.task-item__delete`); no dialog rendered | US-3.1: Delete Task from List |
| **F3: Delete Task** | F03: Delete Task — empty state after last task deleted | `tasks.js` `deleteTask()` → `renderTaskList([])` → `render.js` empty-state branch | US-3.2: Empty State After Last Task Deleted |
| **F3: Delete Task** | F03: Delete Task — deletion persists to localStorage | `tasks.js` `deleteTask()` calls `writeTasks(filtered)` before `renderTaskList()`; deleted task ID absent from `"todoapp_tasks"` | US-3.3: Deletion Persists Across Sessions |
| **F3: Delete Task** | F03: Delete Task — delete button keyboard-accessible; TechArch §5 security; FRD Global: WCAG 2.1 AA | `render.js` `renderTaskList()` renders `<button aria-label="Delete task">`; keyboard Tab reachable; WCAG focus indicator in `style.css` | US-3.4: Delete Button Accessible via Keyboard |

---

### 3.2 TechArch Component → FRD Features Served

| TechArch Component / Decision | FRD Feature(s) Served | Key Specification |
|---|---|---|
| `app.js` — Entry Point & Event Wiring | F00, F01, F02, F03 | Fires on `DOMContentLoaded`; wires all event listeners; event delegation on `#task-list` |
| `tasks.js` — Business Logic & State | F00, F01, F02, F03 | Owns `state.tasks`; implements `initTasks`, `addTask`, `toggleTask`, `deleteTask`; enforces write-then-render |
| `storage.js` — Persistence Abstraction | F00, F01, F02, F03 | Sole `localStorage` accessor; `readTasks`, `writeTasks`, `isStorageAvailable`; throws `StorageWriteError` |
| `render.js` — DOM Rendering | F00, F01, F02, F03 | Stateless; `renderTaskList`, `showValidationMessage`, `clearValidationMessage`, `showToast` |
| `index.html` — Application Shell | F00, F01 | Static DOM skeleton: `#add-input`, `#add-btn`, `#task-list` |
| `style.css` — Visual Layer | F01, F02 | `.task--completed` (strikethrough, opacity 0.5); `.task-list__empty`; touch targets ≥ 44 px |
| Write-then-render pattern | F00, F01, F02, F03 | `writeTasks()` always called before `renderTaskList()` — storage and UI cannot diverge |
| Event delegation on `#task-list` | F02, F03 | Single listener dispatches toggle/delete by element class; no per-item listener leak on re-render |
| `crypto.randomUUID()` + Math.random fallback | F00 | UUID v4 task IDs; fallback for non-HTTPS contexts |
| `textContent` / no `innerHTML` for user data | F00, F01 | XSS prevention; all task text set via `textContent` or `createTextNode()` |
| localStorage data validation on load | F01 | `readTasks()` drops entries missing required fields; silent recovery to empty state |
| Content Security Policy (CSP) | Cross-cutting security | `default-src 'self'`; blocks all external scripts, inline scripts, external connections, framing |
| Static hosting (GitHub Pages / Netlify / Vercel) | Cross-cutting deployment | CDN-served HTTPS; free tier; zero infrastructure maintenance |

---

### 3.3 FRD Error Catalog → Traceability

| Error Code | FRD Section | PRD Feature | TechArch Layer | User Story Impact |
|---|---|---|---|---|
| `EMPTY_TEXT` | Y2 Validation Errors | F0 | `tasks.js` validation + `render.js` `showValidationMessage()` | US-0.3 |
| `TEXT_TOO_LONG` | Y2 Validation Errors | F0 | `tasks.js` validation + `render.js` `showValidationMessage()` | US-0.4 |
| `STORAGE_UNAVAILABLE` | Y2 Storage Errors | F0, F1, F2, F3 | `storage.js` `isStorageAvailable()`; `app.js` banner | US-1.5 |
| `STORAGE_READ_FAIL` | Y2 Storage Errors | F1 | `storage.js` `readTasks()` silent catch; empty state | US-1.1 |
| `STORAGE_PARSE_ERROR` | Y2 Storage Errors | F1 | `storage.js` `readTasks()` `JSON.parse` catch; empty state | US-1.1 |
| `STORAGE_WRITE_FAIL` | Y2 Storage Errors | F0, F2, F3 | `storage.js` `writeTasks()` throws `StorageWriteError`; `render.js` `showToast()` | US-0.1, US-2.1, US-3.1 |
| `TASK_NOT_FOUND` | Y2 System Errors | F2, F3 | `tasks.js` `toggleTask`/`deleteTask` defensive no-op; console error | US-2.1, US-3.1 |
| `UUID_GENERATION_FALLBACK` | Y2 System Errors | F0 | `tasks.js` `addTask()` fallback to `Math.random`-based UUID | US-0.1 |

---

## 4. Requirements Detail

### F0: Add Task

**PRD Feature ID:** F0 | **Priority:** P0 (Critical MVP) | **FRD Section:** F00

**Functional Requirements:**
- The Add Input field (`<input id="add-input">`) MUST be rendered and auto-focused on every page load
- When the browser tab regains visibility (`visibilitychange` event), the Add Input MUST receive focus automatically
- Task submission MUST be triggered by pressing Enter on the Add Input OR clicking the Add Button (`<button id="add-btn">`)
- Raw input value MUST be trimmed of leading/trailing whitespace before any validation or storage
- A trimmed value of length 0 (blank or whitespace-only) MUST be rejected; inline message `"Task cannot be empty."` displayed beneath the Add Input
- A trimmed value exceeding 500 characters MUST be rejected; inline message `"Task must be 500 characters or fewer."` displayed
- Inline validation message MUST clear as soon as the user begins typing again (`input` event on Add Input)
- On successful validation, a UUID v4 task ID MUST be generated via `crypto.randomUUID()` (fallback: `Math.random`-based generator)
- New Task object MUST be: `{ id: UUID, text: trimmedValue, completed: false, createdAt: ISO8601-UTC }`
- `writeTasks()` MUST be called before `renderTaskList()` (write-then-render invariant)
- After successful add: Add Input value cleared; focus returned to Add Input; new task rendered at bottom of list

**Linked FRD Specifications:** F00 (full), Y0 §Task Object, Y1 §`addTask()`, Y2 §EMPTY_TEXT, §TEXT_TOO_LONG, §STORAGE_WRITE_FAIL, §UUID_GENERATION_FALLBACK, Y3 §`localStorage`, §`crypto.randomUUID()`

**Linked TechArch Specs:** `tasks.js` `addTask()`, `storage.js` `writeTasks()`, `render.js` `showValidationMessage()` / `clearValidationMessage()` / `renderTaskList()`, `app.js` keydown/click event wiring

**Linked User Stories:** US-0.1, US-0.2, US-0.3, US-0.4, US-0.5

---

### F1: View Task List

**PRD Feature ID:** F1 | **Priority:** P0 (Critical MVP) | **FRD Section:** F01

**Functional Requirements:**
- On `DOMContentLoaded`, `initTasks()` MUST call `readTasks()` and then `renderTaskList(state.tasks)`
- `readTasks()` MUST return `[]` on any error (missing key, parse failure, storage unavailable) — silent recovery
- Tasks MUST be rendered in insertion order: index 0 (oldest) at top, newest at bottom
- Each Task Item MUST contain: completion checkbox, task text `<span>`, delete button
- A task with `completed === true` MUST have CSS class `task--completed` applied (strikethrough + opacity 0.5)
- A task with `completed === false` MUST display in full-contrast default style
- When Task Array contains zero items, `renderTaskList` MUST render `<li class="task-list__empty">No tasks yet. Add one above!</li>` and nothing else
- Empty-state element MUST NOT appear alongside any task items
- `renderTaskList()` MUST be called synchronously within the same event handler that causes any state change (add / toggle / delete) — no async delay permitted
- If localStorage is unavailable, a non-blocking banner `"Note: tasks won't be saved in this browser session."` MUST be shown

**Linked FRD Specifications:** F01 (full), Y0 §Storage Key / Task Object, Y1 §`loadTasks()` / `renderTaskList()` / `initTasks()`, Y2 §STORAGE_READ_FAIL, §STORAGE_PARSE_ERROR, §STORAGE_UNAVAILABLE, Y3 §`localStorage`

**Linked TechArch Specs:** `storage.js` `readTasks()` / `isStorageAvailable()`, `tasks.js` `initTasks()`, `render.js` `renderTaskList()`, `style.css` `.task--completed` / `.task-list__empty`, write-then-render pattern

**Linked User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5

---

### F2: Mark Task Complete

**PRD Feature ID:** F2 | **Priority:** P0 (Critical MVP) | **FRD Section:** F02

**Functional Requirements:**
- Each Task Item MUST render `<input type="checkbox">` whose `checked` attribute exactly mirrors `task.completed`
- A click/tap on the checkbox MUST trigger `toggleTask(taskId)` via event delegation on `#task-list`
- `toggleTask()` MUST identify the target task via the `data-task-id` attribute on the Task Item element
- `task.completed` MUST be flipped: `false → true` or `true → false` (bidirectional)
- Only `task.completed` is modified — `task.id`, `task.text`, and `task.createdAt` MUST remain unchanged
- `writeTasks()` MUST be called before `renderTaskList()` (write-then-render)
- On `StorageWriteError`: the completed flip MUST be reverted in memory; `renderTaskList()` called to restore UI; toast `"Unable to save. Try again."` shown
- `aria-label` on each checkbox MUST be `"Mark complete"` when `completed === false` and `"Mark incomplete"` when `completed === true`
- After re-render, keyboard focus MUST be returned to the toggled checkbox
- If `taskId` is not found in `state.tasks`, the operation is a no-op; console error logged

**Linked FRD Specifications:** F02 (full), Y0 §Task Object (`completed` field), Y1 §`toggleTask()`, Y2 §STORAGE_WRITE_FAIL, §TASK_NOT_FOUND, Y3 §event delegation

**Linked TechArch Specs:** `tasks.js` `toggleTask()`, `storage.js` `writeTasks()`, `render.js` `renderTaskList()` (aria-label, task--completed class), `app.js` event delegation dispatch, write-then-render pattern, WCAG 2.1 AA accessibility constraint

**Linked User Stories:** US-2.1, US-2.2, US-2.3, US-2.4

---

### F3: Delete Task

**PRD Feature ID:** F3 | **Priority:** P0 (Critical MVP) | **FRD Section:** F03

**Functional Requirements:**
- Each Task Item MUST render a delete button with `aria-label="Delete task"` and visible "×" or trash icon
- Clicking the delete button MUST trigger `deleteTask(taskId)` via event delegation on `#task-list`
- `deleteTask()` MUST identify the target task via the `data-task-id` attribute on the Task Item element
- The task MUST be filtered out of `state.tasks` — all other tasks retained in original order, unmodified
- `writeTasks(filtered)` MUST be called before `renderTaskList()` (write-then-render)
- After deletion, the Task Array MUST NOT contain any task with the deleted `taskId`
- No confirmation dialog is displayed — deletion is immediate and final
- There is no undo mechanism in v1
- On `StorageWriteError`: deletion MUST be reverted; UI re-rendered to show task still present; toast shown
- If the Task Array is now empty after deletion, `renderTaskList([])` renders the empty-state message
- If `taskId` is not found in `state.tasks`, the operation is a no-op; console error logged
- Delete button MUST be reachable via keyboard Tab navigation; activatable via Enter or Space; WCAG 2.1 AA focus indicator required

**Linked FRD Specifications:** F03 (full), Y0 §Task Object, Y1 §`deleteTask()`, Y2 §STORAGE_WRITE_FAIL, §TASK_NOT_FOUND, Y3 §event delegation

**Linked TechArch Specs:** `tasks.js` `deleteTask()`, `storage.js` `writeTasks()`, `render.js` `renderTaskList()` (empty-state branch) / `showToast()`, `app.js` event delegation dispatch, `style.css` WCAG focus indicator, write-then-render pattern

**Linked User Stories:** US-3.1, US-3.2, US-3.3, US-3.4

---

## 5. Test Case Coverage

### 5.1 Test Case Registry

| Test ID | Test Description | User Story | PRD Feature | FRD Requirement | Priority |
|---|---|---|---|---|---|
| TEST-001 | Add Input is visible and auto-focused on page load | US-0.1 | F0 | F00: sub-feature — auto-focus on load | P0 |
| TEST-002 | Add Input receives focus when browser tab becomes visible | US-0.1 | F0 | F00: sub-feature — tab-switch auto-focus | P0 |
| TEST-003 | Pressing Enter on a non-empty Add Input creates a task | US-0.1 | F0 | F00: process step 3 (Enter key) | P0 |
| TEST-004 | New task appears at the bottom of the list without page reload | US-0.1 | F0 | F00: process step 6e | P0 |
| TEST-005 | Add Input is cleared after successful Enter-key submission | US-0.1 | F0 | F00: process step 6f | P0 |
| TEST-006 | Focus returns to Add Input after successful Enter-key submission | US-0.1 | F0 | F00: process step 6h | P0 |
| TEST-007 | Clicking the Add button with non-empty input creates a task | US-0.2 | F0 | F00: process step 3 (button click) | P0 |
| TEST-008 | Add Input cleared and refocused after button-click submission | US-0.2 | F0 | F00: process steps 6f, 6h | P0 |
| TEST-009 | Submitting empty input shows "Task cannot be empty." | US-0.3 | F0 | F00: error state EMPTY_TEXT | P0 |
| TEST-010 | No task created when empty input submitted | US-0.3 | F0 | F00: process step 5b | P0 |
| TEST-011 | Validation message clears when user begins typing | US-0.3 | F0 | F00: sub-feature — inline validation clearance | P0 |
| TEST-012 | Focus stays on Add Input after blank submission | US-0.3 | F0 | F00: process step 5b | P0 |
| TEST-013 | Task Array and localStorage unchanged after blank submission | US-0.3 | F0 | F00: process step 5b | P0 |
| TEST-014 | Submitting >500 char input shows "Task must be 500 characters or fewer." | US-0.4 | F0 | F00: error state TEXT_TOO_LONG | P0 |
| TEST-015 | No task created when over-length input submitted | US-0.4 | F0 | F00: validation rule | P0 |
| TEST-016 | Focus stays on Add Input after over-length submission | US-0.4 | F0 | F00: validation rule | P0 |
| TEST-017 | Leading/trailing whitespace trimmed before task is stored | US-0.5 | F0 | F00: validation rule — trim | P0 |
| TEST-018 | Internal whitespace preserved in stored task text | US-0.5 | F0 | F00: validation rule — internal whitespace | P0 |
| TEST-019 | Whitespace-only submission rejected as blank | US-0.5 | F0 | F00: process step 4–5 | P0 |
| TEST-020 | Tasks loaded from localStorage and rendered on page load | US-1.1 | F1 | F01: process — on page load step 1–4 | P0 |
| TEST-021 | Tasks rendered in creation order (oldest at top) | US-1.1 | F1 | F01: validation rule — insertion order | P0 |
| TEST-022 | Each task item shows checkbox, text, and delete button | US-1.1 | F1 | F01: process step 10b–e | P0 |
| TEST-023 | Corrupted localStorage renders empty list with no user error | US-1.1 | F1 | F01: error state STORAGE_PARSE_ERROR | P0 |
| TEST-024 | Pending tasks displayed in full-contrast default style | US-1.2 | F1 | F01: process step 10 (pending path) | P0 |
| TEST-025 | Completed tasks display strikethrough and muted colour (task--completed class) | US-1.2 | F1 | F01: process step 10d | P0 |
| TEST-026 | Empty state message "No tasks yet. Add one above!" shown when Task Array is empty | US-1.3 | F1 | F01: process step 9 | P0 |
| TEST-027 | Empty state message not shown alongside task items | US-1.3 | F1 | F01: validation rule — empty-state exclusivity | P0 |
| TEST-028 | Empty state shown on first-ever page load | US-1.3 | F1 | F01: error state — empty array on load | P0 |
| TEST-029 | Empty state appears immediately after last task deleted | US-1.3 | F1 | F01: process — on state change step 5–7 | P0 |
| TEST-030 | Adding a task appends it within 100 ms (no page reload) | US-1.4 | F1 | F01: real-time update; FRD Global: 100 ms budget | P0 |
| TEST-031 | Toggling a task updates visual treatment immediately | US-1.4 | F1 | F01: on state change step 5–7 | P0 |
| TEST-032 | Deleting a task removes it from the list immediately | US-1.4 | F1 | F01: on state change step 5–7 | P0 |
| TEST-033 | Tasks survive a full page refresh with correct states | US-1.5 | F1 | F01: process — on page load; Y0 §Constraints | P0 |
| TEST-034 | Storage-unavailable banner shown in private/incognito mode | US-1.5 | F1 | Y2 §STORAGE_UNAVAILABLE | P0 |
| TEST-035 | App fully functional in memory-only mode (localStorage unavailable) | US-1.5 | F1 | Y2 §STORAGE_UNAVAILABLE | P0 |
| TEST-036 | Clicking unchecked checkbox marks task completed | US-2.1 | F2 | F02: process step 1–4 | P0 |
| TEST-037 | Completed visual treatment applied immediately on toggle | US-2.1 | F2 | F02: process step 6–7 | P0 |
| TEST-038 | localStorage updated before UI re-renders on toggle | US-2.1 | F2 | F02: validation rule — write-then-render | P0 |
| TEST-039 | Only `completed` field changed — other fields untouched | US-2.1 | F2 | F02: validation rule — field immutability | P0 |
| TEST-040 | Clicking checked checkbox reverts task to pending | US-2.2 | F2 | F02: process step 4 (bidirectional flip) | P0 |
| TEST-041 | Pending visual style restored immediately on un-complete | US-2.2 | F2 | F02: process step 6–7 | P0 |
| TEST-042 | Completion state persists after page refresh | US-2.3 | F2 | F02: validation rule — write-then-render; Y0 §completed field | P0 |
| TEST-043 | Un-completed state persists after page refresh | US-2.3 | F2 | F02: validation rule — write-then-render; Y0 §completed field | P0 |
| TEST-044 | Checkbox has aria-label="Mark complete" when task is pending | US-2.4 | F2 | F02: validation rule — aria-label | P0 |
| TEST-045 | Checkbox has aria-label="Mark incomplete" when task is complete | US-2.4 | F2 | F02: validation rule — aria-label | P0 |
| TEST-046 | Keyboard focus returns to toggled checkbox after re-render | US-2.4 | F2 | F02: process step 8 | P0 |
| TEST-047 | Delete button renders on each task with aria-label="Delete task" | US-3.1 | F3 | F03: sub-feature — delete button always visible | P0 |
| TEST-048 | Clicking delete button removes task from list immediately | US-3.1 | F3 | F03: process step 1–6 | P0 |
| TEST-049 | Task removed from localStorage immediately on deletion | US-3.1 | F3 | F03: process step 4 | P0 |
| TEST-050 | No confirmation dialog shown before deletion | US-3.1 | F3 | F03: sub-feature — no confirmation | P0 |
| TEST-051 | All other tasks unmodified after a single deletion | US-3.1 | F3 | F03: validation rule — sibling tasks untouched | P0 |
| TEST-052 | Deleting last task shows empty state immediately | US-3.2 | F3 | F03: process step 7 | P0 |
| TEST-053 | No ghost items or blank rows after last task deleted | US-3.2 | F3 | F03: process step 5–7 | P0 |
| TEST-054 | Add Input visible and focused after last task deleted | US-3.2 | F3 | F03: sub-feature; F00: auto-focus | P0 |
| TEST-055 | Deleted task absent after full page refresh | US-3.3 | F3 | F03: validation rule — post-deletion array | P0 |
| TEST-056 | localStorage array does not contain deleted task ID after deletion | US-3.3 | F3 | F03: validation rule — array exclusion | P0 |
| TEST-057 | Delete button reachable via keyboard Tab navigation | US-3.4 | F3 | F03: FRD Global WCAG 2.1 AA | P0 |
| TEST-058 | Enter or Space on focused delete button triggers deletion | US-3.4 | F3 | F03: FRD Global WCAG 2.1 AA | P0 |
| TEST-059 | Focus moves to logical adjacent element after keyboard deletion | US-3.4 | F3 | F03: FRD Global WCAG 2.1 AA | P0 |

---

### 5.2 Test Coverage Matrix

| Feature | User Stories | Test Cases | Coverage |
|---|---|---|---|
| F0: Add Task | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5 | TEST-001 – TEST-019 (19 tests) | 100% |
| F1: View Task List | US-1.1, US-1.2, US-1.3, US-1.4, US-1.5 | TEST-020 – TEST-035 (16 tests) | 100% |
| F2: Mark Task Complete | US-2.1, US-2.2, US-2.3, US-2.4 | TEST-036 – TEST-046 (11 tests) | 100% |
| F3: Delete Task | US-3.1, US-3.2, US-3.3, US-3.4 | TEST-047 – TEST-059 (13 tests) | 100% |
| **Total** | **18 user stories** | **59 test cases** | **100%** |

---

### 5.3 Error Scenario Test Coverage

| Error Code | Test Case(s) |
|---|---|
| `EMPTY_TEXT` | TEST-009, TEST-010, TEST-011, TEST-012, TEST-013 |
| `TEXT_TOO_LONG` | TEST-014, TEST-015, TEST-016 |
| `STORAGE_UNAVAILABLE` | TEST-034, TEST-035 |
| `STORAGE_READ_FAIL` | TEST-023 |
| `STORAGE_PARSE_ERROR` | TEST-023 |
| `STORAGE_WRITE_FAIL` | TEST-038 (F2), TEST-049 (F3); implied by TEST-003 (F0 storage path) |
| `TASK_NOT_FOUND` | Covered by defensive implementation; no direct user-visible test |
| `UUID_GENERATION_FALLBACK` | Covered by unit test of `addTask()` with `crypto` mocked as unavailable |

---

## 6. Change Management

### 6.1 Change Log

| Change ID | Date | Version | Author | Description | Affected Sections | Status |
|---|---|---|---|---|---|---|
| CHG-001 | 2026-05-07 | 1.0 | — | Initial RTM created from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | All | Approved |

---

### 6.2 Change Control Process

Any modification to a requirement in PRD, FRD, TechArch, or UserStories documents that affects a traced item in this RTM MUST:

1. Be logged as a new `CHG-xxx` entry in the Change Log above
2. Update all affected rows in Section 3 (Traceability Matrix)
3. Update all affected items in Section 4 (Requirements Detail)
4. Add, remove, or modify test cases in Section 5 accordingly
5. Increment the RTM document version
6. Obtain re-approval from all stakeholders listed in Section 7

---

### 6.3 Pending Decisions & Open Items

| Item ID | Description | Owner | Target Resolution |
|---|---|---|---|
| OD-001 | Choice between plain HTML/JS and Vite build tool — TechArch §6 defers this decision | Development Lead | Before implementation kickoff |
| OD-002 | Hosting platform selection (GitHub Pages vs. Netlify vs. Vercel) — affects CSP header delivery | Development Lead | Before first deploy |
| OD-003 | Delete button visibility: always visible vs. hover-only — TechArch/FRD F03 leaves as implementation choice | UX / Development Lead | Before UI implementation |

---

## 7. Approval

### 7.1 Document Sign-Off

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | _______________ | __________ | Pending |
| Technical Lead | — | _______________ | __________ | Pending |
| QA Lead | — | _______________ | __________ | Pending |
| UX Lead | — | _______________ | __________ | Pending |

---

### 7.2 RTM Validation Checklist

| Validation Item | Status |
|---|---|
| All PRD features (F0–F3) have at least one FRD requirement traced | ✅ Complete |
| All PRD features have at least one TechArch component traced | ✅ Complete |
| All PRD features have at least one User Story traced | ✅ Complete |
| All 18 User Stories are mapped to a PRD feature | ✅ Complete |
| All 18 User Stories have at least one test case | ✅ Complete |
| All 8 FRD error codes are traced to a user story or test | ✅ Complete |
| All TechArch modules traced to at least one FRD feature | ✅ Complete |
| All FRD cross-cutting specs (Y0–Y3) referenced in matrix | ✅ Complete |
| Non-functional requirements referenced in test cases or architecture | ✅ Complete |
| Change log initialised | ✅ Complete |
| Open items / pending decisions captured | ✅ Complete |
| Approval section present | ✅ Complete |

---

### 7.3 Traceability Coverage Summary

| Spec Level | Total Items | Items Traced | Coverage |
|---|---|---|---|
| PRD Features | 4 (F0–F3) | 4 | 100% |
| FRD Feature Sections | 4 (F00–F03) | 4 | 100% |
| FRD Cross-Cutting Sections | 4 (Y0–Y3) | 4 | 100% |
| FRD Error Codes | 8 | 8 | 100% |
| TechArch Components | 6 modules + 7 decisions | All | 100% |
| User Stories | 18 | 18 | 100% |
| Test Cases | 59 | 59 | 100% |

---

*Document generated: 2026-05-07 | Based on: PRD-TodoApp.md v1.0 · FRD-TodoApp.md v1.0 · TechArch-TodoApp.md v1.0 · UserStories-TodoApp.md v1.0 · .planning/PROJECT.md*
