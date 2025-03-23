import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, LogIn, Menu, X, Search } from 'lucide-react';
import { ShopContext } from '../context/ShopContext.jsx';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { token, setToken } = useContext(ShopContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                            <Link to="/login" className="flex items-center space-x-2">
                                <LogIn className="w-6 h-6" />
                                <span>SignUp / Login</span>
                            </Link>
                        ) : (
                            <button onClick={handleLogout} className="flex items-center space-x-2">
                                <LogIn className="w-6 h-6" />
                                <span>Logout</span>
                            </button>
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
        </>
    );
};

export default Navbar;
