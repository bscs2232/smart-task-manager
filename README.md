# Task Manager — Productivity Dashboard

A Kanban-style task management app built with plain HTML, CSS, and Vanilla JavaScript. No frameworks, no libraries.

---

## Live Demo

[View on GitHub Pages](https://bscs2232.github.io/smart-task-manager/)

---

## Features

- Add, edit, and delete tasks
- Three columns: Todo, In Progress, Done
- Drag and drop tasks between columns
- Tasks saved to localStorage (data stays after refresh)
- Real-time search
- Filter by status
- Progress bar showing completion percentage
- Dark and light mode toggle
- Fully responsive (works on mobile and desktop)

---

## Project Structure

```
smart-task-manager/
│
├── index.html       # Main HTML file
├── style.css        # All styles
├── README.md
│
└── js/
    ├── app.js           # Entry point, starts the app
    ├── Task.js          # Task class (data model)
    ├── TaskManager.js   # Business logic (add, edit, delete, filter)
    ├── storage.js       # localStorage helper functions
    └── ui.js            # DOM rendering and event handling
```

---

## JavaScript Concepts Used

- ES6 Classes (Task, TaskManager, UI)
- ES6 Modules (import / export)
- async / await with Fetch API
- Array methods: map, filter, reduce, find, sort
- DOM manipulation
- Event delegation
- Drag and Drop API
- localStorage
- Error handling with try/catch
- Separation of concerns (MVC-style structure)

---
Built by [Muhammad Huzaifa Bilal] — [GitHub](https://github.com/bscs2232)
