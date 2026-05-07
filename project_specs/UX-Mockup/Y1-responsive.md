---

## Responsive Considerations

TodoApp is a single-screen application with a minimal layout. Responsive design is straightforward: the layout column narrows on smaller viewports but the component order and hierarchy remain identical across breakpoints.

---

### Desktop (> 1024 px)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              ┌──────────────────────────────────────────────┐   │
│              │           Simple To-Do App                   │   │
│              ├─────────────────────────────────┬────────────┤   │
│              │  Add Input (text field)         │  Add Btn   │   │
│              ├─────────────────────────────────┴────────────┤   │
│              │ ○  Task text here...                  [ × ]  │   │
│              │ ☑  ~~Completed task~~          (muted)[ × ]  │   │
│              │ ○  Another pending task               [ × ]  │   │
│              └──────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- **Max content width:** ~600–700 px, centered horizontally on wide viewports.
- Wide margins on either side — no need to stretch to full browser width.
- Add Input and Add Button on the same row.
- Delete Buttons always visible on right edge of each task item.
- Comfortable vertical spacing between task items.

---

### Tablet (768 px – 1024 px)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         ┌──────────────────────────────────┐     │
│         │        Simple To-Do App          │     │
│         ├────────────────────────┬─────────┤     │
│         │  Add Input             │  Add    │     │
│         ├────────────────────────┴─────────┤     │
│         │ ○  Task text here...      [ × ]  │     │
│         │ ☑  ~~Done task~~  (muted) [ × ]  │     │
│         │ ○  Pending task           [ × ]  │     │
│         └──────────────────────────────────┘     │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout identical to desktop; content column narrows to fit viewport.
- Add Input still shares a row with Add Button — sufficient horizontal space.
- Touch targets already sized at 44 × 44 px — no additional changes required.
- No layout changes needed vs. desktop.

---

### Mobile (< 768 px)

```
┌────────────────────────────────────────┐
│         Simple To-Do App              │
├──────────────────────────┬────────────┤
│  Add Input               │  Add Btn   │  ← Same row, full width
├──────────────────────────┴────────────┤
│                                       │
│ ○  Task text here...          [ × ]   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│ ☑  ~~Completed task~~  (muted)[ × ]   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│ ○  Pending task               [ × ]   │
│                                       │
└────────────────────────────────────────┘
```

**Key mobile adjustments:**

| Element | Mobile Behaviour | Rationale |
|---------|----------------|-----------|
| Add Input + Add Button | Same row; input fills remaining width; button fixed width | Preserves single-row layout; avoids stacked submit |
| Task Item height | Increased minimum row height (min 48–56 px) | Comfortable touch tap target for checkbox and delete |
| Checkbox | 44 × 44 px minimum tap target (padding around `<input>`) | WCAG 2.5.5; fat-finger-safe |
| Delete Button | 44 × 44 px minimum tap target; always visible | No hover state on touch — must be permanently visible |
| Task text | Wraps naturally; no truncation | Short tasks stay single-line; longer tasks wrap gracefully |
| Inline validation | Below Add Input; full width | Readable on narrow viewports |
| Toast | Top-center or bottom-center on mobile (not corner) | Corners can be obscured by system chrome on mobile |
| Storage banner | Full-width at top | Consistent with desktop; easy to dismiss by reading |
| Empty state | Centered in list area; font size readable | Same copy; slightly larger padding on mobile |

**Input keyboard on mobile:**
- Tapping the Add Input opens the software keyboard.
- The task list scrolls to keep the Add Input in view (standard browser scroll-to-focused behaviour).
- After adding a task, focus returns to Add Input — software keyboard stays open, allowing rapid task entry.
- *(US-0.1, US-0.2: "The Add Input is cleared and refocused after successful submission")*

---

### Breakpoint Summary

| Breakpoint | Max Content Width | Add Row | Task Item Height | Delete Visibility |
|------------|-----------------|---------|-----------------|------------------|
| Desktop > 1024 px | 600–700 px centered | Input + Button on same row | ~40 px | Always visible |
| Tablet 768–1024 px | ~90% of viewport | Input + Button on same row | ~44 px | Always visible |
| Mobile < 768 px | Full viewport width with padding | Input + Button on same row | ~48–56 px | Always visible |

---
