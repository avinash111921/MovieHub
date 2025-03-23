import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    movie: "Dune: Part Two",
    rating: 4.8,
    author: "Sarah Johnson",
    date: "March 15, 2024",
    content: "An epic continuation of the Dune saga that surpasses the first part in every way. The visual effects and sound design are absolutely stunning.",
    image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    movie: "Poor Things",
    rating: 4.5,
    author: "Michael Chen",
    date: "March 10, 2024",
    content: "A bizarre and beautiful film that challenges conventions. Emma Stone delivers a career-defining performance.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
  }
];

function Reviews() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Reviews</h1>
      <div className="space-y-8">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={review.image} alt={review.movie} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{review.movie}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{review.rating}/5.0</span>
                  </div>
                  <span className="text-gray-600">by {review.author} • {review.date}</span>
                </div>
                <p className="text-gray-700">{review.content}</p>
                {/* <button className="mt-4 text-purple-600 font-semibold hover:text-purple-800">
                  Read full review →
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;