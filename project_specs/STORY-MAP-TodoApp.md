# STORY MAP: Simple To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | Simple To-Do App (TodoApp) |
| **Document Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related PRD** | PRD-TodoApp.md |
| **Related Personas** | PERSONAS-TodoApp.md (PER-01 Marcus Webb, PER-02 Priya Nair) |
| **Related Journeys** | JOURNEYS-TodoApp.md (JRN-01.1–01.3, JRN-02.1–02.3) |
| **Related JTBD** | JTBD-TodoApp.md (JTBD-01.1–01.3, JTBD-02.1–02.3) |
| **Related UserStories** | UserStories-TodoApp.md (US-0.1–US-3.4, 18 stories) |
| **Author** | Pivota Spec Story Map Generator |

---

## 1. Overview

This Story Map organises all 18 UserStories (US-0.1 – US-3.4) along two axes:

- **X-axis (columns):** Journey stages drawn from JOURNEYS-TodoApp.md — representing the temporal flow of user activity across six journeys (JRN-01.1 through JRN-02.3).
- **Y-axis (rows):** Stories grouped within each stage, ordered by epic (F0 → F1 → F2 → F3).

Each story receives a **Story Map ID (SM-{Epic}.{NN})**, a **Natural Acceptance Criterion (NaC)**, and a **Release assignment**.

### What is a NaC?

A **Natural Acceptance Criterion** bridges a JTBD outcome to a testable condition. It is derived from the intersection of:
1. A **JTBD outcome** — what the user most needs to feel successful
2. A **Journey stage** — the specific moment in the user's flow
3. A **User Story** — the concrete capability being built

NaC are NOT invented. Every NaC in this document traces to a specific JTBD ID and journey stage. They complement (and are cross-checked against) the formal Acceptance Criteria in UserStories-TodoApp.md.

### Release Strategy

All 18 stories are P0 (Critical MVP). Since there are no P1/P2 stories and the product ships as a single release, all stories land in **R1: Core Loop MVP**. The map nonetheless identifies story sub-groupings that could be sequenced in an iterative build order if the team works in sprints.

---

## 2. Journey Stage Reference

| Journey ID | Persona | Scenario | Stages |
|---|---|---|---|
| JRN-01.1 | PER-01 Marcus | First-Time Use | Land → Orient → First Task → Verify → Continue |
| JRN-01.2 | PER-01 Marcus | Mid-Work Task Capture | Trigger → Switch → Type & Submit → Verify (Glance) → Return |
| JRN-01.3 | PER-01 Marcus | End-of-Task Cleanup | Review → Complete → Repeat Completion → Delete → Survey |
| JRN-02.1 | PER-02 Priya | Browser Restart Resilience | Open Browser → Scan for Accuracy → Validate Completions → Resume Work → Add New Task |
| JRN-02.2 | PER-02 Priya | Meeting-Mode Capture | Trigger → Switch & Type → Submit → Return |
| JRN-02.3 | PER-02 Priya | End-of-Day Reset | Scan → Target Completed → Delete First Item → Delete Remaining → Verify Clean List |

---

## 3. Story Map Matrix

> Column headers = canonical journey stage names shared across all journeys.  
> Stages are collapsed to their functional archetype: **Arrive · Capture · View/Verify · Interact · Persist · Reset**.  
> This abstraction spans all 6 journeys cleanly.

