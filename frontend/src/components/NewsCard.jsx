/**
 * @param {{ news: array|null, loading: boolean, error: string|null, onRefresh: function }} props
 */
function NewsCard({ news, loading, error, onRefresh }) {
  return (
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 shadow-md">
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📰</span>
            <h2 className="text-base font-semibold text-gray-700">Latest AI News</h2>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Refresh news"
          >
            {loading ? '⟳ Loading...' : '⟳ Refresh'}
          </button>
        </div>

        {error && !loading && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!loading && (!news || news.length === 0) && (
          <p className="text-gray-500 text-sm italic">No news available at the moment.</p>
        )}

        {!loading && news && news.length > 0 && (
          <div className="space-y-3">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition cursor-pointer border border-blue-100 hover:border-blue-300"
              >
                <p className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{item.content}</p>
                <p className="text-xs text-blue-500 mt-1 font-medium">{item.source}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsCard
