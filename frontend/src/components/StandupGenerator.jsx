import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ completedCount: number }} props
 */
function StandupGenerator({ completedCount }) {
  const [standup, setStandup] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/standup`)
      if (!res.ok) throw new Error('Failed to generate standup')
      const data = await res.json()
      setStandup(data.standup)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(standup)
    setCopied(true)
    setShowCopyFeedback(true)
    setTimeout(() => setCopied(false), 2000)
    setTimeout(() => setShowCopyFeedback(false), 2300)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Standup Generator</h2>

      {completedCount < 1 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
          <span className="text-3xl mb-3">🔒</span>
          <p className="text-sm text-gray-400">Complete at least 1 task to generate your standup.</p>
        </div>
      ) : (
        <>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-2.5 px-3 sm:px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="hidden sm:inline">Generating…</span>
                <span className="sm:hidden">Wait…</span>
              </>
            ) : '⚡ Generate Standup'}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {standup && !loading && (
            <div className="mt-4">
              <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-100 font-mono leading-relaxed whitespace-pre-line">
                <span className="text-indigo-400 select-none mr-2">$</span>{standup}
              </div>
              <button
                onClick={copyToClipboard}
                className={`mt-3 w-full py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  copied
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <span className={showCopyFeedback ? 'animate-fade-out' : ''}>
                  {copied ? '✓ Copied!' : <span><span className="hidden sm:inline">📋 Copy to Clipboard</span><span className="sm:hidden">Copy</span></span>}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StandupGenerator
