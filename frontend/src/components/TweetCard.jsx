import React, { useState } from 'react';

const TweetCard = ({ tweet, startEditing, handleDeleteTweet }) => {
  const [isUpdatingPoster, setIsUpdatingPoster] = useState(false);
  const [posterError, setPosterError] = useState(null);

  const handleUpdatePoster = () => {
    setIsUpdatingPoster(true);
    startEditing(tweet);
  };

  const handlePosterError = (error) => {
    setPosterError(error);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="relative">
        {tweet.poster ? (
          <div className="relative w-full h-64">
            {isUpdatingPoster ? (
              <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 hover:bg-opacity-20">
                <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded-lg p-2">
                  <button
                    onClick={handleUpdatePoster}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Update Poster
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={`${tweet.poster}?${new Date().getTime()}`} // Add timestamp to prevent caching
                alt="Movie Poster"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", tweet.poster);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x640?text=Poster+Not+Available";
                  handlePosterError(e);
                }}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        {posterError && (
          <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 hover:bg-opacity-20">
            <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded-lg p-2">
              <p className="text-red-500 text-xs">{posterError.message}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="prose mb-4">
          <p className="text-gray-800">{tweet.content}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between space-x-4">
            <button
              onClick={() => startEditing(tweet)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            <button
              onClick={() => handleDeleteTweet(tweet._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 text-sm flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;