| SM-ID | Persona(s) | Journey Stage (Archetype) | Journey Ref(s) | Epic | Story ID | Story Title | NaC | Release |
|---|---|---|---|---|---|---|---|---|
| SM-0.1 | PER-01, PER-02 | **Arrive** | JRN-01.1:Orient, JRN-02.1:Add New Task | Epic 0 (F0) | US-0.1 | Add a Task via Keyboard | JTBD-01.1 → Orient: Input field is auto-focused on load; user types first task and presses Enter within 10 seconds of arrival with no mouse touch | R1 |
| SM-0.2 | PER-01 | **Arrive** | JRN-01.1:Orient | Epic 0 (F0) | US-0.2 | Add a Task via Button Click | JTBD-01.1 → Orient: A visible "Add" button provides a discoverable submission path for first-time users who have not yet learned the Enter shortcut | R1 |
| SM-0.3 | PER-02 | **Capture** | JRN-01.2:Type & Submit, JRN-02.2:Switch & Type | Epic 0 (F0) | US-0.3 | Reject Blank Submissions | JTBD-01.2 → Type & Submit: Accidental Enter presses during rapid capture produce no ghost tasks and no interruption — inline error appears and disappears silently | R1 |
| SM-0.4 | PER-02 | **Capture** | JRN-02.2:Switch & Type | Epic 0 (F0) | US-0.4 | Reject Over-Length Submissions | JTBD-02.2 → Switch & Type: Oversized task text is caught inline without a page disruption, preserving meeting-mode capture flow | R1 |
| SM-0.5 | PER-01 | **Capture** | JRN-01.2:Type & Submit | Epic 0 (F0) | US-0.5 | Strip Surrounding Whitespace | JTBD-01.2 → Type & Submit: Accidental leading/trailing spaces are silently trimmed so the list stays clean without extra effort from the user | R1 |
| SM-1.1 | PER-01 | **Arrive** | JRN-01.1:Land, JRN-02.1:Open Browser | Epic 1 (F1) | US-1.1 | View All Tasks on Page Load | JTBD-02.1 → Open Browser: Every task saved in a prior session renders immediately from localStorage on page load with no user action required | R1 |
| SM-1.2 | PER-02 | **View/Verify** | JRN-01.3:Review, JRN-02.3:Scan | Epic 1 (F1) | US-1.2 | See Visual Distinction Between Pending and Completed | JTBD-01.3 → Review: Pending and completed tasks are visually distinguishable in under 3 seconds at a glance — strikethrough + muted colour is sufficient without reading each item | R1 |
| SM-1.3 | PER-01 | **Arrive** | JRN-01.1:Land, JRN-02.3:Verify Clean List | Epic 1 (F1) | US-1.3 | See an Empty State When No Tasks Exist | JTBD-01.1 → Land: First-time users and post-cleanup users see a calm, clear "No tasks yet. Add one above!" message — never a blank or broken UI | R1 |
| SM-1.4 | PER-02 | **Capture** | JRN-01.2:Verify (Glance), JRN-02.2:Submit | Epic 1 (F1) | US-1.4 | Task List Updates Immediately Without Page Reload | JTBD-02.2 → Submit: Every add, toggle, and delete updates the list DOM within 100 ms with no spinner — sub-second feedback is visually verifiable | R1 |
| SM-1.5 | PER-01 | **Persist** | JRN-02.1:Scan for Accuracy, JRN-01.3:Survey | Epic 1 (F1) | US-1.5 | Tasks Persist Across Page Refreshes | JTBD-02.1 → Scan for Accuracy: After a full page refresh, all tasks and their completion states are present and correct — zero data loss across 20 consecutive restart trials | R1 |
| SM-2.1 | PER-01 | **Interact** | JRN-01.3:Complete | Epic 2 (F2) | US-2.1 | Mark a Task as Complete | JTBD-01.3 → Complete: One click on the checkbox immediately renders strikethrough + muted colour and writes the new state to localStorage before the UI re-renders | R1 |
| SM-2.2 | PER-01 | **Interact** | JRN-01.3:Repeat Completion | Epic 2 (F2) | US-2.2 | Un-complete a Completed Task | JTBD-01.3 → Repeat Completion: Clicking a completed checkbox immediately reverts its visual style so users can correct accidental completions without confusion | R1 |
| SM-2.3 | PER-02 | **Persist** | JRN-02.1:Validate Completions | Epic 2 (F2) | US-2.3 | Completion State Persists Across Sessions | JTBD-02.1 → Validate Completions: After a browser restart, every task's completed/pending state is faithfully restored — no state flip-back bugs | R1 |
| SM-2.4 | PER-02 | **Interact** | JRN-02.2:Switch & Type, JRN-01.3:Complete | Epic 2 (F2) | US-2.4 | Accessible Checkbox Labels Update on Toggle | JTBD-02.2 → Switch & Type: Checkbox aria-labels reflect live state so keyboard-only and screen-reader users can operate the full complete/uncomplete loop without a mouse | R1 |
| SM-3.1 | PER-01 | **Interact** | JRN-01.3:Delete, JRN-02.3:Delete First Item | Epic 3 (F3) | US-3.1 | Delete a Task from the List | JTBD-01.3 → Delete: One click removes a task from the DOM and localStorage within 100 ms with no confirmation dialog — the rhythm of a multi-item deletion sweep is unbroken | R1 |
| SM-3.2 | PER-02 | **Reset** | JRN-02.3:Verify Clean List | Epic 3 (F3) | US-3.2 | See Empty State After Deleting the Last Task | JTBD-02.3 → Verify Clean List: After deleting the final task, the empty-state message appears immediately — the user sees a clean slate, not a blank or broken list | R1 |
| SM-3.3 | PER-01 | **Persist** | JRN-02.3:Verify Clean List, JRN-01.3:Survey | Epic 3 (F3) | US-3.3 | Deletion Persists Across Sessions | JTBD-02.3 → Verify Clean List: Deleted tasks never reappear after a page refresh — the clean end-of-day state survives overnight and is intact the following morning | R1 |
| SM-3.4 | PER-02 | **Interact** | JRN-02.3:Delete Remaining | Epic 3 (F3) | US-3.4 | Delete Button Accessible via Keyboard | JTBD-02.3 → Delete Remaining: All 5 end-of-day deletions are executable via keyboard Tab + Enter/Space without touching the mouse — focus moves predictably after each deletion | R1 |

