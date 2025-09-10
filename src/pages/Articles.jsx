import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const articles = [
    {
      id: 1,
      title: "How to Grow Organic Tomatoes",
      summary: "Learn best practices for pesticide-free farming.",
      image: "https://via.placeholder.com/300x200?text=Tomatoes+Article",
    },
    {
      id: 2,
      title: "Sustainable Irrigation Methods",
      summary: "Save water while maximizing crop yield.",
      image: "https://via.placeholder.com/300x200?text=Irrigation",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Educational Articles</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
};

export default Articles;