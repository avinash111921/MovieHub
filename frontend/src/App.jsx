import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Reviews from './pages/Reviews.jsx';
import Discussions from './pages/Dicussions.jsx';
import Upcoming from './pages/Upcoming.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from "./pages/About.jsx";
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import { useAuthContext } from "./context/AuthContext.jsx";


// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div> 
      <ToastContainer autoClose={3000} />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
