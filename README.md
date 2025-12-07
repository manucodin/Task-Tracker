## Task Tracker

Small CLI to manage to‑do tasks from the terminal, written in TypeScript.

> This project is based on the [Task Tracker CLI project](https://roadmap.sh/projects/task-tracker) from [roadmap.sh](https://roadmap.sh).

### Requirements
- **Node.js** >= 18
- **npm**

### Installation
- **Install dependencies**:
  - `npm install`
- **Build to JavaScript**:
  - `npm run build`

### Basic usage (CLI)
All commands are executed from the project root:

- **List tasks** (default command):
  - `node dist/App.js`
  - `node dist/App.js list`
  - `node dist/App.js list <status>` - Filter tasks by status (`todo`, `done`, `in-progress`)

- **Add task**:
  - `node dist/App.js add "My new task"`

- **Update task title**:
  - `node dist/App.js update <taskId> "New title"`

- **Mark task as done**:
  - `node dist/App.js mark-done <taskId>`

- **Mark task as in progress**:
  - `node dist/App.js mark-in-progress <taskId>`

- **Delete task**:
  - `node dist/App.js delete <taskId>`

### Task Status
Tasks can have one of the following statuses:
- `todo` - Task is pending (default status for new tasks)
- `in-progress` - Task is currently being worked on
- `done` - Task is completed

### Data persistence
- Tasks are stored in a local JSON file:
  - `data/tasks.json`
- No external database needs to be running.

### Development
- **Run tests**:
  - `npm test`
- **Run tests in watch mode**:
  - `npm run test:watch`
- **Run tests with coverage**:
  - `npm run test:coverage`
- **Run in development mode**:
  - `npm run dev`
