# JOURNEYS: Simple To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | Simple To-Do App (TodoApp) |
| **Document Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related Personas** | PERSONAS-TodoApp.md (PER-01 Marcus Webb, PER-02 Priya Nair) |
| **Related JTBD** | JTBD-TodoApp.md (JTBD-01.1 – JTBD-01.3, JTBD-02.1 – JTBD-02.3) |
| **Related PRD** | PRD-TodoApp.md |
| **Author** | Pivota Spec Journeys Generator |

---

## Journey Index

| Journey ID | Persona | Scenario | Key JTBD | Stages |
|---|---|---|---|---|
| JRN-01.1 | PER-01 Marcus Webb | First-Time Use — Opening the App and Getting Started | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 Marcus Webb | Mid-Work Task Capture — Adding Tasks Throughout the Day | JTBD-01.2 | 5 |
| JRN-01.3 | PER-01 Marcus Webb | End-of-Task Cleanup — Completing and Removing Done Items | JTBD-01.3 | 5 |
| JRN-02.1 | PER-02 Priya Nair | Browser Restart Resilience — Picking Up After Closing the Laptop | JTBD-02.1 | 5 |
| JRN-02.2 | PER-02 Priya Nair | Meeting-Mode Capture — Adding a Task Without Breaking Focus | JTBD-02.2 | 4 |
| JRN-02.3 | PER-02 Priya Nair | End-of-Day Reset — Clearing Completed Tasks for a Clean Tomorrow | JTBD-02.3 | 5 |

---

## PER-01: Marcus Webb — Busy Individual / Daily List Keeper

---

### JRN-01.1: First-Time Use — Opening the App and Getting Started

**Persona:** PER-01 (Marcus Webb)

**Scenario:** Marcus has heard about TodoApp and opens it for the first time in a fresh browser tab on a Monday morning. He has zero prior knowledge of the interface. He wants to be capturing tasks within seconds — any friction at this step risks him closing the tab and returning to his usual mix of sticky notes and memory.

**Related Jobs:** JTBD-01.1 (Frictionless First Use)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Land** | Navigates to the app URL, page loads | App landing page (F1) | "OK, please just let me start — no sign-up screen." | Wary, cautious | Expects a login wall or pop-up to appear | Deliver immediate, visible task input — no modal, no hero text blocking the field |
| **2. Orient** | Scans the screen to understand what the interface does | Input field + empty task list (F0, F1) | "There's a text box and a list. That's it. I think I just type here?" | Relieved, slightly curious | Might hesitate for a second if the input affordance is not obviously primary | Auto-focus the input field on load so the cursor is already blinking, removing all doubt |
| **3. First Task** | Types a task description, presses Enter | Input field (F0) | "Let me just type 'client brief — review copy' and hit Enter." | Engaged, testing | If Enter does nothing, he will try clicking — any delay breaks trust | Task appears immediately in the list with no perceptible delay; input clears and refocuses |
| **4. Verify** | Looks at the task list to confirm the item was saved | Task list (F1) | "It's there. OK, that actually worked instantly." | Satisfied, gaining confidence | Empty state should clearly disappear — if a stale "no tasks" message lingers, it confuses him | Animate the first task appearing so the addition feels definite and real |
| **5. Continue** | Adds two more tasks to build out the morning list | Input field + task list (F0, F1) | "I'll just punch in everything while I'm here." | Comfortable, flowing | Accidental blank Enter press must not produce a ghost item | Silently ignore blank submissions; keep focus in the input field every time |

#### Key Moments

- **Decision Point — Stage 1 (Land):** If Marcus sees any account prompt or mandatory onboarding step, he closes the tab immediately. The app must prove it is ready before he has to do anything.
- **Risk of Abandonment — Stage 2 (Orient):** If the UI is ambiguous about where to type, he may stall for 10–15 seconds and decide the tool is "not that simple after all."
- **Delight Opportunity — Stage 4 (Verify):** The instant a task appears in the list with no reload or spinner, Marcus experiences the core value proposition. This is the moment the app wins him over.

#### Success Outcome

Marcus opens the app, adds three tasks, and confirms they are visible — all within 60 seconds of first visit, with no instructions read (JTBD-01.1 success measure: core loop completed ≤ 60 seconds).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Land | F1 (View Task List — empty state) |
| Orient | F0 (Add Task input), F1 (task list container) |
| First Task | F0 (Add Task — Enter submission) |
| Verify | F1 (View Task List — first item rendered) |
| Continue | F0 (Add Task), F1 (growing list) |

