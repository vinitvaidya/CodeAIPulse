import { useState } from 'react'
import TaskCard from './TaskCard'

/**
 * @param {{
 *   tasks: Array,
 *   onAddTask: (title: string) => void,
 *   onCompleteTask: (id: string) => void,
 *   addingTask: boolean,
 *   addTaskError: string|null,
 *   completingId: string|null,
 *   tasksLoading: boolean,
 * }} props
 */
function TaskManager({ tasks, onAddTask, onCompleteTask, addingTask, addTaskError, completingId, tasksLoading }) {
  const [input, setInput] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const inProgress = tasks.filter(t => !t.completed)
  const completedToday = tasks.filter(t => t.completed && t.completed_at?.startsWith(today))

  const handleSubmit = (e) => {
    e.preventDefault()
    const title = input.trim()
    if (!title || addingTask) return
    onAddTask(title)
    setInput('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-5">Smart Task Manager</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What do you need to accomplish?"
          disabled={addingTask}
          className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={addingTask || !input.trim()}
          className="px-3 sm:px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap w-full sm:w-auto"
        >
          {addingTask ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Adding…
            </>
          ) : '+ Add Task'}
        </button>
      </form>

      {addTaskError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {addTaskError}
        </p>
      )}

      {tasksLoading ? (
        <div className="space-y-3 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="mb-6 mt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                In Progress ({inProgress.length})
              </p>
              <div className="space-y-3">
                {inProgress.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onCompleteTask}
                    completing={completingId === task.id}
                  />
                ))}
              </div>
            </section>
          )}

          {completedToday.length > 0 && (
            <section>
              <button
                onClick={() => setShowCompleted(prev => !prev)}
                className="flex items-center gap-2 w-full text-left mb-3 group"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                  Completed Today ({completedToday.length})
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-all ${showCompleted ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCompleted && (
                <div className="space-y-3">
                  {completedToday.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={onCompleteTask}
                      completing={false}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-16 sm:py-20 px-4 text-gray-400 mt-2 bg-gradient-to-b from-white to-gray-50 rounded-xl">
              <p className="text-5xl sm:text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>📋</p>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</h3>
              <p className="text-sm max-w-xs mx-auto">Add your first task above to get started on your productivity journey</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TaskManager
