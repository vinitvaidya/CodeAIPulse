import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ totalCount: number }} props
 */
function DailyInsights({ totalCount }) {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const remaining = Math.max(0, 3 - totalCount)

  const getInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/insights`)
      if (!res.ok) throw new Error('Failed to fetch insights')
      const data = await res.json()
      setInsights(data.insights)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Daily Insights</h2>

      {totalCount < 3 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
          <span className="text-3xl mb-3">🔒</span>
          <p className="text-sm text-gray-400">
            Add {remaining} more task{remaining !== 1 ? 's' : ''} to unlock insights.
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={getInsights}
            disabled={loading}
            className="w-full py-2.5 px-3 sm:px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="hidden sm:inline">Analysing…</span>
                <span className="sm:hidden">Wait…</span>
              </>
            ) : '✨ Get Insights'}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {insights && !loading && (
            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {insights}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DailyInsights
