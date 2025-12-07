## Task Tracker

Small CLI to manage to‑do tasks from the terminal, written in TypeScript.

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

- **Add task**:
  - `node dist/App.js add "My new task"`

- **Update task title**:
  - `node dist/App.js update title <taskId> "New title"`

- **Change task status** (`pending`, `in_progress`, `completed`, `cancelled`):
  - `node dist/App.js update status <taskId> <status>`

- **Delete task**:
  - `node dist/App.js delete <taskId>`

### Data persistence
- Tasks are stored in a local JSON file:
  - `data/tasks.json`
- No external database needs to be running.
