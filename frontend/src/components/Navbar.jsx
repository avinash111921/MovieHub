import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, LogIn, Menu, X, Search, Star, Calendar, MessageCircle, User, LogOut, UserPlus } from 'lucide-react';
import { ShopContext } from '../context/ShopContext.jsx';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { token, setToken } = useContext(ShopContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setIsLoggedIn(!!(token || storedToken));
    }, [token]);

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchQuery) return;
        
        const apiKey = "b13184b3"; // Your OMDb API Key
        const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Search && data.Search.length > 0) {
                const firstMovie = data.Search[0]; // Take the first movie from results
                navigate(`/movies/${firstMovie.imdbID}`);
            } else {
                alert("No movies found!");
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            <header className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Film className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">CineVerse</h1>
                    </Link>
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white text-black rounded-full px-4 py-1 space-x-2">
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none px-2 py-1 bg-transparent"
                        />
                        <button type="submit">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>
                    </form>
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-indigo-700">
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" className="flex items-center space-x-2 bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700">
                                    <UserPlus className="w-5 h-5" />
                                    <span>Register</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-indigo-700">
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                    <button 
                        className="md:hidden text-white" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>
            <nav className={`bg-white shadow md:block ${isOpen ? 'block' : 'hidden'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 py-4">
                        <Link
                            to="/"
                            className={`py-2 px-2 border-b-2 ${
                                isActive('/')
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600'
                            } font-medium flex items-center space-x-2`}
                        >
                            <Film className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/reviews"
                            className={`py-2 px-2 border-b-2 ${
                                isActive('/reviews')
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600'
                            } font-medium flex items-center space-x-2`}
                        >
                            <Star className="w-4 h-4" />
                            <span>Reviews</span>
                        </Link>
                        <Link
                            to="/upcoming"
                            className={`py-2 px-2 border-b-2 ${
                                isActive('/upcoming')
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600'
                            } font-medium flex items-center space-x-2`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Upcoming</span>
                        </Link>
                        <Link
                            to="/discussions"
                            className={`py-2 px-2 border-b-2 ${
                                isActive('/discussions')
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600'
                            } font-medium flex items-center space-x-2`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Discussions</span>
                        </Link>
                        
                        {/* Mobile auth links */}
                        <div className="md:hidden border-t pt-4 mt-2">
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="py-2 px-2 text-gray-600 font-medium flex items-center space-x-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="py-2 px-2 text-gray-600 font-medium flex items-center space-x-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Register</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/profile"
                                        className="py-2 px-2 text-gray-600 font-medium flex items-center space-x-2"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="py-2 px-2 text-red-600 font-medium flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
