# CodeAIPulse

A personal AI productivity web app powered by Google Gemini. Get AI-driven morning briefings, intelligent task breakdown, automated standup generation, and daily insights—all in one place.

## ✨ Features

### AI-Powered Insights
- **Morning Briefing**: Start your day with an AI-generated overview of your tasks and priorities
- **Smart Task Management**: Let AI automatically break down complex tasks into actionable subtasks
- **Standup Generator**: Generate professional standup summaries from your completed tasks with a single click
- **Daily Insights**: Gain AI-driven analytics on your productivity patterns

### Intuitive Task Management
- Manage tasks with automatic AI-powered decomposition
- Track completed tasks and generate reports
- View your daily productivity dashboard

## 🤖 AI Technology

CodeAIPulse uses **Google Gemini 2.0 Flash** as its AI backbone, providing:
- Fast, intelligent task analysis and breakdown
- Natural language processing for standup generation
- Context-aware morning briefings
- Real-time insights

## 🛠 Tech Stack

**Backend:**
- Python FastAPI
- JSON-based data storage
- Environment-based configuration

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- Fetch API for backend communication

**AI:**
- Google Gemini SDK (`google-generativeai`)
- Model: `gemini-2.0-flash`

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CodeAIPulse.git
   cd CodeAIPulse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   uvicorn main:app --reload
   ```
   Backend runs on `http://localhost:8000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📋 Project Structure

```
CodeAIPulse/
├── backend/
│   ├── main.py           # FastAPI entry point
│   ├── data/             # JSON storage (tasks, briefings)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   └── components/   # React components
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 📝 Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Create tasks and let AI break them down
4. View your morning briefing
5. Generate standups from completed tasks

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:
```
GEMINI_API_KEY=your_google_gemini_api_key
```

## 📦 Code Standards

- **Python**: Type hints, docstrings, Black formatting
- **React**: Functional components, JSDoc props typing, loading/error states
- **File Naming**: `snake_case` for Python, `PascalCase` for React components

## 🤝 Contributing

Contributions are welcome! Please ensure code follows the project standards above.

## 📄 License

MIT

---

Built with ❤️ and AI
