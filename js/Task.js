/**
 * Task.js
 * Represents a single task using a Class.
 */

export class Task {
  constructor({
    id          = Task.generateId(),
    title,
    description = '',
    status      = 'todo',
    priority    = 'medium',
    dueDate     = '',
    createdAt   = Date.now(),
  }) {
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty.');
    }

    this.id          = id;
    this.title       = title.trim();
    this.description = description.trim();
    this.status      = status;
    this.priority    = priority;
    this.dueDate     = dueDate;
    this.createdAt   = createdAt;
  }

  // Generate a unique ID using timestamp + random string
  static generateId() {
    return 'task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  }

  // Rebuild a Task instance from a plain object (used when loading from localStorage)
  static fromJSON(obj) {
    return new Task(obj);
  }

  // Check if task is overdue (past due date and not done)
  get isOverdue() {
    if (!this.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(this.dueDate) < today && this.status !== 'done';
  }

  // Return a readable date like "Dec 5"
  get dueDateLabel() {
    if (!this.dueDate) return '';
    const date = new Date(this.dueDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Update one or more fields on the task
  update(changes) {
    const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
    allowed.forEach((key) => {
      if (changes[key] !== undefined) {
        this[key] = typeof changes[key] === 'string' ? changes[key].trim() : changes[key];
      }
    });
    return this;
  }

  // Convert to plain object so it can be saved as JSON
  toJSON() {
    return {
      id:          this.id,
      title:       this.title,
      description: this.description,
      status:      this.status,
      priority:    this.priority,
      dueDate:     this.dueDate,
      createdAt:   this.createdAt,
    };
  }
}
