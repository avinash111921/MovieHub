import React, { useEffect, useState } from 'react';
import { Calendar, Star, Info, X, Film } from 'lucide-react';
import { axiosInstance } from '../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance.get('/movies/upcoming-movies', {
          // Add timeout to prevent hanging requests
          timeout: 10000,
          // Include credentials if your API requires authentication
          withCredentials: true
        });
        
        if (response.data && response.data.data) {
          setMovies(response.data.data);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch upcoming movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDetailsClick = (e, movie) => {
    e.preventDefault();
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  // Show a more detailed loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Upcoming Releases</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="ml-4">Loading upcoming movies...</p>
        </div>
      </div>
    );
  }

  // Show a more detailed error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Upcoming Releases</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">Please check your network connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No movies found
  if (!movies || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Upcoming Releases</h1>
        <p className="text-center text-gray-600">No upcoming movies found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Releases</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <motion.div 
            key={movie.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: [0.43, 0.13, 0.23, 0.96] 
            }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="block relative group">
              <div className="aspect-[2/3] overflow-hidden">
                <motion.img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
                  }}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center mt-2 text-white/90">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{movie.release_date}</span>
                  </div>
                  <motion.button
                    className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDetailsClick(e, movie)}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    Details
                  </motion.button>
                </motion.div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 line-clamp-1">{movie.title}</h3>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="ml-1 text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="text-sm text-gray-500">{movie.release_date.split('-')[0]}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {showDetails && selectedMovie && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div 
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button 
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white z-10"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="h-64 md:h-96 w-full overflow-hidden">
                    <img 
                      src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/1280x720?text=No+Image+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                    <div className="flex flex-wrap items-center mt-2 gap-3">
                      <span className="px-2 py-1 bg-indigo-700 rounded text-xs">
                        {selectedMovie.adult ? 'Adult' : 'PG'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> {selectedMovie.release_date}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" /> {selectedMovie.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-semibold mb-2">Overview</h3>
                      <p className="text-gray-700 mb-4">{selectedMovie.overview}</p>
                      
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-gray-500 text-sm">Original Title</p>
                            <p>{selectedMovie.original_title}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Original Language</p>
                            <p>{selectedMovie.original_language}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Popularity</p>
                            <p>{selectedMovie.popularity.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Vote Count</p>
                            <p>{selectedMovie.vote_count}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3">
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                          alt={selectedMovie.title}
                          className="w-full h-auto"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
                          }}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                          <Film className="w-5 h-5 mr-2" />
                          Watch Trailer
                        </button>
                        
                        <button className="w-full mt-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Set Reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upcoming;