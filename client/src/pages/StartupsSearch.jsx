import { useState } from 'react';
import { Link } from 'react-router-dom';
import startupsData from '../startups.js';

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

  const filteredStartups = startupsData.filter((startup) => {
    const matchesIndustry = industry === 'all' || startup.industry === industry;
    const matchesSearch =
      startup.name.toLowerCase().includes(search.toLowerCase()) ||
      startup.description.toLowerCase().includes(search.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="logo text-2xl font-bold">InvestR</div>
          <nav className="nav-links flex gap-8">
            <Link to="/" className="hover:opacity-80">Home</Link>
            <a href="#" className="hover:opacity-80">StartUps</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-indigo-400 to-purple-500 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Investment Opportunities</h1>
        <p className="text-lg mb-8 opacity-90">Explore the most promising startups and invest in the future.</p>
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
      <section className="filters bg-white py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="filter-buttons flex gap-4 flex-wrap">
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
          <h2 className="section-title text-3xl font-semibold mb-8 text-gray-800">Featured Startups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => (
              <div key={startup.id} className="startup-card bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
                <div className="card-image h-48 flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-2xl font-bold">
                  {startup.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div className="card-content p-6">
                  <div className="card-title text-xl font-semibold mb-2 text-gray-900">{startup.name}</div>
                  <div className="card-description text-gray-600 mb-4">{startup.description}</div>
                  <div className="card-meta flex justify-between items-center mb-4">
                    <span className="funding-goal bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Goal: {startup.fundingGoal}</span>
                    <span className="industry-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{startup.industry}</span>
                  </div>
                  <div className="card-stats flex gap-4 text-sm text-gray-500 mb-4">
                    <span className="stat">{startup.stage}</span>
                    <span className="stat">{startup.location}</span>
                  </div>
                  <Link to={`/details/${startup.id}`} className="view-details-btn w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-900 transition block text-center">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StartupsSearch; 