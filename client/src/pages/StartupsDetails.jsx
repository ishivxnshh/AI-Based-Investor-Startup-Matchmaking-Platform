import { useParams, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useState, useEffect } from 'react';
import axios from 'axios';

function StartupsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStartup = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/startup-form/${id}`);
        setStartup(res.data);
      } catch (err) {
        setError('Failed to load startup details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg text-gray-300 min-h-screen flex items-center justify-center">Loading startup details...</div>;
  }
  if (error || !startup) {
    return <div className="text-center text-lg text-red-400 min-h-screen flex items-center justify-center">{error || 'Startup not found.'}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/investor-dashboard')}>
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
            <span className="ml-2 text-white font-semibold">{startup.startupName}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="startup-hero py-12 border-b border-gray-700">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="startup-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
                {startup.startupName ? startup.startupName.split(' ').map(word => word[0]).join('') : 'S'}
              </div>
              <div className="startup-title text-3xl font-bold mb-2 text-white">{startup.startupName}</div>
              <div className="startup-tagline text-lg text-gray-300 mb-6">{startup.problemStatement}</div>
              <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.startupStage}</div>
                  <div className="stat-label text-gray-300 mt-1">Stage</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.headquarters}</div>
                  <div className="stat-label text-gray-300 mt-1">Location</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.teamSize}</div>
                  <div className="stat-label text-gray-300 mt-1">Team Size</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.monthlyRevenue}</div>
                  <div className="stat-label text-gray-300 mt-1">Monthly Revenue</div>
                </div>
              </div>
            </div>
            {/* Investment Card */}
            <div className="investment-card bg-white/10 border-2 border-gray-700 rounded-xl p-8 shadow-md sticky top-8">
              <div className="investment-title text-lg font-semibold mb-4 text-white">Investment Opportunity</div>
              <div className="funding-progress mb-6">
                <div className="funding-stats flex justify-between mb-2">
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.fundingAmount}</div>
                    <div className="funding-label text-gray-300 text-xs">Funding Needed</div>
                  </div>
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.fundingRoundType}</div>
                    <div className="funding-label text-gray-300 text-xs">Round Type</div>
                  </div>
                </div>
              </div>
              <button className="interest-btn w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-2">Express Interest</button>
              <div className="investment-info text-xs text-gray-300 text-center">No commitment required. Expressing interest helps us connect you with the startup.</div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="content-section bg-white/10 my-8 p-8 rounded-xl shadow-md container mx-auto">
          <div className="section-title text-2xl font-semibold mb-4 text-white">About</div>
          <div className="section-content text-gray-200 mb-8">{startup.productDescription}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Problem Statement</div>
          <div className="section-content text-gray-200 mb-8">{startup.problemStatement}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Business Model</div>
          <div className="section-content text-gray-200 mb-8">{startup.businessModel}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Industry</div>
          <div className="section-content text-gray-200 mb-8">{startup.industry && startup.industry.join(', ')}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Team</div>
          <div className="section-content text-gray-200 mb-8">
            <p><strong>Founders:</strong> {startup.founderNames}</p>
            <p><strong>Team Size:</strong> {startup.teamSize}</p>
            <p><strong>Number of Founders:</strong> {startup.numberOfFounders}</p>
          </div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Traction</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.monthlyRevenue}</div>
              <div className="text-xs text-gray-300 mt-1">Monthly Revenue</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.activeUsers}</div>
              <div className="text-xs text-gray-300 mt-1">Active Users</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.growthRate}</div>
              <div className="text-xs text-gray-300 mt-1">Growth Rate</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.customerRetention}</div>
              <div className="text-xs text-gray-300 mt-1">Customer Retention</div>
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

export default StartupsDetails; 