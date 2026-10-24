export default function SearchBar({ value, onChange }) {
  return (
    <section className="w-full max-w-xl mx-auto mb-5 sm:mb-6">
      <div className="relative group">
        <label htmlFor="search-photographer" className="sr-only">
          Search photographers by name
        </label>

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#7C3AED] transition-colors">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input Field */}
        <input
          id="search-photographer"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="Search photographers by name..."
          className="w-full pl-10.5 pr-4 sm:pl-11.5 sm:pr-5 py-2.5 sm:py-3 bg-white text-[#1E1B4B] placeholder:text-slate-400 text-sm sm:text-base rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/15 transition-all duration-200"
        />
      </div>
    </section>
  )
}