**Total mapped stories: 18 / 18 — no orphans.**

---

## 4. NaC Derivation Table

Full traceability chain: JTBD outcome → Journey stage → NaC → Story.

| SM-ID | JTBD ID | JTBD Outcome (from Success Measure) | Journey Stage | NaC (testable criterion) | Story |
|---|---|---|---|---|---|
| SM-0.1 | JTBD-01.1 | First-time user completes core loop in ≤60 seconds, zero instructions | JRN-01.1: Orient | Input field is auto-focused on load; user adds first task by pressing Enter without touching the mouse | US-0.1 |
| SM-0.2 | JTBD-01.1 | First-time user completes core loop in ≤60 seconds, zero instructions | JRN-01.1: Orient | A visible "Add" button is rendered adjacent to the input; clicking it with non-empty text submits the task | US-0.2 |
| SM-0.3 | JTBD-01.2 | Task captured via keyboard in under 5 seconds | JRN-01.2: Type & Submit | An accidental blank Enter produces no task and no page disruption; inline message appears and clears on next keypress | US-0.3 |
| SM-0.4 | JTBD-02.2 | Task visible in list within 1 second of Enter keypress | JRN-02.2: Switch & Type | Input exceeding 500 characters is rejected inline; focus stays in the field so the user can edit without restarting | US-0.4 |
| SM-0.5 | JTBD-01.2 | Task captured via keyboard in under 5 seconds | JRN-01.2: Type & Submit | Leading/trailing whitespace is silently trimmed; stored task text is clean with no user intervention | US-0.5 |
| SM-1.1 | JTBD-02.1 | 100% task restoration after browser restart across 20 trials | JRN-02.1: Open Browser | On every page load, the full task list renders from localStorage before the user interacts — no spinner, no blank flash | US-1.1 |
| SM-1.2 | JTBD-01.3 | 10-item list scanned and 2 items cleared in ≤30 seconds | JRN-01.3: Review | Completed tasks display strikethrough + muted colour; pending tasks remain full-contrast — distinction parseable in under 3 seconds | US-1.2 |
| SM-1.3 | JTBD-01.1 | First-time user completes core loop in ≤60 seconds, zero instructions | JRN-01.1: Land | When no tasks exist, "No tasks yet. Add one above!" is shown — the interface is never empty or confusing to a first-time visitor | US-1.3 |
| SM-1.4 | JTBD-02.2 | Task visible in list within 1 second of Enter keypress; no spinner | JRN-02.2: Submit | Every add/toggle/delete updates the list DOM within 100 ms — no async delay, no spinner is ever visible | US-1.4 |
| SM-1.5 | JTBD-02.1 | 100% task and completion-state restoration after browser restart | JRN-02.1: Scan for Accuracy | After a full page refresh, every task and completion state matches the pre-refresh state with zero discrepancies | US-1.5 |
| SM-2.1 | JTBD-01.3 | 10-item list scanned; 2 completed items cleared in ≤30 seconds | JRN-01.3: Complete | One click on an unchecked checkbox sets completed=true, renders strikethrough immediately, and writes to localStorage | US-2.1 |
| SM-2.2 | JTBD-01.3 | 10-item list scanned; completed items cleared in ≤30 seconds | JRN-01.3: Repeat Completion | One click on a checked checkbox sets completed=false and reverts visual style immediately — the toggle is bidirectional | US-2.2 |
| SM-2.3 | JTBD-02.1 | 100% task and completion-state restoration after browser restart | JRN-02.1: Validate Completions | After a browser restart, every task's completed boolean is correctly deserialised — no state reverts to pending incorrectly | US-2.3 |
| SM-2.4 | JTBD-02.2 | Task visible in list within 1 second of Enter keypress | JRN-02.2: Switch & Type | Checkboxes have correct aria-label ("Mark complete" / "Mark incomplete") and are focusable via Tab; toggle via Space/Enter works | US-2.4 |
| SM-3.1 | JTBD-01.3 | 10-item list scanned; completed items cleared in ≤30 seconds | JRN-01.3: Delete | Clicking the delete button removes the task from DOM and localStorage within 100 ms; no dialog appears | US-3.1 |
| SM-3.2 | JTBD-02.3 | 5 completed tasks deleted from 10-item list in ≤20 seconds; list persists | JRN-02.3: Verify Clean List | After the final task is deleted, the empty-state message appears immediately with no ghost items remaining | US-3.2 |
| SM-3.3 | JTBD-02.3 | 5 completed tasks deleted from 10-item list in ≤20 seconds; list persists | JRN-02.3: Verify Clean List | After a page refresh following deletions, no deleted task reappears — localStorage reflects the post-deletion state | US-3.3 |
| SM-3.4 | JTBD-02.3 | 5 completed tasks deleted from 10-item list in ≤20 seconds | JRN-02.3: Delete Remaining | Delete buttons are reachable via Tab; Enter/Space triggers deletion; focus moves to adjacent task or Add Input predictably | US-3.4 |

