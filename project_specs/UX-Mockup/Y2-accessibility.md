---

## Accessibility Notes

**Standard:** WCAG 2.1 Level AA
**User Stories:** US-2.4, US-3.4 (explicit accessibility ACs)
**PRD NFR:** "Keyboard-navigable; all interactive elements have accessible labels; sufficient color contrast"

---

### 1. Keyboard Navigation

The complete task lifecycle — add, view, complete, delete — must be operable without a mouse.

#### Tab Order

```
[Add Input]  →  [Add Button]  →  [Task 1: Checkbox]  →  [Task 1: Delete Button]
  →  [Task 2: Checkbox]  →  [Task 2: Delete Button]  →  ... (repeating per task)
```

| Element | Tab Stop | Activation Key |
|---------|----------|---------------|
| Add Input | Yes | Enter = submit task |
| Add Button | Yes | Enter / Space = submit task |
| Completion Checkbox | Yes | Space = toggle (native checkbox behaviour) |
| Delete Button | Yes | Enter / Space = delete task |
| Empty State message | No (not interactive) | — |
| Inline validation message | No (announced via `role="alert"`) | — |
| Storage banner | No (informational) | — |
| Toast | No (informational; auto-dismisses) | — |

#### Focus Management Rules

| Action | Focus Destination After |
|--------|------------------------|
| Successful task add | Add Input (re-focused) |
| Blank submission rejected | Add Input (focus stays) |
| Long submission rejected | Add Input (focus stays) |
| Checkbox toggled | Same checkbox (re-focused after re-render) |
| Task deleted (next task exists) | Next task's Delete Button |
| Task deleted (no next task, previous exists) | Previous task's Delete Button |
| Last task deleted (list now empty) | Add Input |

*(US-2.4: "After a toggle via keyboard, focus returns to the toggled checkbox")*
*(US-3.4: "After deletion, keyboard focus moves to a logical adjacent element")*

#### Focus Indicators

- All interactive elements must have a **visible focus ring** when focused via keyboard.
- The focus ring must meet WCAG 2.1 AA contrast requirements (minimum 3:1 ratio between focus indicator and adjacent background).
- *(US-3.4 AC: "The delete button has a visible focus indicator that meets WCAG 2.1 AA contrast requirements")*
- Do not use `outline: none` without providing an equivalent custom focus style.

---

### 2. ARIA Labels

| Element | `aria-label` / Role | Dynamic? | Rule |
|---------|---------------------|----------|------|
| Add Input | `aria-label="Add a new task"` or descriptive `<label>` | No | Associates label with input |
| Add Button | `aria-label="Add task"` (if no visible label text) or button text "Add" | No | Button text is sufficient if present |
| Completion Checkbox | `aria-label="Mark complete"` (pending) / `aria-label="Mark incomplete"` (completed) | **Yes — updates on every re-render** | Reflects current actionable state |
| Delete Button | `aria-label="Delete task"` | No | Describes the action |
| Inline Validation | `role="alert"` | No | Screen reader announces message immediately on insertion |
| Storage Banner | `role="alert"` | No | Announced on page load if shown |
| Toast | `role="alert"` | No | Announced immediately when injected into DOM |
| Task List Container | `<ul>` or `<ol>` with implicit list role | No | Semantic list element is sufficient |
| Empty State | `<li>` or `<p>` within list — no special ARIA needed | No | Plain text; screen reader reads naturally |

*(US-2.4 AC: "Each checkbox has aria-label='Mark complete' when pending; 'Mark incomplete' when completed")*

---

### 3. Color Contrast

| Element | Minimum Contrast Ratio | Notes |
|---------|----------------------|-------|
| Pending task text | 4.5:1 (text vs. background) | WCAG 1.4.3 AA for normal text |
| Completed task text (muted, 0.5 opacity) | 3:1 or higher after opacity applied | Use a muted color that still meets 3:1 against background, not pure opacity |
| Empty state message text | 4.5:1 | Secondary text but must still be readable |
| Inline validation error text | 4.5:1 | Error messages must be clearly readable |
| Placeholder text in Add Input | 3:1 (placeholder text WCAG relaxed threshold) | Use a sufficiently contrasted placeholder |
| Focus ring | 3:1 (focus indicator vs adjacent background) | WCAG 2.1 1.4.11 Non-text contrast |
| Delete Button icon `×` | 3:1 (icon vs. background) | Non-text contrast threshold |

**Important note on completed task opacity:**
Using `opacity: 0.5` on the entire task item reduces contrast dynamically based on the background. To reliably meet WCAG AA at 3:1, consider using a fixed muted color value (e.g. `color: #767676` on white background = 4.54:1) **instead of or in addition to** opacity reduction. Do not rely solely on `opacity: 0.5` to differentiate completed tasks — also use `text-decoration: line-through` as a second non-color indicator.

---

### 4. Screen Reader Behaviour

| User Action | Screen Reader Should Announce |
|-------------|-------------------------------|
| Page load | Page title + Add Input label (auto-focused, so announced first) |
| Empty state on load | "No tasks yet. Add one above!" (as part of list) |
| Blank submission | "Task cannot be empty." (via `role="alert"` on inline validation span) |
| Long submission | "Task must be 500 characters or fewer." (via `role="alert"`) |
| Successful task add | New task item in list; list now has N items (SR may announce count on re-render) |
| Checkbox toggle (pending → complete) | Checkbox now checked; `aria-label` = "Mark incomplete" |
| Checkbox toggle (complete → pending) | Checkbox now unchecked; `aria-label` = "Mark complete" |
| Task deleted | Item removed from list; focus moves to next element (announced by SR) |
| Storage unavailable banner | "Note: tasks won't be saved in this browser session." (via `role="alert"`) |
| Storage write failure toast | "Unable to save. Try again." (via `role="alert"`) |

---

### 5. Touch Target Sizes

| Element | Minimum Size | Reference |
|---------|-------------|-----------|
| Completion Checkbox (visual + padding) | 44 × 44 px | WCAG 2.5.5 |
| Delete Button (visual + padding) | 44 × 44 px | WCAG 2.5.5 |
| Add Button | 44 × 44 px | WCAG 2.5.5 |
| Add Input height | 44 px minimum | Consistent with button |

Use CSS padding on the checkbox and delete button to expand the clickable/tappable area beyond the visible icon size without enlarging the icon visually.

---

### 6. Non-Color Differentiation

Tasks must be distinguishable between pending and completed by means **other than color alone** (WCAG 1.4.1):

| Differentiator | Pending | Completed |
|---------------|---------|-----------|
| Text decoration | None | `text-decoration: line-through` |
| Color / opacity | Full contrast | Muted (reduced, but meeting 3:1 minimum) |
| Checkbox state | Unchecked | Checked |
| `aria-label` | "Mark complete" | "Mark incomplete" |

The strikethrough text decoration is the primary non-color differentiator. Color and opacity are secondary reinforcements.

---
