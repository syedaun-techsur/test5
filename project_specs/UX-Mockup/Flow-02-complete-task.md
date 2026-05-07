---

## Flow 02: Complete / Un-complete Task

**Trigger:** User clicks (or activates via keyboard) the Completion Checkbox on a task item.
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4
**Journeys:** JRN-01.3 (Complete stage), JRN-02.1 (Validate Completions stage)

```
[Task Item visible in Task List]
    │
    │  User clicks checkbox  ─OR─  focuses checkbox via Tab + presses Space/Enter
    ▼
[Event: checkbox click / keydown on Completion Checkbox]
    │
    ▼
[Read data-task-id from parent Task Item]
    │
    ▼
[toggleTask(taskId)]
    │
    ├── taskId not found in Task Array (defensive no-op)
    │       │
    │       └──▶ [Console error logged; UI unchanged]
    │
    └── taskId found
            │
            ▼
        [Flip task.completed: false → true  ─OR─  true → false]
            │
            ▼
        [writeTasks(updatedArray) → localStorage]  ← write FIRST
            │
            ▼
        [renderTaskList(updatedArray)]
            │
            ├── task.completed now true
            │       │
            │       ▼
            │   [Task Item: CSS class task--completed added]
            │   [Strikethrough text + 0.5 opacity applied]
            │   [Checkbox aria-label → "Mark incomplete"]
            │   [Checkbox appears checked]
            │
            └── task.completed now false
                    │
                    ▼
                [Task Item: CSS class task--completed removed]
                [Full contrast text, no strikethrough]
                [Checkbox aria-label → "Mark complete"]
                [Checkbox appears unchecked]
            │
            ▼
        [Focus returned to toggled checkbox]
            (keyboard users maintain position)
```

### Steps

1. **Checkbox Interaction**
   - Each Task Item renders a `<input type="checkbox">` as the leftmost element.
   - `checked` attribute reflects `task.completed` at render time.
   - Click target must meet minimum 44 × 44 px touch/click target (WCAG 2.5.5).
   - *(US-2.1 AC: "Each task item renders a checkbox whose checked state matches the task's current completed field")*

2. **Toggle Logic**
   - System reads `data-task-id` from the Task Item wrapping element.
   - `toggleTask(taskId)` flips `task.completed` in the in-memory Task Array.
   - **Write before render**: localStorage is updated before `renderTaskList` is called.
   - *(US-2.1 AC: "The updated state is written to localStorage before the UI re-renders")*

3. **Mark Complete (pending → complete)**
   - Checkbox becomes checked.
   - `task--completed` CSS class applied to Task Item.
   - Text renders with `text-decoration: line-through` and `opacity: 0.5`.
   - `aria-label` on checkbox updates to `"Mark incomplete"`.
   - *(US-2.1 AC: "The task immediately displays the completed visual treatment")*

4. **Un-complete (complete → pending)**
   - Checkbox becomes unchecked.
   - `task--completed` CSS class removed from Task Item.
   - Text returns to full contrast, no strikethrough.
   - `aria-label` on checkbox updates to `"Mark complete"`.
   - *(US-2.2 AC: "The task immediately reverts to the pending visual style")*

5. **Persistence**
   - Because localStorage is written on every toggle, completion states survive page refresh and browser restart.
   - *(US-2.3 AC: "After marking a task complete, a page refresh shows that task still in the completed state")*

6. **Focus Management (Keyboard)**
   - After re-render, focus is returned to the toggled checkbox so keyboard users do not lose their position in the list.
   - *(US-2.4 AC: "After a toggle via keyboard, focus returns to the toggled checkbox so the user does not lose position")*

### UI Elements Involved

| Element | Role | Behaviour on Toggle |
|---------|------|---------------------|
| Completion Checkbox `<input type="checkbox">` | Toggle control | `checked` reflects `completed`; `aria-label` updates on each render |
| Task Item `<li>` | Task container | Receives/loses `task--completed` class |
| Task Text `<span class="task-item__text">` | Text display | Inherits strikethrough + opacity from `task--completed` class |

### States During This Flow

| Task State | Checkbox | Text Style | `aria-label` | CSS Class |
|-----------|----------|-----------|-------------|-----------|
| Pending | Unchecked | Full contrast, no decoration | `"Mark complete"` | `task-item` |
| Completed | Checked | Strikethrough + 0.5 opacity | `"Mark incomplete"` | `task-item task--completed` |
| Toggle in progress | — (synchronous, no interim state) | — | — | — |
| Storage write failure | Reverted to pre-toggle state | Pre-toggle style | Pre-toggle label | Pre-toggle class |

### Storage Write Failure (Edge Case)

If `writeTasks()` throws (quota exceeded / storage disabled mid-session):
- The `completed` flip is **reverted** in memory.
- `renderTaskList` re-renders to the **pre-toggle** state.
- A toast notification appears: `"Unable to save. Try again."`
- Auto-dismisses after 4 seconds.
- *(FRD Y2: STORAGE_WRITE_FAIL)*

---
