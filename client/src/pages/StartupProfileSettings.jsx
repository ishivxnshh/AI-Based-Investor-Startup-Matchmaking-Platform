import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import axios from 'axios';

const industries = [
  'Fintech', 'AI', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 
  'Blockchain', 'CleanTech', 'AgriTech', 'Consumer', 'Other'
];
const stages = [
  'Idea', 'MVP', 'Early Traction', 'Growth', 'Scale-up'
];
const useOfFundsOptions = [
  'Product Development', 'Marketing', 'Hiring', 'Operations', 'Expansion', 'Other'
];
const markets = [
  'India', 'US', 'SE Asia', 'Europe', 'Global', 'Tier-1 cities', 'Emerging markets'
];
const fundingRounds = [
  'Pre-Seed', 'Seed', 'Angel', 'Series A', 'Series B', 'Series C+', 'Bridge', 'Other'
];

const StartupProfileSettings = () => {
  const [profile, setProfile] = useState({
    startupName: '',
    websiteUrl: '',
    founderNames: '',
    email: '',
    phone: '',
    linkedinProfiles: '',
    numberOfFounders: '',
    teamSize: '',
    founderBackground: '',
    previousStartupExperience: '',
    teamSkills: [],
    industry: [],
    problemStatement: '',
    productDescription: '',
    businessModel: '',
    techStack: '',
    startupStage: '',
    monthlyRevenue: '',
    activeUsers: '',
    fundingRaised: '',
    customerRetention: '',
    growthRate: '',
    fundingAmount: '',
    useOfFunds: [],
    fundingRoundType: '',
    equityOffering: '',
    headquarters: '',
    operatingMarkets: [],
    expansionPlan: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/forms/startup-form/${user._id}`)
        .then(res => {
          if (res.data) {
            setProfile(prev => ({
              ...prev,
              ...res.data,
              email: res.data.email || user.email || ''
            }));
          } else {
            setProfile(prev => ({
              ...prev,
              email: user.email || ''
            }));
          }
        })
        .catch(() => {
          setProfile(prev => ({
            ...prev,
            email: user.email || ''
          }));
        });
    } else if (user && user.email) {
      setProfile(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProfile(prev => {
        const arr = prev[name] || [];
        if (checked) {
          return { ...prev, [name]: [...arr, value] };
        } else {
          return { ...prev, [name]: arr.filter(item => item !== value) };
        }
      });
    } else if (type === 'radio') {
      setProfile(prev => ({ ...prev, [name]: value }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user._id) {
      alert('User not logged in');
      setLoading(false);
      return;
    }
    // Check if at least one field (other than email) is filled
    const fieldsToCheck = { ...profile };
    delete fieldsToCheck.email;
    const hasAnyValue = Object.values(fieldsToCheck).some(val => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== '' && val !== null && val !== undefined;
    });
    if (!hasAnyValue) {
      alert('Please fill at least one field to save your profile.');
      setLoading(false);
      return;
    }
    // Normalize previousStartupExperience for backend
    let normalizedProfile = { ...profile };
    if (normalizedProfile.previousStartupExperience === '') {
      normalizedProfile.previousStartupExperience = undefined;
    } else if (normalizedProfile.previousStartupExperience === 'true') {
      normalizedProfile.previousStartupExperience = true;
    } else if (normalizedProfile.previousStartupExperience === 'false') {
      normalizedProfile.previousStartupExperience = false;
    }
    try {
      await axios.put('http://localhost:5000/api/forms/startup-form', {
        ...normalizedProfile,
        userId: user._id
      });
      localStorage.setItem('currentUser', JSON.stringify({ ...user, ...normalizedProfile }));
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={assets.logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
        </header>
        <section className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2">Startup Profile Settings</h1>
          <p className="mt-2 text-gray-300 text-lg">Update your startup profile details below.</p>
        </section>
        <section className="max-w-3xl mx-auto bg-white/10 rounded-xl p-8 border border-gray-700 shadow-lg mb-16">
          <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Basic Information */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Startup Name</label>
                <input type="text" name="startupName" value={profile.startupName} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Startup name" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Email</label>
                <input type="email" name="email" value={profile.email} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" disabled placeholder="Email address" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Website URL</label>
                <input type="text" name="websiteUrl" value={profile.websiteUrl} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Website URL" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Phone</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Phone number" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Founder Names</label>
                <input type="text" name="founderNames" value={profile.founderNames} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Founder names" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">LinkedIn Profiles</label>
                <input type="text" name="linkedinProfiles" value={profile.linkedinProfiles} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="LinkedIn URLs (comma separated)" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Number of Founders</label>
                <input type="number" name="numberOfFounders" value={profile.numberOfFounders} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" min="1" placeholder="Number of founders" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Team Size</label>
                <input type="number" name="teamSize" value={profile.teamSize} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" min="1" placeholder="Team size" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Founder Background</label>
              <textarea name="founderBackground" value={profile.founderBackground} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="Brief background of founders" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Previous Startup Experience?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="previousStartupExperience" value="true" checked={profile.previousStartupExperience === 'true'} onChange={handleProfileChange} className="accent-violet-500" /> Yes</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="previousStartupExperience" value="false" checked={profile.previousStartupExperience === 'false'} onChange={handleProfileChange} className="accent-violet-500" /> No</label>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Team Skills</label>
              <input type="text" name="teamSkills" value={profile.teamSkills.join(', ')} onChange={e => setProfile(prev => ({ ...prev, teamSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="E.g. Marketing, Tech, Sales (comma separated)" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Industry</label>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <label key={ind} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="industry" value={ind} checked={profile.industry.includes(ind)} onChange={handleProfileChange} className="accent-violet-500" /> {ind}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Problem Statement</label>
              <textarea name="problemStatement" value={profile.problemStatement} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="What problem are you solving?" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Product Description</label>
              <textarea name="productDescription" value={profile.productDescription} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="Describe your product" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Business Model</label>
              <input type="text" name="businessModel" value={profile.businessModel} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Describe your business model" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Tech Stack</label>
              <input type="text" name="techStack" value={profile.techStack} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="E.g. React, Node.js, Python" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Startup Stage</label>
              <select name="startupStage" value={profile.startupStage} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                <option value="">Select</option>
                {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Monthly Revenue</label>
                <input type="text" name="monthlyRevenue" value={profile.monthlyRevenue} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Monthly revenue" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Active Users</label>
                <input type="text" name="activeUsers" value={profile.activeUsers} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Number of active users" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Funding Raised</label>
                <input type="text" name="fundingRaised" value={profile.fundingRaised} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Total funding raised" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Customer Retention</label>
                <input type="text" name="customerRetention" value={profile.customerRetention} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Customer retention rate" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Growth Rate</label>
                <input type="text" name="growthRate" value={profile.growthRate} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Growth rate" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Funding Amount Sought</label>
                <input type="text" name="fundingAmount" value={profile.fundingAmount} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Amount seeking to raise" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Use of Funds</label>
              <div className="flex flex-wrap gap-2">
                {useOfFundsOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="useOfFunds" value={opt} checked={profile.useOfFunds.includes(opt)} onChange={handleProfileChange} className="accent-violet-500" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Funding Round Type</label>
                <select name="fundingRoundType" value={profile.fundingRoundType} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="">Select</option>
                  {fundingRounds.map(round => <option key={round} value={round}>{round}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Equity Offering (%)</label>
                <input type="text" name="equityOffering" value={profile.equityOffering} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Equity %" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Headquarters</label>
                <input type="text" name="headquarters" value={profile.headquarters} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Headquarters location" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Operating Markets</label>
                <div className="flex flex-wrap gap-2">
                  {markets.map(market => (
                    <label key={market} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                      <input type="checkbox" name="operatingMarkets" value={market} checked={profile.operatingMarkets.includes(market)} onChange={handleProfileChange} className="accent-violet-500" /> {market}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Expansion Plan</label>
              <textarea name="expansionPlan" value={profile.expansionPlan} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="Describe your expansion plans" />
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-700 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition text-lg flex items-center gap-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>
      </div>
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  );
};

export default StartupProfileSettings; 