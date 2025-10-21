const ArticleCard = ({ title, summary, image }) => (
  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Badge */}
      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
        Farming Tips
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      {/* Title */}
      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
        {title}
      </h3>

      {/* Summary */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {summary}
      </p>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <button className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all duration-300">
          <span>Read More</span>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>

        {/* Minimal engagement icons */}
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>230</span>
          </div>
          <div className="flex items-center gap-1 hover:text-pink-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>42</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ArticleCard;
