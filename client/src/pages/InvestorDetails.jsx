import { useParams, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const mockInvestor = {
  id: 1,
  name: 'John Doe',
  focus: 'Fintech, SaaS, Seed-Stage',
  description: 'Angel investor with a focus on early-stage technology startups.',
  industry: 'fintech',
  location: 'San Francisco, CA',
  minInvestment: 50000,
  maxInvestment: 500000,
  pastInvestments: ['Startup A', 'Startup B', 'Startup C'],
  investmentCriteria: 'Looking for early-stage tech startups with strong founding teams',
  about: 'Experienced angel investor with 10+ years in venture capital. Specializes in fintech and SaaS companies.',
  contact: 'john.doe@example.com'
};

function InvestorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, you would fetch the investor data based on the ID
  const investor = mockInvestor;

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
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => navigate('/startup-dashboard')} className="hover:text-purple-300">Home</button>
            <button onClick={() => navigate('/investor-search')} className="hover:text-purple-300">Investors</button>
            <button onClick={() => navigate('/chat')} className="ml-4 p-2 rounded-full hover:bg-indigo-800 transition flex items-center" title="Chat">
              <img src={assets.chat_icon} alt="Chat" className="w-8 h-8" />
            </button>
          </nav>
        </header>

        {/* Breadcrumb */}
        <div className="breadcrumb bg-white/10 py-4 border-b border-gray-700 px-4">
          <div className="container mx-auto">
            <button onClick={() => navigate('/startup-dashboard')} className="text-indigo-300 hover:underline mr-2 bg-transparent">Home</button>
            <span className="text-gray-400">/</span>
            <button onClick={() => navigate('/investor-search')} className="text-indigo-300 hover:underline mx-2 bg-transparent">Investors</button>
            <span className="text-gray-400">/</span>
            <span className="ml-2 text-white font-semibold">{investor.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="investor-hero py-12 border-b border-gray-700">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="investor-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
                {investor.name.split(' ').map(word => word[0]).join('')}
              </div>
              <div className="investor-title text-3xl font-bold mb-2 text-white">{investor.name}</div>
              <div className="investor-focus text-lg text-purple-300 mb-2">{investor.focus}</div>
              <div className="investor-description text-gray-300 mb-6">{investor.description}</div>
              <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{investor.location}</div>
                  <div className="stat-label text-gray-300 mt-1">Location</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">${investor.minInvestment.toLocaleString()}-${investor.maxInvestment.toLocaleString()}</div>
                  <div className="stat-label text-gray-300 mt-1">Investment Range</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{investor.pastInvestments.length}</div>
                  <div className="stat-label text-gray-300 mt-1">Past Investments</div>
                </div>
              </div>
            </div>
            {/* Action Card */}
            <div className="action-card bg-white/10 border-2 border-gray-700 rounded-xl p-8 shadow-md sticky top-8">
              <div className="action-title text-lg font-semibold mb-4 text-white">Request Meeting</div>
              <button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-4">
                Apply for Meeting
              </button>
              <div className="contact-info">
                <div className="text-sm text-gray-300 mb-2">Contact:</div>
                <div className="text-indigo-300">{investor.contact}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="content-section bg-white/10 my-8 p-8 rounded-xl shadow-md container mx-auto">
          <div className="section-title text-2xl font-semibold mb-4 text-white">About</div>
          <div className="section-content text-gray-200 mb-8">{investor.about}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Investment Criteria</div>
          <div className="section-content text-gray-200 mb-8">{investor.investmentCriteria}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Past Investments</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investor.pastInvestments.map((investment, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="text-white font-medium">{investment}</div>
              </div>
            ))}
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

export default InvestorDetails;