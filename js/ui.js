/**
 * ui.js
 * Handles all DOM rendering and user interactions.
 * This file never changes data directly - it calls TaskManager methods.
 */

import { saveTheme, loadTheme } from './storage.js';

export class UI {
  constructor(taskManager) {
    this.tm = taskManager;
    this.currentQuery  = '';
    this.currentFilter = 'all';

    // Cache DOM elements - helper to reduce repetition
    const el = (id) => document.getElementById(id);

    this.$modalOverlay = el('modalOverlay');
    this.$taskForm     = el('taskForm');
    this.$taskId       = el('taskId');
    this.$taskTitle    = el('taskTitle');
    this.$taskDesc     = el('taskDesc');
    this.$taskPriority = el('taskPriority');
    this.$taskDue      = el('taskDue');
    this.$taskStatus   = el('taskStatus');
    this.$modalTitle   = el('modalTitle');
    this.$submitBtn    = el('submitBtn');
    this.$titleError   = el('titleError');
    this.$searchInput  = el('searchInput');
    this.$filterSelect = el('filterSelect');
    this.$themeToggle  = el('themeToggle');
    this.$progressBar  = el('progressBar');
    this.$progressText = el('progressText');
    this.$statTotal    = el('statTotal');
    this.$statDone     = el('statDone');
    this.$statPending  = el('statPending');
    this.$toast        = el('toast');

    // Column containers and counts
    this.$cols = {
      todo:       el('col-todo'),
      inprogress: el('col-inprogress'),
      done:       el('col-done'),
    };

    this.$counts = {
      todo:       el('countTodo'),
      inprogress: el('countInprogress'),
      done:       el('countDone'),
    };
  }

  // Start the UI - apply theme, attach events, and do the first render
  init() {
    this._applyTheme(loadTheme());
    this._attachEvents();
    this._render();
  }

  // ─── Attach all event listeners ───────────────────────────