---

## 5. Release Planning

### R1: Core Loop MVP — "From Thought to Done"

**Theme:** Deliver the complete add → view → complete → delete loop in a single, frictionless, persistent interface. All 18 stories ship together as an integrated MVP.

**Sprint Sequencing Suggestion** (for teams building iteratively):

| Sprint | Build Focus | Stories | Enables Journey |
|---|---|---|---|
| S1 | Input + List Render | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5, US-1.1, US-1.3, US-1.4 | JRN-01.1 (First-Time Use) — full |
| S2 | Complete + Delete | US-2.1, US-2.2, US-3.1, US-3.2, US-1.2 | JRN-01.3 (Cleanup) — full |
| S3 | Persistence + Accessibility | US-1.5, US-2.3, US-2.4, US-3.3, US-3.4 | JRN-02.1 (Restart), JRN-02.2 (Meeting), JRN-02.3 (Reset) — all complete |

**Personas Served by R1:** PER-01 Marcus Webb, PER-02 Priya Nair  
**JTBD Addressed by R1:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-02.2, JTBD-02.3

#### R1 Story List

| Story ID | Title | SM-ID | Sprint |
|---|---|---|---|
| US-0.1 | Add a Task via Keyboard | SM-0.1 | S1 |
| US-0.2 | Add a Task via Button Click | SM-0.2 | S1 |
| US-0.3 | Reject Blank Submissions | SM-0.3 | S1 |
| US-0.4 | Reject Over-Length Submissions | SM-0.4 | S1 |
| US-0.5 | Strip Surrounding Whitespace | SM-0.5 | S1 |
| US-1.1 | View All Tasks on Page Load | SM-1.1 | S1 |
| US-1.3 | See an Empty State When No Tasks Exist | SM-1.3 | S1 |
| US-1.4 | Task List Updates Immediately Without Page Reload | SM-1.4 | S1 |
| US-1.2 | See Visual Distinction Between Pending and Completed | SM-1.2 | S2 |
| US-2.1 | Mark a Task as Complete | SM-2.1 | S2 |
| US-2.2 | Un-complete a Completed Task | SM-2.2 | S2 |
| US-3.1 | Delete a Task from the List | SM-3.1 | S2 |
| US-3.2 | See Empty State After Deleting the Last Task | SM-3.2 | S2 |
| US-1.5 | Tasks Persist Across Page Refreshes | SM-1.5 | S3 |
| US-2.3 | Completion State Persists Across Sessions | SM-2.3 | S3 |
| US-2.4 | Accessible Checkbox Labels Update on Toggle | SM-2.4 | S3 |
| US-3.3 | Deletion Persists Across Sessions | SM-3.3 | S3 |
| US-3.4 | Delete Button Accessible via Keyboard | SM-3.4 | S3 |

