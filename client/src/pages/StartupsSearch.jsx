import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import startupsData from '../startups.js';
import assets from '../assets/assets';

const industries = [
  { label: 'All', value: 'all' },
  { label: 'Sustainability', value: 'sustainability' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Education', value: 'education' },
  { label: 'Ecommerce', value: 'ecommerce' },
  { label: 'AI', value: 'ai' },
];

function StartupsSearch() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const navigate = useNavigate();

  const filteredStartups = startupsData.filter((startup) => {
    const matchesIndustry = industry === 'all' || startup.industry === industry;
    const matchesSearch =
      startup.name.toLowerCase().includes(search.toLowerCase()) ||
      startup.description.toLowerCase().includes(search.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/') }>
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => navigate('/investor-dashboard')} className="hover:text-purple-300">Home</button>
            <button className="hover:text-purple-300">Startups</button>
            <button onClick={() => navigate('/chat')} className="ml-4 p-2 rounded-full hover:bg-indigo-800 transition flex items-center" title="Chat">
              <img src={assets.chat_icon} alt="Chat" className="w-8 h-8" />
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">Discover Investment Opportunities</h1>
          <p className="text-lg text-gray-300 mb-8">Explore the most promising startups and invest in the future with Chatiao.</p>
          <div className="search-bar max-w-xl mx-auto flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              className="flex-1 px-6 py-3 text-gray-700 outline-none"
              placeholder="Search startups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="bg-indigo-700 text-white px-6 py-3 font-bold hover:bg-indigo-900 transition">Search</button>
          </div>
        </section>

        {/* Filters */}
        <section className="filters bg-white/10 py-8 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="filter-buttons flex gap-4 flex-wrap justify-center">
              {industries.map((item) => (
                <button
                  key={item.value}
                  className={`filter-btn px-4 py-2 rounded-full border text-sm font-medium transition ${industry === item.value ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                  onClick={() => setIndustry(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Startups Grid */}
        <section className="startups-grid py-12">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-3xl font-semibold mb-8 text-white">Featured Startups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStartups.map((startup) => (
                <div key={startup.id} className="startup-card bg-white/10 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
                  <div className="card-image h-48 flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-2xl font-bold">
                    {startup.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div className="card-content p-6">
                    <div className="card-title text-xl font-semibold mb-2 text-white">{startup.name}</div>
                    <div className="card-description text-gray-300 mb-4">{startup.description}</div>
                    <div className="card-meta flex justify-between items-center mb-4">
                      <span className="funding-goal bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Goal: {startup.fundingGoal}</span>
                      <span className="industry-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{startup.industry}</span>
                    </div>
                    <div className="card-stats flex gap-4 text-sm text-gray-400 mb-4">
                      <span className="stat">{startup.stage}</span>
                      <span className="stat">{startup.location}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/startupsdetails/${startup.id}`)}
                      className="view-details-btn w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-900 transition block text-center mt-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  );
}

export default StartupsSearch; 