# FRD: Simple To-Do App (TodoApp)

**Document Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project Acronym:** TodoApp
**Based On:** PRD-TodoApp.md v1.0

---

## Scope

This Functional Requirements Document specifies the exact behaviour of every feature in TodoApp v1. It is the authoritative implementation reference for developers, testers, and reviewers. All four PRD features (F0–F3) are covered in full. The architecture is client-only: no server, no authentication, no external API calls. Persistence is achieved entirely via the browser's `localStorage` API.

---

## How to Read This Document

- **Feature chunks** are prefixed `F{nn}` (zero-padded) and map 1-to-1 with PRD feature IDs.
- **Cross-feature chunks** are prefixed `Y{n}`:
  - `Y0-schema.md` — data model (localStorage structure)
  - `Y1-api.md` — client-side module / function interface
  - `Y2-errors.md` — error catalog
  - `Y3-integrations.md` — browser API dependencies
- Validation rules are **normative** (MUST be enforced).
- Error states list every user-visible and programmatic failure path.
- "API Surface" in a feature chunk is a summary; full signatures live in `Y1-api.md`.
- "Schema Surface" in a feature chunk is a summary; full structure lives in `Y0-schema.md`.

---

## Table of Contents

| Section | File |
|---------|------|
| Header / TOC / Conventions | `00-header.md` (this file) |
| F00 — Add Task | `F00-add-task.md` |
| F01 — View Task List | `F01-view-task-list.md` |
| F02 — Mark Task Complete | `F02-mark-task-complete.md` |
| F03 — Delete Task | `F03-delete-task.md` |
| Y0 — Data Schema | `Y0-schema.md` |
| Y1 — Client API | `Y1-api.md` |
| Y2 — Error Catalog | `Y2-errors.md` |
| Y3 — Integrations | `Y3-integrations.md` |

---

## Cross-Cutting Terminology

| Term | Definition |
|------|-----------|
| **Task** | A single user-created item in the task list, consisting of a text description and a completion state. |
| **Pending** | Default state of a newly created task; the user has not yet marked it complete. |
| **Complete** | State of a task that has been toggled done by the user; visually distinguished from pending tasks. |
| **Task ID** | A unique identifier (`string`, UUID v4) assigned at creation time; never changes; used as the primary key for all operations. |
| **localStorage** | The browser-native `window.localStorage` key-value store used as the sole persistence layer. All reads and writes go through the Storage Module (see `Y1-api.md`). |
| **Storage Key** | The fixed localStorage key `"todoapp_tasks"` under which the serialised task array is stored. |
| **Task Array** | The canonical in-memory and at-rest representation of all tasks: a JSON array of Task objects sorted by creation order. |
| **UI State** | The live DOM representation of the task list; always derived from and kept in sync with the Task Array. |
| **Whitespace-only** | A string that is either empty (`""`) or consists entirely of space, tab, or newline characters. Whitespace-only task text is rejected on submission. |
| **Evergreen Browser** | Chrome, Firefox, Safari, and Edge at their current stable versions — the required compatibility targets. |

---

## Global Constraints

- **No backend.** All logic runs in the browser. No HTTP requests are made to any server.
- **No user accounts.** The app is single-user by design; no authentication layer exists.
- **localStorage is the single source of truth.** Every state mutation MUST be written to localStorage before the UI updates (write-then-render).
- **Performance budget.** Every user interaction (add, toggle, delete) MUST complete within 100 ms end-to-end.
- **Accessibility.** All interactive controls MUST have accessible labels. The full task lifecycle MUST be completable via keyboard alone.
- **Bundle size.** Total page weight (HTML + CSS + JS, uncompressed) MUST remain under 100 KB.

---