**Total R1 Stories: 18**

#### Journey Completeness by Sprint

| Sprint | Journey | Complete? |
|---|---|---|
| S1 | JRN-01.1: First-Time Use | ✅ Full journey enabled (Land → Continue) |
| S1 | JRN-01.2: Mid-Work Capture | ✅ Core path enabled (Switch → Verify) |
| S2 | JRN-01.3: End-of-Task Cleanup | ✅ Full journey enabled (Review → Survey) |
| S3 | JRN-02.1: Browser Restart Resilience | ✅ Full journey enabled (Open → Add New Task) |
| S3 | JRN-02.2: Meeting-Mode Capture | ✅ Full journey enabled (Trigger → Return) |
| S3 | JRN-02.3: End-of-Day Reset | ✅ Full journey enabled (Scan → Verify Clean List) |

---

## 6. Coverage Analysis

### 6.1 Persona Coverage

| Persona | R1 Stories | Journeys Covered | Status |
|---|---|---|---|
| PER-01 Marcus Webb | US-0.1, US-0.2, US-0.5, US-1.1, US-1.3, US-1.5, US-2.1, US-2.2, US-3.1, US-3.3 | JRN-01.1, JRN-01.2, JRN-01.3 | ✅ Fully served |
| PER-02 Priya Nair | US-0.3, US-0.4, US-1.2, US-1.4, US-2.3, US-2.4, US-3.2, US-3.4 | JRN-02.1, JRN-02.2, JRN-02.3 | ✅ Fully served |

> Note: Many stories serve both personas. The table above lists the primary persona attribution per UserStories-TodoApp.md. All 4 features (F0–F3) are Primary for both personas per PERSONAS-TodoApp.md.

### 6.2 JTBD Coverage

