# PERSONAS: Simple To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | Simple To-Do App (TodoApp) |
| **Document Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related PRD** | PRD-TodoApp.md |
| **Author** | Pivota Spec Personas Generator |

---

## Persona Summary

| Persona ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Marcus Webb | Busy Individual / Daily List Keeper | Capture and clear daily tasks as fast as possible, with zero setup |
| PER-02 | Priya Nair | Lightweight Power User / Productivity-Conscious Professional | Maintain a reliable personal task list without the overhead of a full productivity suite |

---

## PER-01: Marcus Webb

**Role & Context:**
Marcus is a freelance graphic designer in his early 30s who works from a home office. He bounces between client briefs, personal errands, and side projects throughout the day. He has tried tools like Notion and Todoist in the past but found himself spending more time configuring workspaces and navigating menus than actually getting things done. He does not want an app to remember his tasks forever — he wants a fast, disposable scratch-pad for today's work. He opens a browser tab in the morning, types in what he needs to do, and checks things off as the day progresses. He is comfortable with technology but deliberately avoids complexity in tools he uses daily.

**Goals:**
- Open the app and add the first task in under 10 seconds — no signup, no walkthrough (F0, F1)
- See all pending tasks at a glance on a single screen without any configuration (F1)
- Mark tasks complete with a single click as he works through his day (F2)
- Remove tasks he no longer needs without confirmation prompts slowing him down (F3)
- Trust that his list will still be there if he accidentally closes the tab (F1, F2)

**Pain Points:**
- Account creation walls block him from simply starting — he abandons tools that require a login
- Feature-rich interfaces (priorities, categories, due-date pickers) distract from the simple act of writing a task down
- Apps that lose his list on a page refresh are unusable as a daily scratch-pad
- Notification noise and onboarding flows from productivity apps feel intrusive

**Technical Expertise:** Intermediate — comfortable with all major browsers, uses web apps daily, avoids developer tooling and command-line interfaces

**Top Tasks:**
1. Add a new task quickly via keyboard (daily, multiple times — critical)
2. Scan the full task list to decide what to do next (daily, frequent — critical)
3. Check off completed tasks as work progresses (daily, frequent — high)
4. Delete stale or cancelled tasks to keep the list clean (daily, as-needed — medium)

**Success Criteria:**
- Completes the full core loop (add → view → complete → delete) within 60 seconds of first opening the app, with zero instructions
- Never loses a task to an accidental page refresh during a working session
- Can add a task using only the keyboard (Enter key submission) without touching the mouse

---

## PER-02: Priya Nair

**Role & Context:**
Priya is a mid-level product manager at a tech company in her late 20s. She uses a mix of tools at work — Jira for team planning, Slack for communication — but finds that none of them suit her personal daily to-do tracking. She keeps a mental list and a sticky note on her monitor, but forgets things when meetings pile up. She wants a clean, always-available browser tab she can glance at between meetings to confirm what she still needs to do. Unlike heavy users of Notion or Monday.com, she has no interest in tags, due dates, or project organization for her personal list — she just needs to know what is left to do today. She is technically fluent and appreciates well-crafted, minimal UIs.

**Goals:**
- Maintain a single, reliable list of personal action items separate from work project tools (F1)
- Add tasks mid-meeting without breaking focus — submission must be instant and keyboard-driven (F0)
- Quickly confirm which tasks are still pending vs. already done by visual scan (F1, F2)
- Clear completed tasks at end-of-day to start fresh the next morning (F3)
- Have her list survive browser restarts so she can pick up where she left off (F1, F2)

**Pain Points:**
- Existing productivity suites impose organizational structure (categories, priorities, due dates) she does not need for personal tasks
- Logging into a separate tool just to check a personal task list adds unnecessary friction during a busy workday
- Multi-device sync complexity is overkill — she only needs her task list on her work laptop
- Sticky notes and mental lists are unreliable; she needs something persistent but lightweight

**Technical Expertise:** High — power user of web applications, keyboard-shortcut oriented, expects fast and responsive interfaces with no loading spinners

**Top Tasks:**
1. Add a task rapidly via keyboard during or between meetings (multiple times daily — critical)
2. View and mentally process the full pending task list (multiple times daily — critical)
3. Toggle tasks to complete as she finishes work items (throughout the day — high)
4. Delete or clear tasks at end-of-day during a quick cleanup sweep (daily, once — medium)

**Success Criteria:**
- Task input-to-list time is under 1 second from pressing Enter to seeing the task appear in the list
- Visual distinction between pending and completed tasks is clear enough to parse at a glance in under 3 seconds
- Full task list is correctly restored from localStorage on every browser restart with no data loss

---

## Persona Relationships

| Interaction | PER-01 Marcus | PER-02 Priya |
|---|---|---|
| **PER-01 Marcus** | — | Both are single-user, personal-list users; Marcus tolerates more visual informality while Priya expects polish |
| **PER-02 Priya** | Priya values keyboard speed above all; Marcus values zero-setup above all — both reject account requirements | — |

> **Note:** TodoApp is a single-user, no-collaboration product. Personas do not interact *within* the app. The relationship table reflects how their distinct needs should influence design trade-offs (e.g., keyboard-first input satisfies both; visual polish is more critical for Priya; instant availability without login is more critical for Marcus).

---

## Feature-Persona Matrix

| Feature | Feature Name | PER-01 Marcus | PER-02 Priya |
|---|---|---|---|
| **F0** | Add Task | **Primary** | **Primary** |
| **F1** | View Task List | **Primary** | **Primary** |
| **F2** | Mark Task Complete | **Primary** | **Primary** |
| **F3** | Delete Task | **Primary** | **Primary** |

**Legend:** Primary = core to this persona's daily workflow · Secondary = useful but not central · None = not relevant

> All four v1 features (F0–F3) are Primary for both personas. This is expected: TodoApp's MVP scope is exactly the core loop — every feature in the Feature Index maps directly to both personas' stated goals. This confirms the PRD scope is tightly aligned with user needs and that no features exist without a clear persona driver.

---

*Document generated: 2026-05-07 | Based on: PRD-TodoApp.md, .planning/PROJECT.md | Feeds into: UserStories-TodoApp.md, FRD-TodoApp.md*
