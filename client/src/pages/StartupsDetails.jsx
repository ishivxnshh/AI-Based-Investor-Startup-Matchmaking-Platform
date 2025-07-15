import { useParams, Link } from 'react-router-dom';
import startupsData from '../startups.js';

function StartupsDetails() {
  const { id } = useParams();
  const startup = startupsData.find(s => s.id === parseInt(id));

  if (!startup) {
    return <div className="p-8 text-center text-xl">Startup not found.</div>;
  }

  // Calculate funding progress
  const goal = parseFloat(startup.fundingGoal.replace(/[^\d.]/g, ''));
  const raised = parseFloat(startup.raised.replace(/[^\d.]/g, ''));
  const percent = Math.min(100, Math.round((raised / goal) * 100));

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

      {/* Breadcrumb */}
      <div className="breadcrumb bg-white py-4 border-b border-gray-200 px-4">
        <div className="container mx-auto">
          <Link to="/" className="text-indigo-700 hover:underline mr-2">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="ml-2">{startup.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="startup-hero bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="startup-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
              {startup.name.split(' ').map(word => word[0]).join('')}
            </div>
            <div className="startup-title text-3xl font-bold mb-2 text-gray-900">{startup.name}</div>
            <div className="startup-tagline text-lg text-gray-500 mb-6">{startup.description}</div>
            <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="stat-item text-center bg-gray-50 rounded-lg p-4">
                <div className="stat-value text-xl font-bold text-indigo-700">{startup.stage}</div>
                <div className="stat-label text-gray-500 mt-1">Stage</div>
              </div>
              <div className="stat-item text-center bg-gray-50 rounded-lg p-4">
                <div className="stat-value text-xl font-bold text-indigo-700">{startup.location}</div>
                <div className="stat-label text-gray-500 mt-1">Location</div>
              </div>
              <div className="stat-item text-center bg-gray-50 rounded-lg p-4">
                <div className="stat-value text-xl font-bold text-indigo-700">{startup.founded}</div>
                <div className="stat-label text-gray-500 mt-1">Founded</div>
              </div>
              <div className="stat-item text-center bg-gray-50 rounded-lg p-4">
                <div className="stat-value text-xl font-bold text-indigo-700">{startup.investors}</div>
                <div className="stat-label text-gray-500 mt-1">Investors</div>
              </div>
            </div>
          </div>
          {/* Investment Card */}
          <div className="investment-card bg-white border-2 border-gray-200 rounded-xl p-8 shadow-md sticky top-8">
            <div className="investment-title text-lg font-semibold mb-4 text-gray-900">Investment Opportunity</div>
            <div className="funding-progress mb-6">
              <div className="progress-bar w-full h-2 bg-gray-200 rounded mb-2 overflow-hidden">
                <div className="progress-fill h-full bg-gradient-to-r from-green-400 to-green-700" style={{ width: percent + '%' }}></div>
              </div>
              <div className="funding-stats flex justify-between mb-2">
                <div className="funding-stat text-center">
                  <div className="funding-value text-lg font-bold text-gray-900">{startup.raised}</div>
                  <div className="funding-label text-gray-500 text-xs">Raised</div>
                </div>
                <div className="funding-stat text-center">
                  <div className="funding-value text-lg font-bold text-gray-900">{startup.fundingGoal}</div>
                  <div className="funding-label text-gray-500 text-xs">Goal</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-right">{percent}% funded</div>
            </div>
            <button className="interest-btn w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-2">Express Interest</button>
            <div className="investment-info text-xs text-gray-500 text-center">No commitment required. Expressing interest helps us connect you with the startup.</div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section bg-white my-8 p-8 rounded-xl shadow-md container mx-auto">
        <div className="section-title text-2xl font-semibold mb-4 text-gray-900">Team</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {startup.team.map(member => (
            <div key={member.name} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-2">{member.initials}</div>
              <div className="font-semibold text-gray-900">{member.name}</div>
              <div className="text-xs text-gray-500">{member.role}</div>
            </div>
          ))}
        </div>
        <div className="section-title text-2xl font-semibold mb-4 text-gray-900">Financials</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-indigo-700">{startup.financials.revenue}</div>
            <div className="text-xs text-gray-500 mt-1">Revenue</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-indigo-700">{startup.financials.growth}</div>
            <div className="text-xs text-gray-500 mt-1">Growth</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-indigo-700">{startup.financials.valuation}</div>
            <div className="text-xs text-gray-500 mt-1">Valuation</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-indigo-700">{startup.financials.burnRate}</div>
            <div className="text-xs text-gray-500 mt-1">Burn Rate</div>
          </div>
        </div>
        <div className="section-title text-2xl font-semibold mb-4 text-gray-900">Business Model</div>
        <div className="section-content text-gray-700 mb-8">{startup.businessModel}</div>
        <div className="section-title text-2xl font-semibold mb-4 text-gray-900">Market Opportunity</div>
        <div className="section-content text-gray-700">{startup.marketOpportunity}</div>
      </section>
    </div>
  );
}

export default StartupsDetails; 