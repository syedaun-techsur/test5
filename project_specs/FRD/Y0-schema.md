---

## Y0: Data Schema

TodoApp uses no relational database. All data is stored in the browser's `localStorage` as a single JSON-serialised array under a fixed key. This section defines the complete data model.

---

### Storage Key

| Key | Type | Description |
|-----|------|-------------|
| `"todoapp_tasks"` | `string` (JSON) | JSON-serialised array of `Task` objects. Absent on first use; created on first task add. |

---

### Task Object

Each element in the stored array conforms to the following shape:

```json
{
  "id":        "<UUID v4 string>",
  "text":      "<string, 1–500 chars, trimmed>",
  "completed": false,
  "createdAt": "<ISO 8601 UTC datetime string>"
}
```

#### Field Definitions

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 format; globally unique within the array | Immutable primary key assigned at creation |
| `text` | `string` | Yes | 1–500 characters (trimmed); no surrounding whitespace stored | The user-visible task description |
| `completed` | `boolean` | Yes | `true` or `false` only | Task completion state; toggled by F02 |
| `createdAt` | `string` | Yes | ISO 8601 UTC format e.g. `"2026-05-07T14:30:00.000Z"` | Timestamp of task creation; immutable after creation |

---

### Full Storage Layout Example

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-07T09:00:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "text": "Call the dentist",
    "completed": true,
    "createdAt": "2026-05-07T09:05:00.000Z"
  }
]
```

---

### Constraints & Invariants

- The stored value MUST be valid JSON at all times. The Storage Module always serialises with `JSON.stringify` and parses with `JSON.parse`.
- The array is **ordered by insertion**: index 0 is the oldest task; the newest task is always appended to the end.
- **No duplicate IDs** are permitted within the array. UUID v4 generation makes collisions astronomically unlikely; no deduplication check is required.
- Fields `id` and `createdAt` are **immutable** after creation — no operation modifies them.
- If `localStorage` is unavailable (private browsing, storage quota exceeded), the app degrades to in-memory-only state for the current session. See `Y2-errors.md §STORAGE_UNAVAILABLE`.
- The Storage Module MUST validate that each parsed element has all four required fields before using it; malformed entries are silently dropped and not rendered.

---

### Migration / Versioning

- v1 does not include a schema version field. If a schema version is added in a future version, a `schemaVersion` field will be added to the root level of the stored structure.
- In v1, any stored object missing required fields is discarded on load.

---
