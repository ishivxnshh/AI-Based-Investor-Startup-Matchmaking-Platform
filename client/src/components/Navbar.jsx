import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import assets from '../assets/assets';

const Navbar = ({ userType = 'startup' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => setShowDropdown((prev) => !prev);
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getProfileSettingsPath = () => {
    return userType === 'investor' ? '/investor-profile-settings' : '/startup-profile-settings';
  };

  const getDashboardPath = () => {
    return userType === 'investor' ? '/investor-dashboard' : '/startup-dashboard';
  };

  const getSearchPath = () => {
    return userType === 'investor' ? '/startupssearch' : '/investor-search';
  };

  const getSearchLabel = () => {
    return userType === 'investor' ? 'Explore Startups' : 'Explore Investors';
  };

  const getProfileLabel = () => {
    return userType === 'investor' ? 'Investor Profile' : 'Startup Profile';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getButtonClass = (path) => {
    const baseClass = "text-white px-4 py-2 rounded-lg transition";
    return isActive(path) 
      ? `${baseClass} bg-indigo-800 text-purple-300` 
      : `${baseClass} hover:text-purple-300 hover:bg-indigo-800`;
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate(getDashboardPath())}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate(getDashboardPath())}
        aria-label="Go to dashboard"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="text-2xl font-bold text-white text-gradient">Chatiao</span>
      </div>
      <nav className="flex items-center gap-6 text-sm font-medium relative" role="navigation" aria-label="Main navigation">
        <button 
          onClick={() => navigate(getDashboardPath())} 
          className={`${getButtonClass(getDashboardPath())} focus-ring`}
          aria-label="Go to dashboard"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </span>
        </button>
        <button 
          onClick={() => navigate(getSearchPath())} 
          className={`${getButtonClass(getSearchPath())} focus-ring`}
          aria-label={`${getSearchLabel()}`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {getSearchLabel()}
          </span>
        </button>
        <button 
          onClick={() => navigate('/chat')} 
          className={`${getButtonClass('/chat')} focus-ring`}
          title="Chat with other users"
          aria-label="Open chat"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </span>
        </button>
        {/* User Profile Dropdown */}
        <div className="relative ml-4">
          <button
            className="p-2 rounded-full hover:bg-indigo-800 transition-all duration-300 focus-ring"
            title="User Menu"
            onClick={handleDropdownToggle}
            aria-expanded={showDropdown}
            aria-haspopup="true"
            aria-label="Open user menu"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20 border border-gray-200 animate-fade-in-up">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100 transition-colors focus:outline-none focus:bg-indigo-100"
                  onClick={() => { setShowDropdown(false); navigate(getProfileSettingsPath()) }}
                  aria-label="Go to profile settings"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {getProfileLabel()}
                  </span>
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 transition-colors focus:outline-none focus:bg-red-100 text-red-600"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 