| JTBD ID | Job Statement (abbreviated) | Stories Addressing It | Status |
|---|---|---|---|
| JTBD-01.1 | Get into a working task list instantly, no setup | US-0.1, US-0.2, US-1.1, US-1.3 | ✅ Fully addressed |
| JTBD-01.2 | Record tasks the moment they surface | US-0.1, US-0.3, US-0.4, US-0.5, US-1.4 | ✅ Fully addressed |
| JTBD-01.3 | Keep list accurate by clearing finished/cancelled work | US-1.2, US-1.5, US-2.1, US-2.2, US-3.1, US-3.3 | ✅ Fully addressed |
| JTBD-02.1 | Maintain a reliable personal list that survives browser sessions | US-1.1, US-1.5, US-2.3 | ✅ Fully addressed |
| JTBD-02.2 | Capture a task mid-meeting without losing focus | US-0.1, US-0.3, US-0.4, US-1.4, US-2.4 | ✅ Fully addressed |
| JTBD-02.3 | Fast end-of-day reset for a clean tomorrow | US-3.1, US-3.2, US-3.3, US-3.4 | ✅ Fully addressed |

### 6.3 Journey Stage Coverage

| Stage Archetype | Journey Stages Mapped | Stories Covering | Status |
|---|---|---|---|
| Arrive | JRN-01.1:Land, JRN-01.1:Orient, JRN-02.1:Open Browser | US-0.1, US-0.2, US-1.1, US-1.3 | ✅ Covered |
| Capture | JRN-01.2:Type & Submit, JRN-02.2:Switch & Type, JRN-02.2:Submit | US-0.3, US-0.4, US-0.5, US-1.4 | ✅ Covered |
| View/Verify | JRN-01.3:Review, JRN-01.2:Verify (Glance), JRN-02.3:Scan, JRN-02.1:Scan for Accuracy | US-1.2, US-1.4 | ✅ Covered |
| Interact | JRN-01.3:Complete, JRN-01.3:Delete, JRN-02.3:Delete First/Remaining | US-2.1, US-2.2, US-2.4, US-3.1, US-3.4 | ✅ Covered |
| Persist | JRN-02.1:Validate Completions, JRN-01.3:Survey, JRN-02.3:Verify Clean List | US-1.5, US-2.3, US-3.3 | ✅ Covered |
| Reset | JRN-02.3:Verify Clean List, JRN-02.3:Delete Remaining | US-3.2, US-3.4 | ✅ Covered |

### 6.4 Gap Analysis

**Journey stages without story coverage:**
- None. All 6 journey archetypes have at least one story.

**JTBD outcomes without a derived NaC:**
- None. All 6 JTBD outcomes are addressed by at least one NaC.

**Orphan stories (stories not mapped to any journey stage):**
- None. All 18 stories are mapped.

**Out-of-scope journeys (no stories planned):**
- None applicable for v1. All 6 journeys are supported by R1.

> ✅ **Full coverage confirmed.** No gaps, orphans, or unmapped JTBD outcomes. Every UserStory is placed on the map with a traceable NaC.

---

## 7. NaC-to-Acceptance Criteria Alignment

Cross-check verifying that each story's NaC is substantiated by its formal Acceptance Criteria in UserStories-TodoApp.md.

