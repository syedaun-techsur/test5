---

## Flow 03: Delete Task

**Trigger:** User clicks (or activates via keyboard) the Delete Button on a task item.
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4
**Journeys:** JRN-01.3 (Delete stage), JRN-02.3 (Delete First Item + Delete Remaining stages)

```
[Task Item visible in Task List]
    │
    │  User clicks "×" / trash icon  ─OR─  focuses Delete Button via Tab + presses Enter/Space
    ▼
[Event: click / keydown on Delete Button]
    │
    ▼
[Read data-task-id from parent Task Item]
    │
    ▼
[deleteTask(taskId)] — NO confirmation dialog
    │
    ├── taskId not found in Task Array (defensive no-op)
    │       │
    │       └──▶ [Console error logged; UI unchanged]
    │
    └── taskId found
            │
            ▼
        [Filter task from in-memory Task Array]
            │
            ▼
        [writeTasks(filteredArray) → localStorage]  ← write FIRST
            │
            ▼
        [renderTaskList(filteredArray)]
            │
            ├── filteredArray.length > 0
            │       │
            │       ▼
            │   [Task list re-renders without deleted item]
            │   [Focus moves to next task, or previous task,
            │    or Add Input if list now empty]
            │
            └── filteredArray.length === 0
                    │
                    ▼
                [Empty state: "No tasks yet. Add one above!"]
                [Add Input remains visible and focused]
```

### Steps

1. **Delete Button Placement & Visibility**
   - Each Task Item renders a Delete Button as the rightmost element.
   - The Delete Button displays a `"×"` character or a trash-can icon.
   - It must be **always visible** (not hover-only) to support mobile touch and rapid deletion sweeps.
   - Minimum 44 × 44 px touch/click target.
   - *(US-3.1 AC: "Each task item renders a delete button (labelled '×' or a trash icon) with aria-label='Delete task'")*

2. **Deletion — No Confirmation**
   - Clicking the Delete Button immediately triggers `deleteTask(taskId)`.
   - **No confirmation dialog is shown.** Ever.
   - Deletion is permanent and irreversible in v1.
   - *(US-3.1 AC: "No confirmation dialog is displayed before deletion")*
   - *(JRN-01.3, JRN-02.3 Risk: "A confirmation dialog here is a known drop-off trigger")*

3. **Write Before Render**
   - The filtered Task Array is written to localStorage **before** `renderTaskList` is called.
   - Ensures the deletion survives an immediate page refresh.
   - *(US-3.3 AC: "After deleting a task, a full page refresh does NOT restore that task")*

4. **Re-render After Deletion**
   - `renderTaskList` is called with the filtered array.
   - The deleted task item disappears from the DOM within 100 ms of the click.
   - All other tasks remain in their original order with their original states.
   - *(US-3.1 AC: "The task list re-renders without the deleted item within 100 ms of the click")*
   - *(US-3.1 AC: "All other tasks remain unmodified")*

5. **Empty State After Last Deletion**
   - If the filtered array is empty, `renderTaskList` renders: `"No tasks yet. Add one above!"`.
   - The Add Input remains visible and focused.
   - *(US-3.2 AC: "Deleting the last task in the list causes the empty-state message to appear")*
   - *(US-3.2 AC: "The Add Input remains visible and focused so I can immediately start a fresh list")*

6. **Focus Management (Keyboard)**
   - After deletion, keyboard focus moves in this priority order:
     1. Next task's Delete Button (if a task below the deleted one exists)
     2. Previous task's Delete Button (if the deleted task was at the bottom)
     3. Add Input (if the list is now empty)
   - *(US-3.4 AC: "After deletion, keyboard focus moves to a logical adjacent element")*

### UI Elements Involved

| Element | Role | Behaviour on Delete |
|---------|------|---------------------|
| Delete Button `<button class="task-item__delete">` | Trigger deletion | `aria-label="Delete task"`; always visible; no confirm |
| Task Item `<li data-task-id="...">` | Deleted unit | Removed from DOM after write-then-render |
| Task List Container `<ul>` | List host | Re-rendered; shows empty state if array empty |
| Add Input | Next action affordance | Focused after last task is deleted |

### States During This Flow

| Scenario | Before Delete | After Delete |
|----------|--------------|-------------|
| Delete one of many tasks | N task items | N-1 task items; others unchanged |
| Delete last remaining task | 1 task item | Empty state: "No tasks yet. Add one above!" |
| Delete completed task | Task with `task--completed` styling | Task removed; list re-renders correctly |
| Delete pending task | Task with default styling | Task removed; list re-renders correctly |
| Storage write failure | N task items | Deletion reverted; N task items shown; toast: "Unable to save. Try again." |

### Rapid Deletion Sweep (Priya's End-of-Day Reset Pattern)

For the scenario where a user deletes 5+ completed tasks in sequence (JRN-02.3):
- The Delete Button must be always-visible (never hover-only), so each successive click requires no mouse re-positioning.
- Each deletion completes in < 100 ms, making rapid successive clicks smooth.
- No dialog, no animation delay between deletions.
- After each deletion, the list immediately re-renders — the next item's Delete Button is in a predictable position.

---
