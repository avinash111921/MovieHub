import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Reviews from './pages/Reviews';
import Discussions from './pages/Dicussions.jsx';
import Upcoming from './pages/Upcoming';
import MovieDetails from './pages/MovieDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from "./pages/About.jsx";
import Contact from './pages/Contact.jsx';
import Login from './pages/Login';

const App = () => {
  return (
    <div> 
      <ToastContainer autoClose={3000} />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