  _attachEvents() {
    // Modal controls
    document.getElementById('openModalBtn').addEventListener('click', () => this._openModal());
    
    const closeModal = () => this._closeModal();
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
    
    this.$modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.$modalOverlay) this._closeModal();
    });

    // Form and search
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleFormSubmit();
    });

    this.$searchInput.addEventListener('input', (e) => {
      this.currentQuery = e.target.value;
      this._render();
    });

    this.$filterSelect.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this._render();
    });

    // Theme toggle
    this.$themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this._applyTheme(next);
      saveTheme(next);
    });

    // Task card actions (edit/delete)
    document.getElementById('board').addEventListener('click', (e) => {
      const editBtn   = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');

      if (editBtn) {
        this._openModal(editBtn.closest('[data-task-id]').dataset.taskId);
      }

      if (deleteBtn) {
        const id = deleteBtn.closest('[data-task-id]').dataset.taskId;
        this.tm.deleteTask(id);
        this._showToast('Task deleted.');
      }
    });

    // Drag and drop
    this._setupDragAndDrop();
  }

  // ─── Rendering ────────────────────────────────────────────

  // Main render - called after every state change
  _render() {
    const statusesToRender = this.currentFilter === 'all' 
      ? ['todo', 'inprogress', 'done']
      : [this.currentFilter];
    
    statusesToRender.forEach((status) => {
      this._renderColumn(status, this.tm.getFilteredTasks(this.currentQuery, status));
    });

    // Hide columns that shouldn't be shown
    if (this.currentFilter !== 'all') {
      ['todo', 'inprogress', 'done'].forEach((status) => {
        this.$cols[status].closest('.column').style.display = 
          statusesToRender.includes(status) ? 'block' : 'none';
      });
    } else {
      ['todo', 'inprogress', 'done'].forEach((status) => {
        this.$cols[status].closest('.column').style.display = 'block';
      });
    }

    this._renderStats();
  }

  // Render one column's tasks
  _renderColumn(status, tasks) {
    const container  = this.$cols[status];
    const countBadge = this.$counts[status];

    countBadge.textContent = tasks.length;

    if (tasks.length === 0) {
      container.innerHTML = '<div class="empty-msg">No tasks here</div>';
      return;
    }

    // Build HTML for all cards and inject at once
    container.innerHTML = tasks.map((task) => this._buildCardHTML(task)).join('');

    // Add drag event listeners to each card
    container.querySelectorAll('.task-card').forEach((card) => {
      this._addDragListeners(card);
    });
  }

  // Build the HTML string for a single task card
  _buildCardHTML(task) {
    const desc = task.description ? `<p class="card-desc">${this._escapeHTML(task.description)}</p>` : '';
    const dueDate = task.dueDate 
      ? `<span class="due-date ${task.isOverdue ? 'overdue' : ''}">
         ${task.isOverdue ? 'Overdue: ' : ''}${task.dueDateLabel}</span>`
      : '';

    return `
      <div class="task-card ${task.status === 'done' ? 'task-done' : ''}"
           data-task-id="${task.id}" data-status="${task.status}" 
           data-priority="${task.priority}" draggable="true">
        <div class="card-top">
          <span class="card-title">${this._escapeHTML(task.title)}</span>
          <div class="card-actions">
            <button class="card-btn" data-action="edit" title="Edit">Edit</button>
            <button class="card-btn delete-btn" data-action="delete" title="Delete">Del</button>
          </div>
        </div>
        ${desc}
        <div class="card-footer">
          <span class="priority-tag ${task.priority}">${task.priority}</span>
          ${dueDate}
        </div>
      </div>`;
  }

  // Update the progress bar and stat numbers
  _renderStats() {
    const { total, done, pending, percent } = this.tm.getStats();

    this.$progressBar.style.width  = percent + '%';
    this.$progressText.textContent = `${done} of ${total} tasks done (${percent}%)`;
    this.$statTotal.textContent    = total;
    this.$statDone.textContent     = done;
    this.$statPending.textContent  = pending;
  }

  // ─── Modal ────────────────────────────────────────────────

  _openModal(taskId = null) {
    this._clearErrors();
    this.$taskForm.reset();

    if (taskId) {
      const task = this.tm.getAllTasks().find((t) => t.id === taskId);
      if (!task) return;

      this.$modalTitle.textContent = 'Edit Task';
      this.$submitBtn.textContent  = 'Save Changes';
      this.$taskId.value           = task.id;
      this.$taskTitle.value        = task.title;
      this.$taskDesc.value         = task.description;
      this.$taskPriority.value     = task.priority;
      this.$taskDue.value          = task.dueDate;
      this.$taskStatus.value       = task.status;
    } else {
      this.$modalTitle.textContent = 'Add New Task';
      this.$submitBtn.textContent  = 'Add Task';
      this.$taskId.value           = '';
    }

    this.$modalOverlay.hidden = false;
    setTimeout(() => this.$taskTitle.focus(), 50);
  }

  _closeModal() {
    this.$modalOverlay.hidden = true;
    this.$taskForm.reset();
    this._clearErrors();
  }

  // ─── Form submit ──────────────────────────────────────────

  _handleFormSubmit() {
    if (!this._validate()) return;

    const data = {
      title:       this.$taskTitle.value,
      description: this.$taskDesc.value,
      priority:    this.$taskPriority.value,
      dueDate:     this.$taskDue.value,
      status:      this.$taskStatus.value,
    };

    try {
      if (this.$taskId.value) {
        this.tm.updateTask(this.$taskId.value, data);
        this._showToast('Task updated!');
      } else {
        this.tm.addTask(data);
        this._showToast('Task added!');
      }
      this._closeModal();
    } catch (err) {
      this._showToast(err.message);
    }
  }

  _validate() {
    this._clearErrors();
    if (!this.$taskTitle.value.trim()) {
      this.$titleError.textContent = 'Please enter a title.';
      this.$taskTitle.classList.add('invalid');
      this.$taskTitle.focus();
      return false;
    }
    return true;
  }

  _clearErrors() {
    this.$titleError.textContent = '';
    this.$taskTitle.classList.remove('invalid');
  }

  // ─── Drag and Drop ────────────────────────────────────────

  _setupDragAndDrop() {
    Object.entries(this.$cols).forEach(([status, colEl]) => {
      const col = colEl.closest('.column');
      
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
      });

      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          col.classList.remove('drag-over');
        }
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');

        const id = e.dataTransfer.getData('text/plain');
        const originalStatus = e.dataTransfer.getData('original-status');

        if (id && originalStatus !== status) {
          this.tm.moveTask(id, status);
          this._showToast('Task moved!');
        }
      });
    });
  }

  _addDragListeners(card) {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.taskId);
      e.dataTransfer.setData('original-status', card.dataset.status);
      requestAnimationFrame(() => card.classList.add('dragging'));
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.column').forEach((col) => {
        col.classList.remove('drag-over');
      });
    });
  }

  // ─── Theme ────────────────────────────────────────────────

  _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.$themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  // ─── Toast ────────────────────────────────────────────────

  _showToast(message) {
    this.$toast.textContent = message;
    this.$toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.$toast.classList.remove('show');
    }, 2500);
  }

  // ─── Helpers ──────────────────────────────────────────────

  // Prevent XSS: escape user input before inserting into the page
  _escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}
