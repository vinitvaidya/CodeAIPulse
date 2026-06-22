import { useState, useEffect } from 'react'
import Header from './components/Header'
import BriefingCard from './components/BriefingCard'
import TaskManager from './components/TaskManager'
import StandupGenerator from './components/StandupGenerator'
import DailyInsights from './components/DailyInsights'
import NewsCard from './components/NewsCard'

const API = 'http://localhost:8000'

function App() {
  const [tasks, setTasks] = useState([])
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [briefingError, setBriefingError] = useState(null)
  const [tasksLoading, setTasksLoading] = useState(true)
  const [addingTask, setAddingTask] = useState(false)
  const [addTaskError, setAddTaskError] = useState(null)
  const [completingId, setCompletingId] = useState(null)
  const [news, setNews] = useState(null)
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(null)

  const fetchBriefing = async () => {
    setBriefingLoading(true)
    setBriefingError(null)
    try {
      const res = await fetch(`${API}/briefing`)
      if (!res.ok) throw new Error('Failed to fetch briefing')
      setBriefing(await res.json())
    } catch (err) {
      setBriefingError(err.message)
    } finally {
      setBriefingLoading(false)
    }
  }

  const fetchNews = async () => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const res = await fetch(`${API}/news`)
      if (!res.ok) throw new Error('Failed to fetch news')
      const data = await res.json()
      setNews(data.news || [])
    } catch (err) {
      setNewsError(err.message)
    } finally {
      setNewsLoading(false)
    }
  }

  const fetchTasks = async () => {
    setTasksLoading(true)
    try {
      const res = await fetch(`${API}/tasks`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
    } catch (err) {
      console.error('Tasks error:', err)
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
    fetchTasks()
    fetchNews()
  }, [])

  const handleAddTask = async (title) => {
    setAddingTask(true)
    setAddTaskError(null)
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status} — is the backend running?`)
      const task = await res.json()
      setTasks(prev => [task, ...prev])
    } catch (err) {
      setAddTaskError(err.message === 'Failed to fetch'
        ? 'Cannot reach the backend. Make sure it is running on port 8000.'
        : err.message)
    } finally {
      setAddingTask(false)
    }
  }

  const handleCompleteTask = async (id) => {
    setCompletingId(id)
    try {
      const res = await fetch(`${API}/tasks/${id}/complete`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to complete task')
      const updated = await res.json()
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    } catch (err) {
      console.error('Complete task error:', err)
    } finally {
      setCompletingId(null)
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const completedToday = tasks.filter(t => t.completed && t.completed_at?.startsWith(today))

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <Header onRefreshBriefing={fetchBriefing} briefingLoading={briefingLoading} />

        <div className="mt-6">
          <BriefingCard briefing={briefing} loading={briefingLoading} error={briefingError} />
        </div>

        <div className="mt-6">
          <NewsCard news={news} loading={newsLoading} error={newsError} onRefresh={fetchNews} />
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-[60%]">
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onCompleteTask={handleCompleteTask}
              addingTask={addingTask}
              addTaskError={addTaskError}
              completingId={completingId}
              tasksLoading={tasksLoading}
            />
          </div>
          <div className="w-full lg:w-[40%] flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col flex-1 min-h-0">
              <StandupGenerator completedCount={completedToday.length} />
            </div>
            <div className="flex flex-col flex-1 min-h-0">
              <DailyInsights totalCount={tasks.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
