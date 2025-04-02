import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Info, X, Award, Calendar, Globe, Film } from 'lucide-react';

function MovieCard({ movie, index = 0 }) {
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Fallback image for movies without posters
  const posterUrl = movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  const fetchMovieDetails = async () => {
    if (detailsData) return; // Don't fetch if we already have data
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=full&apikey=${apiKey}`);
      const data = await response.json();
      
      if (data.Response === "True") {
        setDetailsData(data);
      }
      
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click event from triggering
    setShowDetails(true);
    fetchMovieDetails();
  };

  return (
    <>
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden h-[350px] sm:h-[400px] transition-all duration-300 relative"
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
        <div className="block relative">
          <div className="aspect-[2/3] sm:aspect-[3/4] overflow-hidden">
            <motion.img 
              src={posterUrl} 
              alt={movie.Title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Overlay that's always partly visible on mobile, fully visible on hover for desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
            opacity-0 sm:opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4
            sm:block">
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-col">
              <h3 className="text-white font-bold text-sm sm:text-lg line-clamp-2">{movie.Title}</h3>
              <div className="flex items-center mt-1 sm:mt-2 text-white/90">
                <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-0.5 sm:mr-1" />
                <span className="text-xs sm:text-sm">{movie.Year}</span>
              </div>
              <motion.button
                className="mt-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium shadow-md"
                whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDetailsClick}
              >
                <Info className="w-3 sm:w-4 h-3 sm:h-4 mr-0.5 sm:mr-1" />
                Details
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1">{movie.Title}</h3>
          </div>
          
          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1" />
              <span className="ml-1 text-sm font-medium">IMDB</span>
            </div>
            <div className="text-sm text-gray-500">{movie.Year}</div>
          </div>
          
          {/* Mobile-only details button for extra visibility */}
          <button
            className="mt-3 w-full px-4 py-1.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium
                     shadow-sm hover:bg-indigo-700 md:hidden"
            onClick={handleDetailsClick}
          >
            <Info className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>
      </motion.div>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div 
              className="bg-white rounded-xl w-full md:w-11/12 lg:max-w-4xl max-h-[90vh] overflow-y-auto"
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

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : detailsData ? (
                  <>
                    <div className="relative">
                      <div className="h-64 md:h-96 w-full overflow-hidden">
                        <img 
                          src={detailsData.Poster !== "N/A" ? detailsData.Poster : posterUrl} 
                          alt={detailsData.Title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                        <h2 className="text-3xl font-bold">{detailsData.Title}</h2>
                        <div className="flex flex-wrap items-center mt-2 gap-3">
                          <span className="px-2 py-1 bg-indigo-700 rounded text-xs">{detailsData.Rated}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> {detailsData.Runtime}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> {detailsData.Year}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" /> {detailsData.imdbRating}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-semibold mb-2">Plot</h3>
                          <p className="text-gray-700 mb-4">{detailsData.Plot}</p>
                          
                          <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                              {detailsData.Genre.split(',').map((genre, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                  {genre.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Cast & Crew</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-gray-500 text-sm">Director</p>
                                <p>{detailsData.Director}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Writer</p>
                                <p>{detailsData.Writer}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-gray-500 text-sm">Actors</p>
                                <p>{detailsData.Actors}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-1/3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Movie Info</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-500 text-sm">Released</p>
                                <p>{detailsData.Released}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Language</p>
                                <div className="flex items-center">
                                  <Globe className="w-4 h-4 mr-1 text-gray-500" />
                                  <p>{detailsData.Language}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Country</p>
                                <p>{detailsData.Country}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Production</p>
                                <p>{detailsData.Production || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Box Office</p>
                                <p>{detailsData.BoxOffice || "N/A"}</p>
                              </div>
                              
                              {detailsData.Awards !== "N/A" && (
                                <div className="pt-2">
                                  <div className="flex items-center text-amber-600">
                                    <Award className="w-5 h-5 mr-2" />
                                    <p className="font-medium">{detailsData.Awards}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <Link 
                                to={`/movie/${movie.imdbID}`}
                                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                              >
                                View Full Page
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-6">
                    <Film className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Failed to load movie details</p>
                    <button 
                      className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={fetchMovieDetails}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MovieCard;