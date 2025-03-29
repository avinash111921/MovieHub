import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar, Tag } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY; // Your OMDb API Key
      const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === "True") {
          setMovie(data);
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  if (!movie) return <p className="text-center text-red-500">Movie not found!</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.Title}</h1>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{movie.imdbRating}/10</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{movie.Runtime}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-1" />
                  <span>{movie.Year}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-5 h-5 mr-1" />
                  <span>{movie.Genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-gray-700">{movie.Plot}</p>
          <h2 className="text-2xl font-bold mt-6 mb-4">Cast & Crew</h2>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;


/* {"Title":"The Dark Knight","Year":"2008","Rated":"PG-13",
"Released":"18 Jul 2008","Runtime":"152 min",
"Genre":"Action, Crime, Drama","Director":"Christopher Nolan",
"Writer":"Jonathan Nolan, Christopher Nolan, David S. Goyer",
"Actors":"Christian Bale, Heath Ledger, Aaron Eckhart",
"Plot":"When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.",
"Language":"English, Mandarin","Country":"United States, United Kingdom","Awards":"Won 2 Oscars. 164 wins & 165 nominations total",
"Poster":"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
"Ratings":[{"Source":"Internet Movie Database","Value":"9.0/10"},
{"Source":"Rotten Tomatoes","Value":"94%"},{"Source":"Metacritic","Value":"84/100"}],
"Metascore":"84","imdbRating":"9.0","imdbVotes":"2,997,696","imdbID":"tt0468569",
"Type":"movie","DVD":"N/A","BoxOffice":"$534,987,076","Production":"N/A",
"Website":"N/A","Response":"True"} */
