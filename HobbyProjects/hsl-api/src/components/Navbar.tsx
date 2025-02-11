// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white shadow-lg py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        MyApp
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link to="/about" className="hover:text-gray-400">
          About
        </Link>
        <Link to="/services" className="hover:text-gray-400">
          Services
        </Link>
        <Link to="/contact" className="hover:text-gray-400">
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