---

### JRN-01.2: Mid-Work Task Capture — Adding Tasks Throughout the Day

**Persona:** PER-01 (Marcus Webb)

**Scenario:** It is 11:30 AM. Marcus is halfway through a client illustration. A client emails him asking for an invoice by end of day. He needs to capture that task immediately without losing his mental context around the illustration. The app is already open in a background tab.

**Related Jobs:** JTBD-01.2 (Rapid Task Capture Throughout the Day)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Trigger** | Receives an email; decides to capture the task now | External (email client) | "Invoice by EOD — I need to write that down before I forget." | Momentarily interrupted, slightly anxious | The mental cost of the interruption rises with every second he is not back in his work | The app should be one tab switch away — no navigation, no loading |
| **2. Switch** | Clicks the TodoApp browser tab | App — main screen (F0, F1) | "OK, it's right here. Input field is ready." | Neutral, efficient | If the input field has lost focus and he has to click it, micro-friction builds | Maintain or restore focus to the input field whenever the tab is revisited |
| **3. Type & Submit** | Types "Send invoice to [client name]" and presses Enter | Input field (F0) | "Done. One keystroke." | Relieved, focused | Any delay between Enter and list update makes him second-guess whether it registered | Task appears in the list within 1 second; input clears instantly so the next thought can flow |
| **4. Verify (Glance)** | Glances at the top of the list to confirm the task is there | Task list (F1) | "Yep, it's in the list. Back to work." | Confident | A list that has grown long makes finding the new item harder | Append new tasks at the top so the most recently added item is immediately visible |
| **5. Return** | Clicks back to his illustration work tab | External (work app) | "That took about 3 seconds. Good." | Satisfied, re-focused | None at this stage if the previous steps were smooth | Total round-trip time under 5 seconds reinforces the habit of using the app |

#### Key Moments

- **Decision Point — Stage 2 (Switch):** If the input field is not focused, Marcus has to take his hands off the keyboard — this breaks the "one-keystroke" experience. Auto-focus on tab visibility is a high-value micro-improvement.
- **Risk of Abandonment — Stage 3 (Type & Submit):** Any visible loading state or perceptible delay here teaches Marcus that the app is "slow" — he will revert to a Slack DM to himself within a week.
- **Delight Opportunity — Stage 5 (Return):** The total round-trip feeling — "I didn't even have to stop what I was doing" — is the core habit-forming moment for this persona.

#### Success Outcome

Marcus captures the task in under 5 seconds using keyboard only, with no mouse interaction required, and returns to his previous work without losing his mental context (JTBD-01.2 success measure: thought-to-list in ≤ 5 seconds, keyboard only).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Trigger | — (external) |
| Switch | F0 (input auto-focus on tab switch), F1 (existing list) |
| Type & Submit | F0 (Add Task — Enter key path) |
| Verify (Glance) | F1 (new task at top of list) |
| Return | — (external) |

---

### JRN-01.3: End-of-Task Cleanup — Completing and Removing Done Items

**Persona:** PER-01 (Marcus Webb)

**Scenario:** It is 3 PM. Marcus has completed the client illustration and sent the invoice. His list has 6 items: 3 done, 3 still pending. He wants to mark the completed items, confirm what is left, and remove the done ones so the list reflects only real remaining work.

**Related Jobs:** JTBD-01.3 (Accurate List Maintenance Without Overhead)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Review** | Switches to TodoApp tab, scans the full list | Task list (F1) | "Let me see what I've actually done today versus what's left." | Focused, slightly tired | If completed and pending tasks look identical, scanning requires more cognitive effort | Visually distinguish completed items clearly — strikethrough + muted color makes pending tasks pop out |
| **2. Complete** | Clicks the checkbox on the "client illustration" task | Checkbox (F2) | "Click. Done. It should go grey or get a line through it." | Satisfied | If the toggle is too small or not obviously clickable, he misses it | Large enough click target (min 44 px); immediate visual feedback on click — no delay |
| **3. Repeat Completion** | Clicks checkboxes on two more completed items | Checkbox × 2 (F2) | "And the invoice one… and the brief review. All marked." | Progressively more satisfied | Without visual feedback, repeat-clicking the same item accidentally un-completes it | Strikethrough renders immediately so he can see the toggle state change before moving to the next |
| **4. Delete** | Clicks the delete icon on the first completed task | Delete affordance (F3) | "I don't need to see these anymore. Gone." | Efficient, cleaning | If a confirmation dialog appears, it breaks the rhythm — he will leave items and come back later (or never) | Instant deletion with no dialog; task disappears from list in under 100 ms |
| **5. Survey** | Scans remaining list after deletions | Task list (F1) | "Three things left. That's accurate. Good." | Calm, clear-headed | If a ghost item or stale UI state shows a deleted item, trust is damaged | Deterministic list re-render after every delete so the list is always truthful |

