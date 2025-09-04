const ArticleCard = ({ title, summary, image }) => (
  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{summary}</p>
      <button className="mt-3 text-green-600 font-semibold">
        Read More →
      </button>
    </div>
  </div>
);

export default ArticleCard;