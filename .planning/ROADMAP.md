# Roadmap: Simple To-Do App

## Overview

Two-phase delivery: stand up the project skeleton, then implement the complete task management loop (add, view, complete, delete) as one cohesive unit. All four v1 requirements are tightly interdependent — the list view underpins every other feature — so they ship together in Phase 2, producing a fully working app in a single focused build phase.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Setup** - Scaffold the file structure, HTML shell, CSS baseline, and module skeleton
- [ ] **Phase 2: Core Task Loop** - Implement add, view, complete, and delete tasks end-to-end with localStorage persistence

## Phase Details

### Phase 1: Project Setup
**Goal**: A deployable project skeleton exists — correct file structure, working HTML shell, baseline CSS, and stubbed JS modules — so Phase 2 can begin building features immediately
**Depends on**: Nothing (first phase)
**Requirements**: None (infrastructure only)
**Success Criteria** (what must be TRUE):
  1. Opening `index.html` in a browser renders a page (no blank screen, no console errors)
  2. The Add Input field, Add Button, and task list container are present in the DOM
  3. All four JS module files (`app.js`, `tasks.js`, `storage.js`, `render.js`) exist with correct module structure
  4. CSS loads and applies baseline styles with the `.task--completed` class defined
**Plans**: TBD

Plans:
- [ ] 01-01: Scaffold file structure and HTML shell
- [ ] 01-02: Write baseline CSS and stub JS modules

### Phase 2: Core Task Loop
**Goal**: Users can add tasks, see them listed, mark them complete, and delete them — with all state persisted to localStorage so the list survives a page refresh
**Depends on**: Phase 1
**Requirements**: TASK-01, TASK-02, TASK-03, TASK-04
**Success Criteria** (what must be TRUE):
  1. User can type a task and submit via Enter key or Add button — task appears immediately at the bottom of the list
  2. User can reload the page and all previously added tasks are still present with their completion states intact
  3. User can click a checkbox to mark a task complete — it shows strikethrough/muted style; clicking again reverts it to pending
  4. User can click the delete button on any task — it disappears immediately from the list and does not return on reload
  5. When the list is empty (or all tasks deleted), an empty-state message is shown instead of a blank list area
**Plans**: TBD

Plans:
- [ ] 02-01: Implement storage module and task state management
- [ ] 02-02: Implement add task (F00) and view task list (F01)
- [ ] 02-03: Implement mark complete (F02), delete task (F03), and wire all events

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup | 0/2 | Not started | - |
| 2. Core Task Loop | 0/3 | Not started | - |