#### Key Moments

- **Decision Point — Stage 1 (Review):** If Marcus cannot quickly parse which items are done vs. pending, he may skip the cleanup entirely and "start fresh tomorrow" by closing the tab — defeating the persistence feature.
- **Risk of Abandonment — Stage 4 (Delete):** A confirmation dialog here is a known drop-off trigger for this persona. One click must be enough.
- **Delight Opportunity — Stage 5 (Survey):** Seeing a clean, accurate short list at the end of a productive afternoon is quietly satisfying. The app earns daily return visits by making this moment effortless.

#### Success Outcome

Marcus scans a 6-item list, marks 3 items complete, deletes the same 3, and is left with 3 pending items — all in under 30 seconds, with no confirmation dialogs (JTBD-01.3 success measure: 10-item list scanned and items cleared in ≤ 30 seconds).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Review | F1 (View Task List — mixed state) |
| Complete | F2 (Mark Task Complete — checkbox) |
| Repeat Completion | F2 (Mark Task Complete × 2) |
| Delete | F3 (Delete Task — no confirmation) |
| Survey | F1 (View Task List — cleaned state) |

---

## PER-02: Priya Nair — Lightweight Power User / Productivity-Conscious Professional

---

### JRN-02.1: Browser Restart Resilience — Picking Up After Closing the Laptop

**Persona:** PER-02 (Priya Nair)

**Scenario:** Priya closed her work laptop at 6 PM on Tuesday with 5 tasks in her TodoApp — 2 completed, 3 still pending. She opens her laptop Wednesday morning at 9 AM, reopens Chrome, and navigates to TodoApp. She needs her list to be exactly as she left it: completion states intact, no data loss.

**Related Jobs:** JTBD-02.1 (Reliable Personal List That Outlasts Browser Sessions)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open Browser** | Reopens Chrome; TodoApp tab reloads or she navigates to it | App loading (F1 init) | "My list should still be there from yesterday." | Expectant, slightly cautious | If there is any perceptible load time, she questions whether the data survived | Instant render from localStorage on init — no spinner, list appears as the page paints |
| **2. Scan for Accuracy** | Reads the list to verify all 5 tasks are present and states are correct | Task list (F1, F2) | "Two strikethrough items, three without. That matches what I left." | Relieved, trusting | A single missing task or incorrect completion state destroys trust in the tool permanently | Persist every state change to localStorage immediately — not on unload — so mid-session crashes also survive |
| **3. Validate Completions** | Checks that the 2 completed items still show strikethrough | Completed tasks (F1, F2) | "OK the completed ones are still showing as done. Good." | Confident | If completed items appear as pending after a reload, she has to re-do work she already did | localStorage write on every toggle — load and render completion state faithfully on every init |
| **4. Resume Work** | Reads the 3 pending items and selects the highest-priority one mentally | Task list (F1) | "Three left: follow up with design, review deck, update roadmap. Let me start with the deck." | Focused, ready | If the list order changed since yesterday, she has to reparse — order must be stable | Preserve insertion order across sessions; no re-sorting on load |
| **5. Add New Task** | Adds one new task that surfaced during her morning commute | Input field (F0) | "One more: email the vendor about the contract." | Efficient | If the input field is not auto-focused, she reaches for the mouse — small but noticeable | Auto-focus input on every page load — keyboard ready without a mouse click |

#### Key Moments

