Create a CLAUDE.md file for this project called CodeAIPulse.

Project Description:
CodeAIPulse is a personal AI productivity web app. Users get a morning briefing,
manage smart tasks (AI breaks tasks into subtasks), generate standups from
completed tasks, and view daily insights.

Tech Stack:

Backend: Python FastAPI, runs on port 8000, data stored in backend/data/
  as JSON files (tasks.json, briefing.json). Use python-dotenv for env vars.
Frontend: React with Vite, Tailwind CSS, runs on port 5173.
  Use fetch() for API calls to http://localhost:8000.
  No external state management — useState and useEffect only.
  Tailwind setup is version-dependent — check the installed version before
  configuring. v3 uses tailwind.config.js + three @tailwind directives in CSS.
  v4 uses @import "tailwindcss" in CSS and the @tailwindcss/vite plugin; no
  config file is needed. Always check package.json to determine which applies.
AI: Use the Google Gemini SDK (google-generativeai) with gemini-2.0-flash.
  API key from GEMINI_API_KEY env var.


Code Standards:

- Python: type hints on all functions, docstrings on all public functions,
  black formatting, no bare except blocks
- React: functional components only, props typed with JSDoc,
  loading and error states on every API call
- File naming: snake_case for Python, PascalCase for React components

Key Files:

- backend/main.py — FastAPI entry point
- backend/data/ — JSON storage directory
- frontend/src/App.jsx — main React component
- frontend/src/components/ — React components directory

Always run "uvicorn main:app --reload" from backend/ to start the server.
Always run "npm run dev" from frontend/ to start the React app.