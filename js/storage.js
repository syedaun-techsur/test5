// storage.js — localStorage persistence (stub)
// Phase 2 implements these bodies.

const STORAGE_KEY = 'todo-tasks';

/**
 * Persist tasks array to localStorage.
 * @param {Array<{id: string, text: string, completed: boolean}>} tasks
 */
export function saveTasks(tasks) {
  throw new Error('saveTasks: not yet implemented');
}

/**
 * Load and return tasks array from localStorage.
 * Returns an empty array if nothing is stored.
 * @returns {Array<{id: string, text: string, completed: boolean}>}
 */
export function loadTasks() {
  throw new Error('loadTasks: not yet implemented');
}
