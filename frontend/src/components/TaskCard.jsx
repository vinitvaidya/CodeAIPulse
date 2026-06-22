import { useState } from 'react'

/**
 * @param {{ task: object, onComplete: (id: string) => void, completing: boolean }} props
 */
function TaskCard({ task, onComplete, completing }) {
  const [checked, setChecked] = useState({})

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 transition-all duration-300 animate-slide-up ${
      task.completed
        ? 'border-t border-r border-b border-l-4 border-gray-100 border-l-green-400'
        : 'border-t border-r border-b border-l-4 border-gray-100 border-l-indigo-500'
    }`}>
      <div className="flex items-start gap-2 mb-3">
        {task.completed && (
          <span className="text-green-500 font-bold mt-0.5 flex-shrink-0 text-base">✓</span>
        )}
        <h3 className={`font-semibold text-sm leading-snug ${
          task.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}>
          {task.title}
        </h3>
      </div>

      {!task.completed && task.subtasks?.length > 0 && (
        <ul className="space-y-2 mb-4 pl-1">
          {task.subtasks.map((sub, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 cursor-pointer"
              onClick={() => toggle(i)}
            >
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 accent-indigo-600 cursor-pointer flex-shrink-0"
                onClick={e => e.stopPropagation()}
              />
              <span className={`text-sm leading-snug transition-colors ${
                checked[i] ? 'line-through text-gray-400' : 'text-gray-600'
              }`}>
                {sub}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!task.completed && (
        <button
          onClick={() => onComplete(task.id)}
          disabled={completing}
          className="w-full py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {completing ? 'Completing…' : '✓ Complete Task'}
        </button>
      )}
    </div>
  )
}

export default TaskCard
