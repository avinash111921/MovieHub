import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard.jsx';
import { Search, TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const API_KEY = "b13184b3"; // Your OMDb API key
const GENRES = ['action', 'comedy', 'thriller', 'romance', 'sci-fi', 'adventure'];

// Video URL for hero background
const HERO_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-watching-a-movie-in-the-cinema-510-large.mp4";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('action');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ref to store all fetched movies to avoid duplicates
  const allMoviesRef = useRef(new Set());

  // Ref for horizontal scroll container
  const scrollContainerRef = useRef(null);

  const fetchMovies = useCallback(async (resetMovies = false) => {
    if (loading && !resetMovies) return;
    
    setLoading(true);
    try {
      // Use search query if provided, otherwise use selected genre
      const query = searchQuery || selectedGenre;
      const currentPage = resetMovies ? 1 : page;
      const API_URL = `https://www.omdbapi.com/?s=${query}&type=movie&page=${currentPage}&apikey=${API_KEY}`;
      
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.Response === "True") {
        // Filter out duplicates
        const newMovies = data.Search.filter(movie => !allMoviesRef.current.has(movie.imdbID));
        
        // Add new movie IDs to our Set
        newMovies.forEach(movie => {
          allMoviesRef.current.add(movie.imdbID);
        });
        
        if (resetMovies) {
          setMovies(newMovies);
          setPage(2);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
          setPage(prev => prev + 1);
        }
        
        // Check if we've reached the end of available movies
        setHasMore(newMovies.length > 0 && page < Math.ceil(data.totalResults / 10));
      } else {
        if (resetMovies) {
          setMovies([]);
        }
        setHasMore(false);
        if (page === 1) {
        setError("No movies found");
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Error fetching movies");
    } finally {
      setLoading(false);
    }
  }, [loading, page, selectedGenre, searchQuery]);

  useEffect(() => {
    // Reset and fetch when selected genre changes
    allMoviesRef.current = new Set();
    fetchMovies(true);
  }, [selectedGenre]);

  // Handle scroll by button clicks
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      
      // Load more movies when scrolling near the end
      if (scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth > 
          scrollContainerRef.current.scrollWidth - 500) {
        if (hasMore && !loading) {
          fetchMovies();
        }
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      allMoviesRef.current = new Set();
      fetchMovies(true);
    }
  };

  const handleGenreChange = (genre) => {
    setSearchQuery('');
    setSelectedGenre(genre);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <motion.section 
        className="relative h-[575px] overflow-hidden -mt-[72px] " // Negative margin to remove gap
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
            {/* Fallback image if video fails to load */}
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
            alt="Cinema"
              className="w-full h-full object-cover"
            />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900/90 flex items-center justify-center pt-[72px]">
            <div className="container mx-auto px-6 py-12 text-center">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">CineVerse</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Your ultimate destination for movie reviews, discussions, and discovering great films.
                Join our community of passionate movie enthusiasts!
              </motion.p>
              
              <motion.form 
                onSubmit={handleSearch}
                className="max-w-lg mx-auto flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <input 
                  type="text" 
                  placeholder="Search for movies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none px-4 py-2 text-white placeholder-white/70"
                />
                <motion.button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  <span>Search</span>
                </motion.button>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Genre Selection */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-3">
            {GENRES.map((genre) => (
              <motion.button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Movies Horizontal Scroll Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="flex items-center mb-8 space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {searchQuery ? (
            <h2 className="text-3xl font-bold">Search Results for "{searchQuery}"</h2>
          ) : (
            <>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold capitalize">{selectedGenre} Movies</h2>
            </>
          )}
        </motion.div>

        {error && !movies.length ? (
          <motion.div 
            className="bg-red-50 text-red-500 rounded-lg p-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <div className="relative">
            {/* Scroll buttons */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-6 no-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={(e) => {
                // Load more when scrolling near the end
                if (e.target.scrollLeft + e.target.clientWidth > e.target.scrollWidth - 500) {
                  if (hasMore && !loading) {
                    fetchMovies();
                  }
                }
              }}
            >
              <motion.div 
                className="flex space-x-6 min-w-max"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {movies.map((movie, index) => (
                  <div key={movie.imdbID} className="w-[220px]">
                    <MovieCard movie={movie} index={index} />
                  </div>
                ))}
                
                {/* Loading indicator */}
                {loading && (
                  <div className="w-[220px] flex items-center justify-center">
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}

        {/* Second row of movies - Most Popular */}
        <motion.div 
          className="flex items-center my-12 space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Star className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold">Most Popular</h2>
        </motion.div>

        <div className="relative">
          {/* Scroll buttons for second row */}
          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                const secondRow = scrollContainerRef.current.nextElementSibling.querySelector('.overflow-x-auto');
                secondRow.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <div 
            className="overflow-x-auto pb-6 no-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            <motion.div 
              className="flex space-x-6 min-w-max"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* We're reusing the same movies but could fetch a different set */}
              {movies.slice(0, Math.min(15, movies.length)).map((movie, index) => (
                <div key={`popular-${movie.imdbID}`} className="w-[220px]">
                  <MovieCard movie={movie} index={index} />
                </div>
              ))}
            </motion.div>
          </div>
          
          <button 
            onClick={() => {
              if (scrollContainerRef.current) {
                const secondRow = scrollContainerRef.current.nextElementSibling.querySelector('.overflow-x-auto');
                secondRow.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
