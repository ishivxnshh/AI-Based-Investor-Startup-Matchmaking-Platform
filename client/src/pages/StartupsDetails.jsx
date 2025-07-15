import { useParams, Link, useNavigate } from 'react-router-dom';
import startupsData from '../startups.js';
import assets from '../assets/assets';

function StartupsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const startup = startupsData.find(s => s.id === parseInt(id));

  if (!startup) {
    return <div className="p-8 text-center text-xl">Startup not found.</div>;
  }

  // Calculate funding progress
  const goal = parseFloat(startup.fundingGoal.replace(/[^\d.]/g, ''));
  const raised = parseFloat(startup.raised.replace(/[^\d.]/g, ''));
  const percent = Math.min(100, Math.round((raised / goal) * 100));

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
            <button onClick={() => navigate('/startupssearch')} className="hover:text-purple-300">Startups</button>
            <button onClick={() => navigate('/chat')} className="ml-4 p-2 rounded-full hover:bg-indigo-800 transition flex items-center" title="Chat">
              <img src={assets.chat_icon} alt="Chat" className="w-8 h-8" />
            </button>
          </nav>
        </header>

        {/* Breadcrumb */}
        <div className="breadcrumb bg-white/10 py-4 border-b border-gray-700 px-4">
          <div className="container mx-auto">
            <button onClick={() => navigate('/investor-dashboard')} className="text-indigo-300 hover:underline mr-2 bg-transparent">Home</button>
            <span className="text-gray-400">/</span>
            <span className="ml-2 text-white font-semibold">{startup.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="startup-hero py-12 border-b border-gray-700">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="startup-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
                {startup.name.split(' ').map(word => word[0]).join('')}
              </div>
              <div className="startup-title text-3xl font-bold mb-2 text-white">{startup.name}</div>
              <div className="startup-tagline text-lg text-gray-300 mb-6">{startup.description}</div>
              <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.stage}</div>
                  <div className="stat-label text-gray-300 mt-1">Stage</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.location}</div>
                  <div className="stat-label text-gray-300 mt-1">Location</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.founded}</div>
                  <div className="stat-label text-gray-300 mt-1">Founded</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.investors}</div>
                  <div className="stat-label text-gray-300 mt-1">Investors</div>
                </div>
              </div>
            </div>
            {/* Investment Card */}
            <div className="investment-card bg-white/10 border-2 border-gray-700 rounded-xl p-8 shadow-md sticky top-8">
              <div className="investment-title text-lg font-semibold mb-4 text-white">Investment Opportunity</div>
              <div className="funding-progress mb-6">
                <div className="progress-bar w-full h-2 bg-gray-700 rounded mb-2 overflow-hidden">
                  <div className="progress-fill h-full bg-gradient-to-r from-green-400 to-green-700" style={{ width: percent + '%' }}></div>
                </div>
                <div className="funding-stats flex justify-between mb-2">
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.raised}</div>
                    <div className="funding-label text-gray-300 text-xs">Raised</div>
                  </div>
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.fundingGoal}</div>
                    <div className="funding-label text-gray-300 text-xs">Goal</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 text-right">{percent}% funded</div>
              </div>
              <button className="interest-btn w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-2">Express Interest</button>
              <div className="investment-info text-xs text-gray-300 text-center">No commitment required. Expressing interest helps us connect you with the startup.</div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="content-section bg-white/10 my-8 p-8 rounded-xl shadow-md container mx-auto">
          <div className="section-title text-2xl font-semibold mb-4 text-white">Team</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {startup.team.map(member => (
              <div key={member.name} className="bg-white/10 rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-2">{member.initials}</div>
                <div className="font-semibold text-white">{member.name}</div>
                <div className="text-xs text-gray-300">{member.role}</div>
              </div>
            ))}
          </div>
          <div className="section-title text-2xl font-semibold mb-4 text-white">Financials</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.financials.revenue}</div>
              <div className="text-xs text-gray-300 mt-1">Revenue</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.financials.growth}</div>
              <div className="text-xs text-gray-300 mt-1">Growth</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.financials.valuation}</div>
              <div className="text-xs text-gray-300 mt-1">Valuation</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.financials.burnRate}</div>
              <div className="text-xs text-gray-300 mt-1">Burn Rate</div>
            </div>
          </div>
          <div className="section-title text-2xl font-semibold mb-4 text-white">Business Model</div>
          <div className="section-content text-gray-200 mb-8">{startup.businessModel}</div>
          <div className="section-title text-2xl font-semibold mb-4 text-white">Market Opportunity</div>
          <div className="section-content text-gray-200">{startup.marketOpportunity}</div>
        </section>
      </div>
      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  );
}

export default StartupsDetails; 