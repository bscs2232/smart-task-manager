/**
 * storage.js
 * Handles saving and loading data from localStorage.
 */

const TASKS_KEY = 'taskmanager_tasks';
const THEME_KEY = 'taskmanager_theme';

// Load tasks from localStorage - returns empty array if nothing saved
export function loadTasks() {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Could not load tasks from storage:', err.message);
    return [];
  }
}

// Save tasks to localStorage
export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Could not save tasks:', err.message);
    return false;
  }
}

// Save the user's theme preference
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// Load the saved theme, default to light
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