- **Decision Point — Stage 2 (Scan for Accuracy):** This is the trust-forming moment. If even one task is missing, Priya immediately declares the app "unreliable" and moves back to sticky notes. localStorage persistence is non-negotiable.
- **Risk of Abandonment — Stage 3 (Validate Completions):** Incorrect completion state is worse than a missing task — it makes her think she has undone work. A completion state that flips back to pending after reload is an immediate disqualifying bug.
- **Delight Opportunity — Stage 5 (Add New Task):** Seamlessly adding a new task to an already-restored list — with no page reload, no setup — is the moment the app proves it is her single source of truth for personal tasks.

#### Success Outcome

All 5 tasks (2 completed, 3 pending) are correctly restored after browser restart with zero data loss, and Priya adds a new task within 10 seconds of opening the app (JTBD-02.1 success measure: 100% task and completion-state restoration across 20 consecutive restart trials).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open Browser | F1 (View Task List — localStorage init) |
| Scan for Accuracy | F1 (full list render), F2 (completion state render) |
| Validate Completions | F2 (persisted completion states) |
| Resume Work | F1 (stable list order) |
| Add New Task | F0 (Add Task — auto-focused input) |

---

### JRN-02.2: Meeting-Mode Capture — Adding a Task Without Breaking Focus

**Persona:** PER-02 (Priya Nair)

**Scenario:** Priya is in a 45-minute product review meeting over video call. Her manager assigns her a new action item: "share updated roadmap with the sales team by Thursday." She needs to capture it in TodoApp immediately without visibly alt-tabbing away, losing track of the conversation, or triggering any loading state that draws attention.

**Related Jobs:** JTBD-02.2 (Zero-Friction Task Capture During or Between Meetings)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Trigger** | Hears the action item assigned in the meeting | External (video call) | "I need to capture that right now before the next agenda item." | Alert, slightly pressured | The narrow capture window — seconds — means any friction means the item is lost | TodoApp should be a persistent open tab requiring zero navigation to reach |
| **2. Switch & Type** | Alt-tabs to TodoApp, immediately begins typing the task | Input field (F0) | "Input's already focused. 'Share roadmap with sales by Thu' — done." | Efficient, in-the-zone | If the field is not focused, she must click — requires mouse, breaks keyboard flow, adds a visible gesture | Auto-focus on tab switch; keyboard input begins immediately with no mouse touch |
| **3. Submit** | Presses Enter | Input field → task list (F0, F1) | "Enter. It should appear instantly." | Anticipating | Any loading spinner or delay here is visible to meeting participants via screen share | Synchronous in-memory update + immediate localStorage write — no async, no spinner, sub-100 ms |
| **4. Return** | Alt-tabs back to the meeting | External (video call) | "Done. Back to the meeting. That took under 2 seconds." | Calm, re-engaged | If she had to confirm a save dialog or click a button, the round-trip doubles | The entire flow — switch, type, Enter, switch back — must be ≤ 2 seconds with keyboard only |

#### Key Moments

- **Decision Point — Stage 2 (Switch & Type):** The auto-focus behavior is the single most important micro-interaction for this persona in this scenario. Without it, the keyboard-only path breaks and she must reach for the mouse.
- **Risk of Abandonment — Stage 3 (Submit):** A loading state or any visible delay is catastrophically wrong for a meeting-mode capture. Synchronous rendering is required.
- **Delight Opportunity — Stage 4 (Return):** Completing the entire capture cycle in under 2 seconds, without her meeting peers noticing, is the app's killer feature for Priya. It replaces the unreliable "Slack DM to self" habit permanently.

#### Success Outcome

Priya captures a task during a live meeting in under 2 seconds, entirely via keyboard, with no perceptible loading state — and re-joins the meeting without losing her place (JTBD-02.2 success measure: task visible in list within 1 second of Enter keypress, no spinner).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Trigger | — (external) |
| Switch & Type | F0 (Add Task — auto-focused input) |
| Submit | F0 (Enter submission), F1 (immediate list update) |
| Return | — (external) |

---

### JRN-02.3: End-of-Day Reset — Clearing Completed Tasks for a Clean Tomorrow

**Persona:** PER-02 (Priya Nair)

**Scenario:** It is 5:45 PM on a Friday. Priya has 10 tasks in her list: 5 marked complete, 5 still pending. She does a quick end-of-day sweep to delete the completed items so Monday morning opens with only genuine outstanding work. She has at most 30 seconds before her next calendar event (end-of-day standup).

