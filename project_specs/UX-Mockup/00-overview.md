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
