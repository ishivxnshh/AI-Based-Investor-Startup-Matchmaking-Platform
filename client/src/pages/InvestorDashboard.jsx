import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import startupsData from '../startups.js'

const InvestorDashboard = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
  })
  // Dummy: Replace with real data if available
  const [investedStartups, setInvestedStartups] = useState([startupsData[0], startupsData[1]])
  const [interestedStartups, setInterestedStartups] = useState([startupsData[2], startupsData[3]])
  // Dropdown menu state
  const [showDropdown, setShowDropdown] = useState(false)
  const handleDropdownToggle = () => setShowDropdown((prev) => !prev)
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (user) {
      setCurrentUser(user)
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
      })
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/investor-dashboard')}>
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium relative">
            <button onClick={() => navigate('/investor-dashboard')} className="hover:text-purple-300">Home</button>
            <button onClick={() => navigate('/startupssearch')} className="hover:text-purple-300">Startups</button>
            <button onClick={() => navigate('/investor-profile-settings')} className="hover:text-purple-300">Profile Settings</button>
            <button onClick={() => navigate('/chat')} className="ml-4 p-2 rounded-full hover:bg-indigo-800 transition flex items-center" title="Chat">
              <img src={assets.chat_icon} alt="Chat" className="w-8 h-8" />
            </button>
          {/* Robot Icon Dropdown */}
          <div className="relative ml-4">
            <button
              className="p-2 rounded-full hover:bg-indigo-800 transition flex items-center"
              title="User Menu"
              onClick={handleDropdownToggle}
            >
              <img src="https://img.freepik.com/premium-photo/humanoid-half-man-body-robotic-cyberfunk-black-backround_1230721-5.jpg" 
              alt="Robot" className="w-11 h-11 rounded-full" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                  onClick={() => { setShowDropdown(false); navigate('/investor-profile-settings') }}
                >Investor Profile</button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                  onClick={() => { setShowDropdown(false); navigate('/settings') }}
                >Settings</button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                  onClick={handleLogout}
                >Logout</button>
              </div>
            )}
          </div>
          </nav>
        </header>

        {/* Welcome Section */}
        <section className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2">
            Welcome, {profile.fullName || 'Investor'}
          </h1>
          <p className="mt-2 text-gray-300 text-lg">
            Here you can track your investments, discover new startups, and manage your investor journey with Chatiao.
          </p>

        </section>

        {/* Centered Startups Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/startupssearch')}
            className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-3 rounded-md font-medium text-lg shadow-lg hover:scale-105 transition"
          >
            Explore Startups
          </button>
        </div>

        {/* Dashboard Sections */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Startups Invested In */}
          <section className="bg-white/10 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Startups You're Invested In</h2>
            {investedStartups.length === 0 ? (
              <p className="text-gray-300">You haven't invested in any startups yet.</p>
            ) : (
              <ul className="space-y-4">
                {investedStartups.map((startup) => (
                  <li key={startup.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-bold text-lg">{startup.name}</div>
                      <div className="text-gray-300 text-sm">{startup.description}</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2 items-center">
                      <span className="bg-indigo-700 text-white px-3 py-1 rounded-full text-xs font-medium">{startup.industry}</span>
                      <span className="bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium">{startup.stage}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Startups Interested In */}
          <section className="bg-white/10 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Startups You've Shown Interest In</h2>
            {interestedStartups.length === 0 ? (
              <p className="text-gray-300">You haven't shown interest in any startups yet.</p>
            ) : (
              <ul className="space-y-4">
                {interestedStartups.map((startup) => (
                  <li key={startup.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-bold text-lg">{startup.name}</div>
                      <div className="text-gray-300 text-sm">{startup.description}</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2 items-center">
                      <span className="bg-indigo-700 text-white px-3 py-1 rounded-full text-xs font-medium">{startup.industry}</span>
                      <span className="bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium">{startup.stage}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  )
}

export default InvestorDashboard