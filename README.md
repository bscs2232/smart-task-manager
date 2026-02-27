# Task Manager — Productivity Dashboard

A Kanban-style task management app built with plain HTML, CSS, and Vanilla JavaScript. No frameworks, no libraries.

---

## Live Demo

[View on GitHub Pages](https://YOUR-USERNAME.github.io/smart-task-manager/)

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

## How to Run Locally

> You need a local server because of ES6 modules. Opening index.html directly won't work.

**Option 1 — VS Code Live Server (easiest)**
1. Install the "Live Server" extension by Ritwick Dey
2. Open the project folder in VS Code
3. Right-click `index.html` → Open with Live Server

**Option 2 — Python**
```bash
python -m http.server 8080
```

**Option 3 — Node.js**
```bash
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR-USERNAME/smart-task-manager.git
git push -u origin main
```

Then go to: **Settings → Pages → Source → Deploy from branch → main → Save**

---

## Author

Built by [Your Name] — [GitHub](https://github.com/YOUR-USERNAME)