**Related Jobs:** JTBD-02.3 (Fast End-of-Day Reset for a Clean Tomorrow)

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Scan** | Opens TodoApp tab, reads the full list | Task list (F1) | "OK: five strikethrough items and five clean ones. Easy to tell." | Efficient, slightly tired | If the visual distinction between pending and completed is subtle, she has to slow down to parse the list | High-contrast strikethrough + muted colour makes completed items immediately distinguishable from pending |
| **2. Target Completed** | Visually groups all completed tasks to plan deletion order | Task list (F1) | "I'll delete from top to bottom — five quick clicks." | Deliberate, methodical | If completed tasks are scattered between pending tasks, tracking which to delete is harder | Consider grouping completed tasks together at the bottom of the list (future consideration; for now, rely on visual styling) |
| **3. Delete First Item** | Clicks the delete icon on the first completed task | Delete affordance (F3) | "Click — gone. That's fast." | Satisfied | Any confirmation dialog kills the rhythm immediately; she will stop mid-sweep | Instant deletion — no dialog, task disappears in under 100 ms, list reflows immediately |
| **4. Delete Remaining** | Repeats deletion for all 4 remaining completed tasks | Delete affordance × 4 (F3) | "Four more — tap, tap, tap, tap. Done." | In-flow, efficient | If the delete affordance is only visible on hover and hover targets are small, she slows down between clicks | Ensure delete icon is visible enough on mobile and desktop; hover state should not be the only trigger |
| **5. Verify Clean List** | Scans the final list to confirm only 5 pending tasks remain | Task list (F1) | "Five items. All pending. Perfect. Closed for the week." | Calm, accomplished | If a deleted task reappears on refresh (stale localStorage), tomorrow's "clean start" is ruined | Write to localStorage immediately on every deletion — deleted state must survive a refresh |

#### Key Moments

- **Decision Point — Stage 1 (Scan):** Priya decides whether to do the cleanup sweep at all based on how fast she can parse the list. Clear visual differentiation is a prerequisite — without it, she skips the sweep and next Monday is cluttered.
- **Risk of Abandonment — Stage 3 (Delete First Item):** A confirmation dialog on the first deletion will cause Priya to leave the remaining four completed tasks. She will not click through 5 confirmation dialogs under time pressure.
- **Delight Opportunity — Stage 5 (Verify Clean List):** The final view of a short, clean pending-only list is a micro-reward. It creates a closing ritual that reinforces daily use. This moment is worth optimising.

#### Success Outcome

Priya deletes all 5 completed tasks from a 10-item list in under 20 seconds, leaving exactly 5 pending tasks — and the clean list persists correctly on the following morning's browser open (JTBD-02.3 success measure: 10-item cleanup in ≤ 20 seconds; list persists immediately to localStorage).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Scan | F1 (View Task List — mixed state, visual differentiation) |
| Target Completed | F1 (list layout, completion styling) |
| Delete First Item | F3 (Delete Task — instant, no dialog) |
| Delete Remaining | F3 (Delete Task × 4) |
| Verify Clean List | F1 (View Task List — localStorage-persisted clean state) |

---

## Cross-Journey Patterns

### Shared Pain Points

- **Auto-focus is critical for both personas.** In JRN-01.2 (Marcus, mid-work capture) and JRN-02.2 (Priya, meeting-mode capture), the absence of input auto-focus breaks the keyboard-only flow that both personas depend on. This is not a nice-to-have — it is a P0 micro-interaction requirement.

- **Instant visual feedback on every action.** Across all 6 journeys, the transition from "user acts" to "UI confirms" must be sub-100 ms. JRN-01.2, JRN-02.2, and JRN-02.3 all identify delay as a top abandonment trigger. The synchronous in-memory update model (with immediate localStorage write) is the only acceptable pattern.

- **No confirmation dialogs on deletion.** JRN-01.3 (Marcus cleanup) and JRN-02.3 (Priya reset) both identify confirmation prompts as a clean-list-sweep killer. A single-click delete is non-negotiable for both personas across every cleanup scenario.

- **localStorage persistence on every state change.** JRN-02.1 (Priya restart), JRN-01.3 (Marcus refresh trust), and JRN-02.3 (Priya clean list survives weekend) all depend on writes that happen on every toggle and delete — not on unload or tab close.

### Shared Opportunities

