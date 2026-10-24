export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFBF8]/95 backdrop-blur-md border-b border-slate-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Custom Camera Icon */}
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white shadow-sm shadow-purple-500/20">
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B4B]">
            Photo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">
              Gallery
            </span>
          </span>
        </div>
      </div>
    </header>
  )
}
