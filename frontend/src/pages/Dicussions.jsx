import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { ShopContext } from '../context/ShopContext.jsx';

const discussions = [
  {
    id: 1,
    title: "The ending of Oppenheimer explained",
    author: "MovieBuff123",
    date: "2 hours ago",
    comments: 32,
    likes: 156,
    excerpt: "Let's break down the complex ending of Oppenheimer and its historical implications..."
  },
  {
    id: 2,
    title: "Best sci-fi movies of 2024 so far",
    author: "FilmFanatic",
    date: "5 hours ago",
    comments: 45,
    likes: 203,
    excerpt: "From Dune: Part Two to other groundbreaking releases, 2024 is shaping up to be an amazing year for sci-fi..."
  },
  {
    id: 3,
    title: "Oscar predictions 2024",
    author: "CinemaExpert",
    date: "1 day ago",
    comments: 128,
    likes: 342,
    excerpt: "With the Academy Awards approaching, here are my predictions for all major categories..."
  }
];

function Discussions() {
  const { token } = useContext(ShopContext); // Get token from context
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check if the user is logged in
    const storedToken = localStorage.getItem('token');

    if (token || storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/login'); // Redirect if not logged in
    }

    setLoading(false); // Stop loading
  }, [token, navigate]); // Depend on token

  if (loading) return <p>Loading...</p>; // Prevent UI flickering

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Discussions</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Start New Discussion
        </button>
      </div>
      <div className="space-y-6">
        {discussions.map(discussion => (
          <div key={discussion.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold mb-2 text-purple-900 hover:text-purple-700 cursor-pointer">
              {discussion.title}
            </h2>
            <p className="text-gray-600 mb-4">{discussion.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Posted by {discussion.author}</span>
                <span>•</span>
                <span>{discussion.date}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{discussion.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{discussion.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discussions;
