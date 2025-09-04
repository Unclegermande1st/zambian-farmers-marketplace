import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Mock data fetch (replace with real API)
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: "Organic Tomatoes",
        price: "$5/kg",
        seller: "Green Valley Farm",
        distance: "10km away",
        image: "https://via.placeholder.com/300x200?text=Tomatoes",
      },
      {
        id: 2,
        title: "Fresh Eggs",
        price: "$3/dozen",
        seller: "Happy Hens Co-op",
        distance: "5km away",
        image: "https://via.placeholder.com/300x200?text=Eggs",
      },
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace Feed</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Home;