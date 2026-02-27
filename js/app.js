/**
 * app.js
 * Entry point - starts the app and connects all modules together.
 */

import { TaskManager } from './TaskManager.js';
import { UI }          from './ui.js';

// Sample tasks shown on first visit (before user creates any tasks)
// These are plain English tasks a developer might actually have
const SAMPLE_TASKS = [
  {
    title:       'Set up project folder structure',
    description: 'Create folders for HTML, CSS, and JS files. Add a README file.',
    status:      'done',
    priority:    'high',
    dueDate:     '',
  },
  {
    title:       'Design the main navigation bar',
    description: 'Make it responsive and include links to all main pages.',
    status:      'done',
    priority:    'medium',
    dueDate:     '',
  },
  {
    title:       'Build the task card component',
    description: 'Each card should show title, priority, and due date.',
    status:      'inprogress',
    priority:    'high',
    dueDate:     '',
  },
  {
    title:       'Add drag and drop between columns',
    description: 'Use the HTML5 Drag and Drop API. No libraries allowed.',
    status:      'inprogress',
    priority:    'medium',
    dueDate:     '',
  },
  {
    title:       'Connect localStorage to save tasks',
    description: 'Tasks should still be there after the page is refreshed.',
    status:      'todo',
    priority:    'high',
    dueDate:     '',
  },
  {
    title:       'Add search and filter functionality',
    description: 'User should be able to search tasks by title or description.',
    status:      'todo',
    priority:    'medium',
    dueDate:     '',
  },
  {
    title:       'Write the README for GitHub',
    description: 'Include setup instructions, features list, and screenshots.',
    status:      'todo',
    priority:    'low',
    dueDate:     '',
  },
];

// Main function that starts the app
function initApp() {
  // 1. Create the task manager (loads any saved tasks from localStorage)
  const taskManager = new TaskManager();

  // 2. Create the UI and give it access to the task manager
  const ui = new UI(taskManager);

  // 3. Tell the task manager to re-render the UI whenever tasks change
  taskManager.onTasksChange(() => {
    ui._render();
  });

  // 4. If this is the first visit (no saved tasks), load the sample tasks
  if (taskManager.getAllTasks().length === 0) {
    loadSampleTasks(taskManager);
  }

  // 5. Start the UI
  ui.init();
}

// Load sample tasks on first visit
function loadSampleTasks(taskManager) {
  SAMPLE_TASKS.forEach((taskData) => {
    try {
      taskManager.addTask(taskData);
    } catch (err) {
      console.warn('Skipped invalid task:', err.message);
    }
  });
}

// Wait for the page to fully load before starting
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
