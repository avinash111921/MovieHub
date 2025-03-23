import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';

const API_KEY = "b13184b3"; // Your OMDb API key
const API_URL = `https://www.omdbapi.com/?s=action&type=movie&apikey=${API_KEY}`; // Fetch action movies

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search.slice(0, 3)); // Show only 3 movies
      } else {
        setError("No movies found");
      }
    } catch (error) {
      setError("Error fetching movies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
            alt="Cinema"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
            <div className="px-8">
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to CineVerse</h2>
              <p className="text-xl text-white/90 max-w-2xl">
                Your ultimate destination for movie reviews, discussions, and discovering great films.
                Join our community of passionate movie enthusiasts!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>

        {loading && <p>Loading movies...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
