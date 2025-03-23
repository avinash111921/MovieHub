import React from 'react';
import { Calendar } from 'lucide-react';

const upcomingMovies = [
  {
    id: 1,
    title: "Furiosa",
    genre: "Action, Adventure",
    releaseDate: "May 24, 2024",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    description: "The origin story of Furiosa, the iconic character from Mad Max: Fury Road."
  },
  {
    id: 2,
    title: "Inside Out 2",
    genre: "Animation, Comedy",
    releaseDate: "June 14, 2024",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    description: "The sequel to Pixar's beloved film about the emotions inside a young girl's mind."
  },
  {
    id: 3,
    title: "Deadpool 3",
    genre: "Action, Comedy",
    releaseDate: "July 26, 2024",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    description: "Wade Wilson returns in this highly anticipated third installment of the Deadpool series."
  }
];

function Upcoming() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Releases</h1>
      <div className="space-y-8">
        {upcomingMovies.map(movie => (
          <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={movie.image} alt={movie.title} className="w-full h-64 object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                <div className="flex items-center mb-4 text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{movie.releaseDate}</span>
                  <span className="mx-2">•</span>
                  <span>{movie.genre}</span>
                </div>
                <p className="text-gray-700 mb-4">{movie.description}</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upcoming;