| SM-ID | Story | NaC Summary | Verified AC in UserStories | Aligned? |
|---|---|---|---|---|
| SM-0.1 | US-0.1 | Input auto-focused; Enter submits without mouse | "Add Input receives focus automatically on page load" · "Pressing Enter submits the task" | ✅ |
| SM-0.2 | US-0.2 | Visible "Add" button is discoverable | "An 'Add' button is rendered adjacent to the Add Input field" | ✅ |
| SM-0.3 | US-0.3 | Blank Enter produces no task; inline message clears on next keypress | "Submitting empty input does NOT create a task" · "Inline message disappears as soon as user begins typing" | ✅ |
| SM-0.4 | US-0.4 | 500-char limit caught inline; focus stays in field | "Text exceeding 500 characters does NOT create a task" · "Focus remains on the Add Input after rejection" | ✅ |
| SM-0.5 | US-0.5 | Leading/trailing whitespace silently trimmed | "Leading and trailing whitespace is trimmed from input before storing" | ✅ |
| SM-1.1 | US-1.1 | Full task list renders from localStorage on load | "On page load, app reads from localStorage key 'todoapp_tasks'" · "Page renders without user interaction" | ✅ |
| SM-1.2 | US-1.2 | Strikethrough + muted colour distinguishes completed from pending | "Completed tasks display with strikethrough text and muted colour (CSS class task--completed)" | ✅ |
| SM-1.3 | US-1.3 | "No tasks yet. Add one above!" shown when list empty | "When Task Array contains zero items, message 'No tasks yet. Add one above!' is displayed" | ✅ |
| SM-1.4 | US-1.4 | DOM updates within 100 ms; no spinner ever visible | "Adding a task appends it within 100 ms without a page reload" · "No loading spinner or async delay is visible" | ✅ |
| SM-1.5 | US-1.5 | 100% task and state restoration after page refresh | "Every state change writes updated Task Array to localStorage before UI updates" · "After full page refresh, all tasks re-displayed with correct states" | ✅ |
| SM-2.1 | US-2.1 | One click sets completed=true, renders strikethrough, writes localStorage | "Clicking unchecked checkbox sets completed to true" · "Updated state written to localStorage before UI re-renders" | ✅ |
| SM-2.2 | US-2.2 | One click on checked reverts to pending style | "Clicking checked checkbox sets completed back to false" · "Task immediately reverts to pending visual style" | ✅ |
| SM-2.3 | US-2.3 | No state flip-back after browser restart | "After marking complete, page refresh shows task still in completed state" · "completed boolean correctly serialised/deserialised" | ✅ |
| SM-2.4 | US-2.4 | aria-labels correct; Tab focusable; Space/Enter toggles | "Each checkbox has aria-label='Mark complete' when pending" · "Checkbox is focusable via keyboard Tab navigation" | ✅ |
| SM-3.1 | US-3.1 | Delete removes from DOM + localStorage within 100 ms; no dialog | "Clicking delete immediately removes task from Task Array and localStorage" · "No confirmation dialog displayed" | ✅ |
| SM-3.2 | US-3.2 | Empty-state appears after final task deleted | "Deleting last task causes 'No tasks yet. Add one above!' to appear" · "No ghost items remain" | ✅ |
| SM-3.3 | US-3.3 | Deleted tasks absent from localStorage after refresh | "After deleting, full page refresh does NOT restore that task" · "localStorage array no longer contains deleted task" | ✅ |
| SM-3.4 | US-3.4 | Delete via Tab + Enter/Space; focus moves predictably | "Delete button reachable via keyboard Tab navigation" · "After deletion, focus moves to logical adjacent element" | ✅ |

**All 18 NaC are substantiated by formal Acceptance Criteria. Alignment: 18/18 ✅**

---

## 8. Validation Checklist

- [x] Every UserStory (US-0.1 – US-3.4) appears in the map — **18/18**
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD → Stage → NaC → Story)
- [x] Release planning groups are defined (R1 with sprint sub-groupings)
- [x] Coverage analysis confirms no gaps, orphans, or unmapped JTBD outcomes
- [x] NaC-to-Acceptance Criteria mapping verifies alignment for all 18 stories
- [x] No orphan stories (all 18 mapped to at least one journey stage)
- [x] R1 Sprint 1 enables at least one complete journey (JRN-01.1)
- [x] Every release serves all personas (PER-01 and PER-02 both in R1)

---

*Document generated: 2026-05-07 | Based on: PERSONAS-TodoApp.md, JTBD-TodoApp.md, JOURNEYS-TodoApp.md, UserStories-TodoApp.md, PRD-TodoApp.md | Feeds into: FRD-TodoApp.md, TechArch-TodoApp.md*
