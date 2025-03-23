import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.imdbID}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
        <img src={movie.Poster} alt={movie.Title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{movie.Title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{movie.imdbRating || "7.3"}/10</span>
            </div>
            <span className="text-gray-600">{movie.Year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default MovieCard;
