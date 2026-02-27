/**
 * TaskManager.js
 * Manages all task data - adding, editing, deleting, filtering.
 * This is the "brain" of the app.
 */

import { Task }                 from './Task.js';
import { loadTasks, saveTasks } from './storage.js';

export class TaskManager {
  constructor() {
    // This array holds all task instances - it's the single source of truth
    this._tasks = [];

    // This callback is called whenever tasks change - used to update the UI
    this._onChange = null;

    // Load any saved tasks when the app starts
    this._loadFromStorage();
  }

  // Load saved tasks and convert plain objects back into Task instances
  _loadFromStorage() {
    const savedData = loadTasks();
    this._tasks = savedData.map((obj) => {
      try {
        return Task.fromJSON(obj);
      } catch (err) {
        // Skip any corrupted task data
        return null;
      }
    }).filter(Boolean); // remove any nulls
  }

  // Save tasks and trigger a UI re-render
  _commit() {
    saveTasks(this._tasks.map((t) => t.toJSON()));
    if (typeof this._onChange === 'function') {
      this._onChange();
    }
  }

  // Register a function to run whenever tasks change
  onTasksChange(fn) {
    this._onChange = fn;
  }

  // Add a new task
  addTask(data) {
    const task = new Task(data);
    this._tasks.push(task);
    this._commit();
    return task;
  }

  // Update an existing task by its ID
  updateTask(id, changes) {
    const task = this._tasks.find((t) => t.id === id);
    if (!task) return null;
    task.update(changes);
    this._commit();
    return task;
  }

  // Delete a task by ID
  deleteTask(id) {
    const index = this._tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this._tasks.splice(index, 1);
    this._commit();
    return true;
  }

  // Move task to a different column
  moveTask(id, newStatus) {
    this.updateTask(id, { status: newStatus });
  }

  // Get all tasks (returns a copy so the original can't be accidentally changed)
  getAllTasks() {
    return [...this._tasks];
  }

  // Get tasks filtered by search text and/or status
  getFilteredTasks(query = '', status = 'all') {
    const searchText = query.toLowerCase().trim();

    return this._tasks
      .filter((task) => {
        if (status !== 'all' && task.status !== status) return false;
        if (searchText) {
          const matches = task.title.toLowerCase().includes(searchText) ||
                         task.description.toLowerCase().includes(searchText);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // Calculate progress stats using reduce()
  getStats() {
    const total   = this._tasks.length;
    const done    = this._tasks.reduce((count, t) => t.status === 'done' ? count + 1 : count, 0);
    const pending = total - done;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pending, percent };
  }
}
