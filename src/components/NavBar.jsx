import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

const NavBar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', private: true },
    { name: 'Forum', path: '/forum', private: true },
    { name: 'Library', path: '/library' },
  ];

  return (
    <nav className="glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pastel-blue fill-pastel-blue" />
              <span className="font-semibold text-xl text-slate-700">Serenity</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.private && !currentUser) return null;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  {link.name}
                </Link>
              );
            })}
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition group">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <span className="text-sm font-semibold max-w-[100px] truncate">{userProfile?.name || 'Loading...'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-pastel-blue text-slate-800 hover:bg-blue-200 px-4 py-2 rounded-full text-sm font-medium transition"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              if (link.private && !currentUser) return null;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
                >
                  {link.name}
                </Link>
              );
            })}
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
