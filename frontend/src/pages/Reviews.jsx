import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../utils/axios.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TweetCard from '../components/TweetCard';

const Reviews = () => {
  const [formData, setFormData] = useState({
    content: '',
    poster: null
  });
  const [editingReview, setEditingReview] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAllTweets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/tweet/tweets');
      setTweets(response.data.data);
    } catch (error) {
      setError(error.message || 'Failed to fetch reviews');
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const createTweet = async (e) => {
    e.preventDefault();
    if (!formData.content) {
      setError('Review content is required');
      toast.error('Review content is required');
      return;
    }
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      if (formData.poster) {
        formDataToSend.append('poster', formData.poster);
      }

      const response = await axiosInstance.post('/tweet/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setTweets([response.data.data, ...tweets]);
      resetForm();
      toast.success('Review created successfully');
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create review');
      toast.error(error.response?.data?.message || 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      poster: null
    });
    setPosterPreview(null);
    setEditingReview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        poster: file
      }));
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
    }
  };

  const handleUpdateContent = async (e, tweetId) => {
    e.preventDefault();
    if (!formData.content) {
      toast.error('Content is required');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('content', formData.content);

      await axiosInstance.patch(`/tweet/${tweetId}`, formDataToSend, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      toast.success('Review updated successfully');
      resetForm();
      await fetchAllTweets();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update review');
      toast.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoster = async (e, tweetId) => {
    e.preventDefault();
    if (!formData.poster) {
      toast.error('Please select a poster image');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('poster', formData.poster);

      const response = await axiosInstance.patch(`/tweet/poster/${tweetId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data && response.data.success) {
        toast.success('Poster updated successfully');
        // Fetch fresh data from server
        await fetchAllTweets();
        // Reset form and close
        resetForm();
        setShowForm(false);
      } else {
        throw new Error('Failed to update poster');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update poster');
      toast.error(error.response?.data?.message || 'Failed to update poster');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/tweet/${tweetId}`);
      toast.success('Review deleted successfully');
      await fetchAllTweets();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete review');
      toast.error(error.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (tweet) => {
    setEditingReview(tweet._id);
    setFormData({
      content: tweet.content,
      poster: null  // We don't set the actual file here, just the preview
    });
    if (tweet.poster) {
      setPosterPreview(tweet.poster);
    } else {
      setPosterPreview(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowForm(true);
  };

  useEffect(() => {
    fetchAllTweets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Movie Reviews
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Share your thoughts on the latest movies
          </p>
        </header>
        
        {!showForm && (
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <span className="font-medium">+ Add New Review</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-8">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingReview ? 'Edit Review' : 'Create New Review'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={editingReview ? (e) => handleUpdateContent(e, editingReview) : createTweet} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Content:
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="What did you think of the movie?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  rows="5"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Poster:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-500">Select poster image</span>
                      <input
                        type="file"
                        id="poster"
                        name="poster"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {posterPreview && (
                    <div className="w-32 h-32 relative">
                      <img 
                        src={posterPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg border border-gray-300" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPosterPreview(null);
                          setFormData(prev => ({ ...prev, poster: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {editingReview ? 'Update Review' : 'Post Review'}
                </button>
              </div>
              
              {editingReview && (
                <div>
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Additional Options</h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                      <button
                        type="button"
                        onClick={(e) => handleUpdatePoster(e, editingReview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!formData.poster}
                      >
                        Update Poster Only
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => resetForm()}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Reset Form
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tweets.map((tweet) => (
          <TweetCard 
            key={tweet._id} 
            tweet={tweet} 
            startEditing={startEditing} 
            handleDeleteTweet={handleDeleteTweet} 
          />
        ))}
        </div>
        
        {tweets.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-700">No reviews yet</h3>
            <p className="mt-2 text-gray-500">Be the first to share your thoughts!</p>
            <button 
              onClick={() => setShowForm(true)} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;