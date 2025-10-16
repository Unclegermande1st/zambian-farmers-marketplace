import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const articles = [
    {
      id: 1,
      title: "How to Grow Organic Tomatoes",
      summary: "Learn best practices for pesticide-free farming.",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400",
    },
    {
      id: 2,
      title: "Sustainable Irrigation Methods",
      summary: "Save water while maximizing crop yield.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      id: 3,
      title: "Pest Control Without Chemicals",
      summary: "Natural methods to protect your crops from pests.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    },
    {
      id: 4,
      title: "Soil Health and Composting",
      summary: "Build healthy soil for stronger, more productive crops.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    },
    {
      id: 5,
      title: "Crop Rotation Strategies",
      summary: "Improve soil fertility and reduce disease with smart rotation.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      id: 6,
      title: "Maximizing Small Farm Profits",
      summary: "Business strategies for small-scale farming success.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-medium">Learning Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agricultural Knowledge Center</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Expert guides and resources to help you grow better crops and build a successful farming business
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-green-600 mb-1">{articles.length}+</h3>
            <p className="text-gray-600 font-medium">Expert Articles</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-blue-600 mb-1">500+</h3>
            <p className="text-gray-600 font-medium">Farmers Helped</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-purple-600 mb-1">100%</h3>
            <p className="text-gray-600 font-medium">Practical Tips</p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">Latest Articles</h2>
          </div>
          <p className="text-gray-600 mb-8">Browse our collection of farming guides and best practices</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Want More Farming Tips?</h2>
            <p className="text-xl opacity-90 mb-8">
              Subscribe to our newsletter and get weekly farming insights delivered to your inbox
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;