- **A single, unified screen solves every journey.** Every journey across both personas begins and ends on one screen with the input field and the list coexisting. No navigation, no pages, no modals. This single-screen constraint is a feature, not a limitation.

- **Visual differentiation between pending and completed tasks pays dividends across personas.** Marcus uses it to decide what is left (JRN-01.3); Priya uses it to execute her deletion sweep (JRN-02.3) and to validate restoration (JRN-02.1). A single well-implemented strikethrough + muted-color pattern satisfies all three journeys.

- **Empty state is a trust signal.** Across JRN-01.1 (Marcus first use), JRN-02.3 (Priya clean list), and any post-deletion state, the empty state message is the user's confirmation that everything is gone intentionally — not lost. This message should be calm and clear, not alarming.

### Convergence Points

Both personas converge on the same core loop in nearly identical ways — the product has no "divergent persona flows." The only meaningful divergence is:
- **Marcus prioritises zero setup** (JRN-01.1) over everything else.
- **Priya prioritises persistence reliability** (JRN-02.1) and **speed of capture in constrained contexts** (JRN-02.2).

The implication: if auto-focus, instant rendering, and reliable localStorage are implemented correctly, both personas are fully satisfied by the same codebase with no branching UX logic required.

---

## Journey-to-JTBD Traceability

| Journey ID | Stage | JTBD ID | Expected Outcome |
|---|---|---|---|
| JRN-01.1 | Land | JTBD-01.1 | App loads with no login wall; input field visible immediately |
| JRN-01.1 | Orient | JTBD-01.1 | Input field is auto-focused; interface self-explanatory in under 5 seconds |
| JRN-01.1 | First Task | JTBD-01.1 | Enter key submits task; task appears in list within 1 second |
| JRN-01.1 | Verify | JTBD-01.1 | Task visible in list; empty state removed |
| JRN-01.1 | Continue | JTBD-01.1 | Full core loop completed within 60 seconds; blank Enter ignored |
| JRN-01.2 | Switch | JTBD-01.2 | Input field focused when tab is re-opened; no mouse required |
| JRN-01.2 | Type & Submit | JTBD-01.2 | Task submitted and visible within 1 second via keyboard only |
| JRN-01.2 | Verify (Glance) | JTBD-01.2 | New task visible at top of list with no scroll needed |
| JRN-01.2 | Return | JTBD-01.2 | Total round-trip (switch → type → Enter → verify) ≤ 5 seconds |
| JRN-01.3 | Review | JTBD-01.3 | Pending and completed tasks visually distinguishable at a glance |
| JRN-01.3 | Complete | JTBD-01.3 | One click toggles completion; strikethrough appears immediately |
| JRN-01.3 | Delete | JTBD-01.3 | One click removes task instantly; no confirmation dialog |
| JRN-01.3 | Survey | JTBD-01.3 | Remaining list shows only pending tasks; state persists on refresh |
| JRN-02.1 | Open Browser | JTBD-02.1 | Full task list renders from localStorage instantly on page load |
| JRN-02.1 | Scan for Accuracy | JTBD-02.1 | All tasks present; no missing items after browser restart |
| JRN-02.1 | Validate Completions | JTBD-02.1 | All completion states faithfully restored from localStorage |
| JRN-02.1 | Resume Work | JTBD-02.1 | Task insertion order preserved across sessions |
| JRN-02.2 | Switch & Type | JTBD-02.2 | Input auto-focused; typing begins without mouse touch |
| JRN-02.2 | Submit | JTBD-02.2 | Task visible in list within 1 second of Enter; no spinner |
| JRN-02.2 | Return | JTBD-02.2 | Full capture round-trip ≤ 2 seconds |
| JRN-02.3 | Delete First Item | JTBD-02.3 | Deletion is instant (< 100 ms); no confirmation dialog shown |
| JRN-02.3 | Delete Remaining | JTBD-02.3 | 5 deletions completable in under 20 seconds |
| JRN-02.3 | Verify Clean List | JTBD-02.3 | Clean list of only pending tasks persists to localStorage immediately |

---

*Document generated: 2026-05-07 | Based on: PERSONAS-TodoApp.md, JTBD-TodoApp.md, PRD-TodoApp.md, .planning/PROJECT.md | Feeds into: STORY-MAP-TodoApp.md, FRD-TodoApp.md, UserStories-TodoApp.md*
