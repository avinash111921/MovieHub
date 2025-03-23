import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="w-6 h-6" />
            <span className="text-xl font-bold">CineVerse</span>
          </Link>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-purple-400">About</Link>
            <Link to="/contact" className="hover:text-purple-400">Contact</Link>
            <Link to="#" className="hover:text-purple-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-purple-400">Terms of Service</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 CineVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;