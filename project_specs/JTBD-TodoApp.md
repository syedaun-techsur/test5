# JTBD: Simple To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | Simple To-Do App (TodoApp) |
| **Document Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related Personas** | PERSONAS-TodoApp.md (PER-01, PER-02) |
| **Related PRD** | PRD-TodoApp.md |
| **Author** | Pivota Spec JTBD Generator |

---

## JTBD Summary Table

| JTBD ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Marcus Webb | Get into a working task list instantly, without setup barriers | P0 |
| JTBD-01.2 | PER-01 Marcus Webb | Record tasks the moment they surface, without switching contexts | P0 |
| JTBD-01.3 | PER-01 Marcus Webb | Keep the list accurate by clearing finished and cancelled work | P0 |
| JTBD-02.1 | PER-02 Priya Nair | Maintain a reliable personal list that survives the chaos of a meeting-heavy day | P0 |
| JTBD-02.2 | PER-02 Priya Nair | Capture a task mid-meeting without losing focus or workflow | P0 |
| JTBD-02.3 | PER-02 Priya Nair | Perform a fast end-of-day reset so tomorrow starts clean | P0 |

---

## PER-01: Marcus Webb — Busy Individual / Daily List Keeper

### JTBD-01.1: Frictionless First Use

**Job Statement:**
When I open a new browser tab to start my workday, I want to immediately see a ready-to-use task list without any sign-up, walkthrough, or configuration, so I can capture what I need to do today before the impulse fades.

**Current Alternatives:**
- Opens a fresh plain-text file or sticky note app — no persistence, no structure
- Returns to Notion or Todoist only to abandon them after spending time navigating setup wizards
- Relies on memory or calendar apps pressed into service as to-do lists

**Hiring Criteria:**
- App is fully usable within 10 seconds of first visit — no login, no modal, no onboarding tour
- The input field is focused and ready to receive text immediately on load
- The interface is self-explanatory; no tooltips or instructions are required to begin

**Success Measure:** A first-time user completes the full core loop (add → view → complete → delete) within 60 seconds of opening the app with zero instructions provided.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-01.2: Rapid Task Capture Throughout the Day

**Job Statement:**
When a new task surfaces mid-work — a client request, an errand I just remembered, a follow-up I owe — I want to add it to my list in one keystroke without leaving what I am doing, so I can stay focused on the current task instead of holding the new one in my head.

**Current Alternatives:**
- Types a quick note into a Slack DM to himself — often lost or forgotten
- Writes on a physical notepad nearby — not always at his desk; gets lost
- Interrupts current work to open a different app and add it there — breaks focus

**Hiring Criteria:**
- Task input field is always visible without scrolling or navigating to another view
- Task is submitted and appears in the list by pressing Enter — no mouse required
- Input field clears automatically after submission and returns focus so the next task can be typed immediately
- Blank submissions are silently ignored so accidental Enter presses cause no friction

**Success Measure:** From the moment a thought surfaces to the moment the task is visible in the list takes under 5 seconds, with keyboard-only interaction from start to finish.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-01.3: Accurate List Maintenance Without Overhead

**Job Statement:**
When I finish a task or decide it no longer applies, I want to mark it done or remove it from the list in a single action, so I can see only what actually remains and avoid re-reading items I have already handled.

**Current Alternatives:**
- Manually crosses items off a notepad — cannot distinguish "done" from "skipped"
- Closes the browser tab and starts a new list from scratch each day — loses history of what was done
- Leaves completed items unchecked, making the list grow until it is visually overwhelming

**Hiring Criteria:**
- Completing a task requires exactly one click on a visible affordance (checkbox or equivalent)
- Completed tasks are visually differentiated (strikethrough, muted colour) so pending items stand out at a glance
- Deleting a task requires one click and takes effect immediately — no confirmation dialog
- Completion and deletion state persists across page refreshes so accidental reloads do not undo progress

**Success Measure:** Marcus can scan a 10-item list, identify all pending tasks, and clear two completed items in under 30 seconds without any additional navigation.

**Related Features:** F1, F2, F3
**Priority:** P0

---

## PER-02: Priya Nair — Lightweight Power User / Productivity-Conscious Professional

### JTBD-02.1: Reliable Personal List That Outlasts Browser Sessions

**Job Statement:**
When I start a new work session after closing my laptop or restarting my browser, I want to see my full task list exactly as I left it — every item, every completion state — so I can pick up where I left off without reconstructing my priorities from scratch.

**Current Alternatives:**
- Relies on sticky notes on her monitor — not searchable, easy to lose, no completion tracking
- Keeps a mental list that erodes as meetings pile up — items are forgotten under cognitive load
- Uses Jira personal tasks — too heavyweight and mixed with team work; not personal enough

