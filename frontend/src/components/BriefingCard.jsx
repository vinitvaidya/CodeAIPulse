/**
 * @param {{ width?: string }} props
 */
function SkeletonLine({ width = 'w-full' }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${width}`} />
}

/**
 * @param {{ briefing: object|null, loading: boolean, error: string|null }} props
 */
function BriefingCard({ briefing, loading, error }) {
  return (
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-md">
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌅</span>
          <h2 className="text-base font-semibold text-gray-700">Morning Briefing</h2>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <SkeletonLine width="w-1/3" />
                <SkeletonLine />
                <SkeletonLine width="w-4/5" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {briefing && !loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Quote</p>
              <p className="text-gray-800 text-sm italic leading-relaxed">"{briefing.quote}"</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Focus Tip</p>
              <p className="text-gray-800 text-sm leading-relaxed">{briefing.focus_tip}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2">Message</p>
              <p className="text-gray-800 text-sm leading-relaxed">{briefing.message}</p>
            </div>
            {briefing.web_tip && (
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Web Tip</p>
                <p className="text-gray-800 text-sm leading-relaxed">{briefing.web_tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BriefingCard
