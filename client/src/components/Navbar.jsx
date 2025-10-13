import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import assets from '../assets/assets';
import { Badge } from './ui';

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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonClass = (path) => {
    const baseClass = "text-white px-4 py-2.5 rounded-lg transition-all duration-300 font-medium";
    return isActive(path) 
      ? `${baseClass} bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/50 text-purple-300 shadow-lg` 
      : `${baseClass} hover:text-purple-300 hover:bg-white/5 border border-transparent`;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-purple-500/20 shadow-lg">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate(getDashboardPath())}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(getDashboardPath())}
          aria-label="Go to dashboard"
        >
          <img src={assets.logo} alt="VentureBridge" className="h-14 transition-transform group-hover:scale-105" />
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
        <button
          onClick={() => navigate('/notifications')}
          className={`${getButtonClass('/notifications')} focus-ring`}
          title="Notifications"
          aria-label="Open notifications"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Alerts
          </span>
        </button>
        <button
          onClick={() => navigate(getProfileSettingsPath())}
          className={`${getButtonClass(getProfileSettingsPath())} focus-ring`}
          title="Settings"
          aria-label="Open settings"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </span>
        </button>
        {/* User Profile Dropdown */}
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            className="p-1 rounded-full hover:ring-2 hover:ring-purple-400/50 transition-all duration-300 focus-ring group"
            title="User Menu"
            onClick={handleDropdownToggle}
            aria-expanded={showDropdown}
            aria-haspopup="true"
            aria-label="Open user menu"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center ring-2 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {showDropdown && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
              <div className="p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-violet-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Account</p>
                    <Badge variant="primary" size="sm" className="mt-1">
                      {userType === 'investor' ? 'Investor' : 'Startup'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-200 hover:bg-purple-500/20 hover:text-white transition-all duration-200 focus:outline-none focus:bg-purple-500/20"
                  onClick={() => { setShowDropdown(false); navigate(getProfileSettingsPath()) }}
                  aria-label="Go to profile settings"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{getProfileLabel()}</span>
                  </span>
                </button>
                <div className="my-1 h-px bg-purple-500/20"></div>
                <button
                  className="block w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 focus:outline-none focus:bg-red-500/20"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      </div>
    </header>
  );
};

export default Navbar; 