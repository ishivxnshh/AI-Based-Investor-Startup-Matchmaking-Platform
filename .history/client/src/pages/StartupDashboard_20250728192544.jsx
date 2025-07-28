import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const featuredInvestors = [
  { id: 1, name: 'John Doe', focus: 'Fintech, SaaS, Seed-Stage', desc: 'Angel investor with a focus on early-stage technology startups.' },
  { id: 2, name: 'Jane Smith', focus: 'Healthtech, Series A', desc: 'Venture capitalist passionate about healthcare innovation.' },
  { id: 3, name: 'Alex Lee', focus: 'Edtech, Angel', desc: 'Edtech specialist investing in early-stage education startups.' },
  { id: 4, name: 'Priya Patel', focus: 'E-commerce, Series B', desc: 'E-commerce expert with a track record of scaling online brands.' },
  { id: 5, name: 'Carlos Gomez', focus: 'AgriTech, Seed', desc: 'Investing in sustainable agriculture and food tech startups.' },
  { id: 6, name: 'Linda Wang', focus: 'AI, DeepTech', desc: 'AI and deep tech investor supporting breakthrough innovation.' },
];

const StartupDashboard = () => {
  const navigate = useNavigate();
  // Dropdown menu state
  const [showDropdown, setShowDropdown] = useState(false)
  const handleDropdownToggle = () => setShowDropdown((prev) => !prev)
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/startup-dashboard')}>
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium relative">
            <button onClick={() => navigate('/startup-dashboard')} className="hover:text-purple-300">Home</button>
            <button onClick={() => navigate('/investor-search')} className="hover:text-purple-300">Explore Investors</button>
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
                <img src="https://img.freepik.com/premium-photo/humanoid-half-man-body-robotic-cyberfunk-black-backround_1230721-5.jpg" alt="Robot" className="w-9 h-9" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                    onClick={() => { setShowDropdown(false); navigate('/startup-profile-settings') }}
                  >Startup Profile</button>
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

        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">Connect. Invest. Grow.</h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8">Find investors. Apply for meetings.</p>
          <button 
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition text-lg" 
            onClick={() => navigate('/investor-search')}
          >
            Browse Investors
          </button>

          {/* AI Assistant Section */}
          <div className="mt-12 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto bg-white/10 rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-2">
              <img src={assets.chat_icon} alt="AI Assistant" className="w-12 h-12 bg-indigo-700 rounded-full p-2" />
              <span className="text-2xl font-bold text-white">AI Startup Assistant</span>
            </div>
            <p className="text-lg text-gray-200 mb-4 text-center">Ask our AI Assistant anything about investors, funding, or your startup journey. (Coming soon!)</p>
            <div className="w-full flex flex-col md:flex-row gap-2 items-center">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-full bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Type your question... (AI coming soon)"
                disabled
              />
              <button
                className="bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-800 transition flex items-center gap-2 opacity-60 cursor-not-allowed"
                disabled
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-9.456 3.181a.75.75 0 00-.042 1.414l9.456 3.181a.75.75 0 00.99-.99l-3.181-9.456a.75.75 0 00-1.414-.042z" /></svg>
                Ask AI
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2">AI-powered answers and chat will be available soon.</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 rounded-lg">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex justify-center items-center mb-4">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Profile overview.</h3>
              <p className="text-gray-200">View background, focus areas, and current investment activities for each investor.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg">
              <div className="w-20 h-20 bg-white/20 rounded-full flex justify-center items-center mb-4">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Open to meet.</h3>
              <p className="text-gray-200">Easily request meetings with top investors based on your company's fit.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg">
              <div className="w-20 h-20 bg-white/20" style={{clipPath:'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              <h3 className="text-xl font-semibold text-white mb-2">Apply directly.</h3>
              <p className="text-gray-200">Click 'Apply for Meeting' to request a meeting with any listed investor.</p>
            </div>
          </div>
        </section>

        {/* Featured Investors Carousel */}
        <section className="py-16 px-4 bg-white/5">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Investors</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {featuredInvestors.map((inv, idx) => (
                <div key={idx} className="bg-white/20 rounded-lg shadow p-8 flex flex-col items-center min-w-[300px] max-w-[350px]">
                  <h3 className="text-2xl font-semibold mb-2 text-white">{inv.name}</h3>
                  <p className="text-lg text-indigo-200 mb-3">{inv.focus}</p>
                  <p className="text-gray-200 text-center mb-6">{inv.desc}</p>
                  <button 
                    className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition" 
                    onClick={() => navigate(`/investordetails/${inv.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-20 px-4 bg-white/10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to connect?</h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">Apply for a meeting with your selected investor now.</p>
          <button 
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition text-lg" 
            onClick={() => navigate('/investor-search')}
          >
            Start Application
          </button>
        </section>

        {/* Footer */}
        <footer className="bg-black/70 py-12 px-4 shadow-inner mt-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 mt-8">© {new Date().getFullYear()} Chatiao. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default StartupDashboard;