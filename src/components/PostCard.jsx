const PostCard = ({ title, price, seller, distance, image }) => (
  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600">{seller} • {distance}</p>
      <p className="text-green-600 font-bold mt-1">{price}</p>
      <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded">
        Message Seller
      </button>
    </div>
  </div>
);

export default PostCard;