**Hiring Criteria:**
- Every task and its completion state is written to localStorage on every state change — not just on app close
- The full list is restored correctly on every page load or browser restart with zero data loss
- No login or sync is required — the list exists entirely on her device, always available

**Success Measure:** 100% of tasks and completion states are correctly restored after a browser restart in every test run — zero data loss across 20 consecutive restart trials.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-02.2: Zero-Friction Task Capture During or Between Meetings

**Job Statement:**
When a new action item surfaces in a meeting or a quick thought demands capture between calendar events, I want to add it to my personal list in under one second without breaking my meeting presence or switching mental context, so I can stay engaged while ensuring the item is not forgotten.

**Current Alternatives:**
- Types a note in a Slack DM to herself — easily buried in conversation history
- Adds items to Jira as personal tasks — requires navigating to Jira, selecting a board, filling a form
- Writes on a sticky note — reliable in the moment but lost within the day

**Hiring Criteria:**
- The input field is keyboard-reachable without mouse interaction (e.g. auto-focused on load)
- A task is submitted and visible in the list within 1 second of pressing Enter
- The app requires no navigation — task input and task list coexist on the same screen at all times
- No page reload, spinner, or loading state interrupts the flow between typing and seeing the task

**Success Measure:** From pressing Enter to the task appearing in the visible list takes under 1 second in all modern evergreen browsers with no perceptible loading state.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-02.3: Fast End-of-Day Reset for a Clean Tomorrow

**Job Statement:**
When the workday ends and I am doing a final review, I want to delete all completed tasks in a quick cleanup sweep so I can start the next day with only genuine outstanding work visible, without spending more than a few seconds on the reset.

**Current Alternatives:**
- Tears off the sticky note and writes a new one — takes a minute; previous context is lost
- Leaves old tasks in her mental queue, causing next-day confusion over what was actually completed
- Opens Notion and archives completed items — too slow for a personal end-of-day habit

**Hiring Criteria:**
- Each task has a clearly visible delete affordance that works in one click
- Deletion is immediate with no confirmation prompt — the interaction must feel instant
- After deletion, the remaining list reflects only true outstanding items — no ghost items or undo dialogs blocking the view
- The cleaned list persists immediately to localStorage so the refreshed state is what she sees tomorrow

**Success Measure:** Priya can delete all completed tasks from a 10-item list (5 completed, 5 pending) in under 20 seconds using keyboard and mouse, leaving only pending tasks in the list.

**Related Features:** F1, F3
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD ID | Related Feature(s) | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0, F1 | First-time user completes core loop in ≤60 seconds with zero instructions |
| JTBD-01.2 | F0, F1 | Task captured and visible in list within 5 seconds via keyboard only |
| JTBD-01.3 | F1, F2, F3 | Pending-only view achievable in ≤30 seconds; state survives page refresh |
| JTBD-02.1 | F1, F2 | 100% task and completion-state restoration after browser restart |
| JTBD-02.2 | F0, F1 | Task visible in list within 1 second of Enter keypress; no loading state |
| JTBD-02.3 | F1, F3 | 10-item cleanup (5 deletions) completed in ≤20 seconds; list persists immediately |

---

## NaC Preview

*Candidate Natural Acceptance Criteria derived from job success measures. To be refined in downstream STORY-MAP and verification phases.*

| JTBD ID | Outcome (from Success Measure) | Candidate NaC |
|---|---|---|
| JTBD-01.1 | New user completes core loop in ≤60 seconds, zero instructions | Given a first-time visitor with no prior app knowledge, when they open the app, then they can add, complete, and delete a task within 60 seconds without any guidance |
| JTBD-01.2 | Task captured via keyboard in under 5 seconds | Given the app is open, when the user types a task and presses Enter, then the task appears in the list within 1 second and the input field is cleared and refocused |
| JTBD-01.3 | 10-item list scanned and 2 items cleared in ≤30 seconds | Given a list with mixed pending and completed tasks, when the user clicks complete on a task, then it renders with strikethrough and a delete click removes it immediately with no dialog |
| JTBD-02.1 | 100% task restoration after browser restart, 20 consecutive trials | Given tasks have been added and some completed, when the browser is closed and reopened, then every task and its completion state is displayed exactly as before |
| JTBD-02.2 | Task visible in list within 1 second of Enter keypress | Given the app is open, when the user presses Enter to submit a task, then the task is visible in the list in under 1 second with no spinner or loading state |
| JTBD-02.3 | Delete 5 completed tasks from 10-item list in ≤20 seconds | Given a list with 5 completed and 5 pending tasks, when the user clicks delete on each completed item, then each is removed immediately and only the 5 pending tasks remain |

---

*Document generated: 2026-05-07 | Based on: PERSONAS-TodoApp.md, PRD-TodoApp.md, .planning/PROJECT.md | Feeds into: STORY-MAP-TodoApp.md, FRD-TodoApp.md, UserStories-TodoApp.md*
