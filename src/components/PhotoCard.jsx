export default function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(49,46,129,0.08)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Photograph Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={photo.download_url || photo.url}
          alt={`Photograph captured by ${photo.author}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Heart Icon Button Positioned Over Photograph */}
        <button
          type="button"
          onClick={() => onToggleFavorite(photo.id)}
          aria-label={
            isFavorite
              ? `Remove ${photo.author}'s photo from favorites`
              : `Add ${photo.author}'s photo to favorites`
          }
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 ${
            isFavorite
              ? 'bg-[#EC4899] text-white shadow-pink-500/40 hover:bg-[#db2777]'
              : 'bg-white/85 text-slate-500 hover:text-[#EC4899] hover:bg-white'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isFavorite ? 'scale-110' : 'group-hover/btn:scale-110'
            }`}
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavorite ? 0 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Author Name and Details Beneath Photograph */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8B5CF6]">
            Photographer
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-[#1E1B4B] truncate mt-0.5" title={photo.author}>
            {photo.author}
          </h3>
        </div>
      </div>
    </article>
  )
}
