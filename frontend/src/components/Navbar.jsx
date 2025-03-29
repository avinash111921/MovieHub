import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, LogIn, Menu, X, Star, Calendar, MessageCircle, User, LogOut, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { user, token, logout } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token]);
    
    // Add scroll event listener to add background when scrolled down
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <motion.header 
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-black/80 backdrop-blur-md shadow-lg' 
                        : 'bg-black/50 backdrop-blur-md'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2 mr-8">
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Film className="w-8 h-8 text-white" />
                                </motion.div>
                                <motion.h1 
                                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    CineVerse
                                </motion.h1>
                            </Link>
                            
                            <div className="hidden md:flex items-center space-x-6">
                                <DesktopNavLink to="/" isActive={isActive('/')} icon={<Film className="w-4 h-4" />} text="Home" />
                                <DesktopNavLink to="/reviews" isActive={isActive('/reviews')} icon={<Star className="w-4 h-4" />} text="Reviews" />
                                <DesktopNavLink to="/upcoming" isActive={isActive('/upcoming')} icon={<Calendar className="w-4 h-4" />} text="Upcoming" />
                                <DesktopNavLink to="/discussions" isActive={isActive('/discussions')} icon={<MessageCircle className="w-4 h-4" />} text="Discussions" />
                            </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-4">
                            {!isLoggedIn ? (
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/login" className="flex items-center space-x-2 px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white">
                                            <LogIn className="w-5 h-5" />
                                            <span>Login</span>
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/register" className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full hover:bg-white/30 transition-colors text-white">
                                            <UserPlus className="w-5 h-5" />
                                            <span>Register</span>
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/profile" className="flex items-center space-x-2 px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white">
                                            <User className="w-5 h-5" />
                                            <span>{user?.username || 'Profile'}</span>
                                        </Link>
                                    </motion.div>
                                    <motion.button 
                                        onClick={handleLogout} 
                                        className="flex items-center space-x-2 bg-red-500/70 backdrop-blur-md px-4 py-1.5 rounded-full hover:bg-red-500/90 transition-colors text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </motion.button>
                                </>
                            )}
                        </div>
                        <motion.button 
                            className="md:hidden text-white" 
                            onClick={() => setIsOpen(!isOpen)}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </motion.header>
            
            {/* Empty div to push content below the fixed navbar */}
            <div className="h-[72px]"></div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.nav 
                        className="bg-white shadow md:hidden fixed top-[72px] left-0 right-0 z-40 overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col space-y-4 py-4">
                                <NavLink to="/" isActive={isActive('/')} icon={<Film className="w-4 h-4" />} text="Home" />
                                <NavLink to="/reviews" isActive={isActive('/reviews')} icon={<Star className="w-4 h-4" />} text="Reviews" />
                                <NavLink to="/upcoming" isActive={isActive('/upcoming')} icon={<Calendar className="w-4 h-4" />} text="Upcoming" />
                                <NavLink to="/discussions" isActive={isActive('/discussions')} icon={<MessageCircle className="w-4 h-4" />} text="Discussions" />
                                
                                {/* Mobile auth links */}
                                <div className="border-t pt-4 mt-2">
                                    {!isLoggedIn ? (
                                        <>
                                            <NavLink to="/login" icon={<LogIn className="w-4 h-4" />} text="Login" />
                                            <NavLink to="/register" icon={<UserPlus className="w-4 h-4" />} text="Register" />
                                        </>
                                    ) : (
                                        <>
                                            <NavLink to="/profile" icon={<User className="w-4 h-4" />} text={user?.username || 'Profile'} />
                                            <motion.button
                                                onClick={handleLogout}
                                                className="w-full py-2 px-2 text-red-600 font-medium flex items-center space-x-2"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </motion.button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
};

// Mobile Nav Link Component
const NavLink = ({ to, isActive, icon, text }) => (
    <motion.div whileTap={{ scale: 0.95 }}>
        <Link
            to={to}
            className={`py-2 px-2 text-gray-600 font-medium flex items-center space-x-2`}
        >
            {icon}
            <span>{text}</span>
        </Link>
    </motion.div>
);

// Desktop Nav Link Component
const DesktopNavLink = ({ to, isActive, icon, text }) => (
    <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
        <Link
            to={to}
            className={`py-2 px-4 ${
                isActive
                    ? 'text-white font-medium'
                    : 'text-white/80 hover:text-white'
            } flex items-center space-x-2 transition-all relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:scale-x-0 after:origin-center after:transition-transform ${isActive ? 'after:scale-x-100' : ''} hover:after:scale-x-100`}
        >
            {icon}
            <span>{text}</span>
        </Link>
    </motion.div>
);

export default Navbar;
