import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import assets from '../assets/assets';
import AIPitchFeedback from '../components/AIPitchFeedback';
import AIMatchmaking from '../components/AIMatchmaking';
import EntityList from '../components/EntityList';
import { Card, Button, Badge, Skeleton } from '../components/ui';
import Navbar from '../components/Navbar';
import axios from 'axios';
// Removed chat drawer imports

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
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [startupData, setStartupData] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [matchedInvestors, setMatchedInvestors] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [tractionMetrics, setTractionMetrics] = useState({
    mrr: '$0',
    users: '0',
    growth: '0%'
  });
  // Removed tabs from dashboard
  // const [monthlyUpdate, setMonthlyUpdate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  // const [dragOver, setDragOver] = useState(false);
  // const [userName, setUserName] = useState('');
  const [aiFeedbackKeyPoints, setAiFeedbackKeyPoints] = useState([]);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  // Calculate profile completeness based on startup form data
  const calculateProfileCompleteness = (data) => {
    if (!data) {
      console.log('⚠️ No data provided to calculateProfileCompleteness');
      return 0;
    }

    console.log('🔍 Calculating completeness for data:', Object.keys(data));

    const requiredFields = [
      'startupName',
      'websiteUrl',
      'founderNames',
      'email',
      'numberOfFounders',
      'teamSize',
      'founderBackground',
      'industry',
      'problemStatement',
      'productDescription',
      'businessModel',
      'startupStage',
      'fundingAmount',
      'fundingRoundType',
      'headquarters'
    ];

    const optionalFields = [
      'phone',
      'linkedinProfiles',
      'teamSkills',
      'techStack',
      'monthlyRevenue',
      'activeUsers',
      'fundingRaised',
      'customerRetention',
      'growthRate',
      'equityOffering',
      'operatingMarkets',
      'expansionPlan',
      'pitchDeck'
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    // Check required fields
    requiredFields.forEach(field => {
      const hasValue = data[field] && (
        Array.isArray(data[field])
          ? data[field].length > 0
          : (() => {
            const value = data[field].toString().trim();
            // Handle special cases for metrics that might have default values
            if (field === 'monthlyRevenue') {
              return value !== '$0' && value !== '0' && value !== '';
            }
            if (field === 'activeUsers') {
              return value !== '0' && value !== '';
            }
            if (field === 'customerRetention') {
              return value !== '0%' && value !== '0' && value !== '';
            }
            if (field === 'growthRate') {
              return value !== '0%' && value !== '0' && value !== '';
            }
            // For funding fields, 0 is a valid value (means no funding yet)
            if (field === 'fundingAmount' || field === 'fundingRaised') {
              return value !== '' && value !== '0';
            }
            // For other fields, just check if not empty
            return value !== '';
          })()
      );
      if (hasValue) {
        completedRequired++;
        console.log(`✅ Required field completed: ${field} = "${data[field]}"`);
      } else {
        console.log(`❌ Required field missing/empty: ${field} = "${data[field]}"`);
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const hasValue = data[field] && (
        Array.isArray(data[field])
          ? data[field].length > 0
          : (() => {
            const value = data[field].toString().trim();
            // Handle special cases for metrics that might have default values
            if (field === 'monthlyRevenue') {
              return value !== '$0' && value !== '0' && value !== '';
            }
            if (field === 'activeUsers') {
              return value !== '0' && value !== '';
            }
            if (field === 'customerRetention') {
              return value !== '0%' && value !== '0' && value !== '';
            }
            if (field === 'growthRate') {
              return value !== '0%' && value !== '0' && value !== '';
            }
            // For funding fields, 0 is a valid value (means no funding yet)
            if (field === 'fundingAmount' || field === 'fundingRaised') {
              return value !== '' && value !== '0';
            }
            // For other fields, just check if not empty
            return value !== '';
          })()
      );
      if (hasValue) {
        completedOptional++;
        console.log(`✅ Optional field completed: ${field} = "${data[field]}"`);
      } else {
        console.log(`⚪ Optional field missing/empty: ${field} = "${data[field]}"`);
      }
    });

    // Calculate percentage: 70% weight for required fields, 30% for optional fields
    const requiredPercentage = (completedRequired / requiredFields.length) * 70;
    const optionalPercentage = (completedOptional / optionalFields.length) * 30;

    const total = Math.round(requiredPercentage + optionalPercentage);
    console.log(`📊 Completeness: ${completedRequired}/${requiredFields.length} required (${Math.round(requiredPercentage)}%) + ${completedOptional}/${optionalFields.length} optional (${Math.round(optionalPercentage)}%) = ${total}%`);

    return total;
  };

  // Update traction metrics from startup data
  const updateTractionMetrics = (data) => {
    if (data) {
      // Handle string values that might have $ or % symbols
      const cleanMonthlyRevenue = data.monthlyRevenue ?
        (data.monthlyRevenue === '$0' || data.monthlyRevenue === '0' ? '$0' : data.monthlyRevenue) : '$0';

      const cleanActiveUsers = data.activeUsers ?
        (data.activeUsers === '0' ? '0' : data.activeUsers) : '0';

      const cleanGrowthRate = data.growthRate ?
        (data.growthRate === '0%' || data.growthRate === '0' ? '0%' : data.growthRate) : '0%';

      setTractionMetrics({
        mrr: cleanMonthlyRevenue,
        users: cleanActiveUsers,
        growth: cleanGrowthRate
      });
    }
  };

  // Extract key points from AI analysis
  const extractKeyPoints = (analysis) => {
    if (!analysis) return [];

    const keyPoints = [];
    const lines = analysis.split('\n');

    // Look for key sections in the AI analysis
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Detect section headers
      if (trimmedLine.includes('✅ Strengths') || trimmedLine.includes('Strengths of This Pitch Deck') || trimmedLine.includes('### ✅ Strengths')) {
        currentSection = 'strengths';
      } else if (trimmedLine.includes('⚠️ Areas for Improvement') || trimmedLine.includes('Areas for Improvement') || trimmedLine.includes('### ⚠️ Areas for Improvement')) {
        currentSection = 'improvements';
      } else if (trimmedLine.includes('📈 Investment Recommendation') || trimmedLine.includes('Investment Recommendation') || trimmedLine.includes('### 📈 Investment Recommendation')) {
        currentSection = 'recommendation';
      } else if (trimmedLine.includes('🚨 Red Flags') || trimmedLine.includes('Red Flags') || trimmedLine.includes('### 🚨 Red Flags')) {
        currentSection = 'concerns';
      } else if (trimmedLine.includes('🔧 Specific Improvement') || trimmedLine.includes('Improvement Recommendations') || trimmedLine.includes('### 🔧 Specific Improvement')) {
        currentSection = 'improvements';
      } else if (trimmedLine.includes('🎯') || trimmedLine.includes('•') || trimmedLine.includes('-') || trimmedLine.includes('*')) {
        // Extract bullet points
        if (currentSection && trimmedLine.length > 10) {
          const cleanPoint = trimmedLine
            .replace(/^[•*\s-]+/, '')
            .replace(/^🎯\s*/, '')
            .replace(/^✅\s*/, '')
            .replace(/^⚠️\s*/, '')
            .replace(/^📈\s*/, '')
            .replace(/^🚨\s*/, '')
            .replace(/^🔧\s*/, '');

          if (cleanPoint.length > 5) {
            keyPoints.push({
              type: currentSection,
              point: cleanPoint
            });
          }
        }
      } else if (trimmedLine.length > 20 && !trimmedLine.startsWith('###') && !trimmedLine.startsWith('##') && !trimmedLine.startsWith('#')) {
        // If no section is detected but we have substantial content, treat as general feedback
        if (currentSection === '') {
          currentSection = 'general';
        }

        if (currentSection && trimmedLine.length > 15) {
          keyPoints.push({
            type: currentSection,
            point: trimmedLine
          });
        }
      }
    }

    // If no key points were extracted, provide fallback points
    if (keyPoints.length === 0) {
      return [
        { type: 'strengths', point: 'AI analysis completed successfully' },
        { type: 'improvements', point: 'Review the detailed analysis for specific recommendations' },
        { type: 'recommendation', point: 'Check the full analysis for investment insights' }
      ];
    }

    return keyPoints.slice(0, 6); // Limit to 6 key points
  };

  // Get user name from localStorage
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('currentUser'));
  //   if (user && user.name) {
  //     setUserName(user.name);
  //   }
  // }, []);

  // Fetch startup data for AI analysis and profile completeness
  useEffect(() => {
    const fetchStartupData = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user && user._id) {
        try {
          console.log('🔍 Fetching startup data for user:', user._id);
          console.log('📝 User role:', user.role);

          const response = await axios.get(`http://localhost:5000/api/startups/user/${user._id}`);
          console.log('✅ Startup data response:', response.data);

          // Handle MongoDB ObjectId format
          const data = response.data.data || response.data;
          console.log('📋 Processed data:', data);

          // Clean up MongoDB ObjectId format if needed
          const cleanData = {
            ...data,
            _id: data._id?.$oid || data._id,
            userId: data.userId?.$oid || data.userId
          };

          setStartupData(cleanData);

          // Calculate and set profile completeness
          const completeness = calculateProfileCompleteness(cleanData);
          console.log('📊 Profile completeness calculated:', completeness, '%');

          setProfileCompleteness(completeness);

          // Update traction metrics with real data
          updateTractionMetrics(cleanData);
        } catch (error) {
          console.error('❌ Failed to fetch startup data:', error);
          console.error('🔍 Error response:', error.response?.data);
          console.error('🔍 Error status:', error.response?.status);

          setStartupData(null);
          setProfileCompleteness(0);
        }
      } else {
        console.log('⚠️ No user found in localStorage');
      }
    };
    fetchStartupData();
  }, []);

  // Fetch AI analysis for key points
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      if (startupData && startupData._id) {
        setAiAnalysisLoading(true);
        try {
          console.log('Fetching AI analysis for startup:', startupData._id);
          console.log('Startup data:', startupData);
          console.log('Startup _id type:', typeof startupData._id);
          console.log('Startup _id value:', startupData._id);
          const response = await axios.post(`http://localhost:5000/api/ai/analyze/${startupData._id}`);
          console.log('AI analysis response:', response.data);

          if (response.data.success && response.data.analysis) {
            const keyPoints = extractKeyPoints(response.data.analysis);
            console.log('Extracted key points:', keyPoints);
            setAiFeedbackKeyPoints(keyPoints);
          } else {
            console.log('No analysis data in response');
            // Set default key points if AI analysis fails
            setAiFeedbackKeyPoints([
              { type: 'strengths', point: 'AI analysis available for your pitch deck' },
              { type: 'improvements', point: 'Get detailed feedback on your presentation' },
              { type: 'recommendation', point: 'AI will provide investment insights' }
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch AI analysis:', error);
          console.error('Error details:', error.response?.data || error.message);

          // Set default key points if AI analysis fails
          setAiFeedbackKeyPoints([
            { type: 'strengths', point: 'AI analysis available for your pitch deck' },
            { type: 'improvements', point: 'Get detailed feedback on your presentation' },
            { type: 'recommendation', point: 'AI will provide investment insights' }
          ]);
        } finally {
          setAiAnalysisLoading(false);
        }
      } else if (startupData && (!startupData.pitchDeck || !startupData.pitchDeck.path)) {
        // No pitch deck available
        setAiFeedbackKeyPoints([
          { type: 'improvements', point: 'Upload a pitch deck to get AI analysis' },
          { type: 'recommendation', point: 'Complete your profile and add pitch deck' },
          { type: 'strengths', point: 'AI will analyze your presentation structure' }
        ]);
      } else {
        // No startup data
        setAiFeedbackKeyPoints([
          { type: 'improvements', point: 'Complete your startup profile first' },
          { type: 'recommendation', point: 'Fill out your startup form to get started' },
          { type: 'strengths', point: 'AI analysis will be available once profile is complete' }
        ]);
      }
    };

    fetchAIAnalysis();
  }, [startupData]);

  // Fetch matched investors
  useEffect(() => {
    const fetchMatchedInvestors = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user && user._id) {
        setLoadingMatches(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/matches/startup`);
          if (response.data.success) {
            setMatchedInvestors(response.data.matches);
          } else {
            console.error('Failed to fetch matched investors:', response.data.message);
            setMatchedInvestors([]);
          }
        } catch (error) {
          console.error('Error fetching matched investors:', error);
          // If it's a 404 error (no investors in database), show a helpful message
          if (error.response && error.response.status === 404) {
            setMatchedInvestors([]);
          } else {
            setMatchedInvestors([]);
          }
        } finally {
          setLoadingMatches(false);
        }
      }
    };
    fetchMatchedInvestors();
  }, []);

  // const handleAIFeedback = () => {
  //   if (!startupData || !startupData.pitchDeck || !startupData.pitchDeck.path) {
  //     navigate('/startup-form');
  //     return;
  //   }
  //   setShowAIFeedback(true);
  // };

  const handleRefreshAIFeedback = async () => {
    if (!startupData || !startupData.pitchDeck || !startupData.pitchDeck.path) {
      return;
    }

    setAiAnalysisLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/ai/analyze/${startupData._id}`);
      if (response.data.success && response.data.analysis) {
        const keyPoints = extractKeyPoints(response.data.analysis);
        setAiFeedbackKeyPoints(keyPoints);
      }
    } catch (error) {
      console.error('Failed to refresh AI analysis:', error);
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    // Here you would typically upload the file to your server
    console.log('File selected:', file.name);
  };

  // const handleFileDrop = (e) => {
  //   e.preventDefault();
  //   setDragOver(false);
  //   const files = e.dataTransfer.files;
  //   if (files.length > 0) {
  //     handleFileUpload(files[0]);
  //   }
  // };

  // const handleFileSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     handleFileUpload(file);
  //   }
  // };

  // Helper function to get investor initials for avatar
  const getInvestorInitials = (investor) => {
    if (investor.fullName) {
      return investor.fullName.split(' ').map(name => name[0]).join('').toUpperCase();
    }
    return 'IN';
  };

  // Helper function to get investor organization
  const getInvestorOrganization = (investor) => {
    return investor.organization || 'Independent Investor';
  };

  // Helper function to get AI feedback icon
  const getAIFeedbackIcon = (type) => {
    switch (type) {
      case 'strengths':
        return '✅';
      case 'improvements':
        return '⚠️';
      case 'recommendation':
        return '💡';
      case 'concerns':
        return '🚨';
      case 'general':
        return '📊';
      default:
        return '📊';
    }
  };

  // Helper function to get AI feedback color
  const getAIFeedbackColor = (type) => {
    switch (type) {
      case 'strengths':
        return 'text-green-400';
      case 'improvements':
        return 'text-yellow-400';
      case 'recommendation':
        return 'text-blue-400';
      case 'concerns':
        return 'text-red-400';
      case 'general':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 gradient-mesh-animated opacity-30 pointer-events-none" />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`,
          }}
        />
      ))}

      {/* Navbar */}
      <Navbar userType="startup" />

      {/* Header spacer */}
      <div className="space-y-8 relative z-10">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Completeness */}
          <div className="card-morph p-6 stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-2xl shadow-lg animate-pulse-glow">📊</div>
              <h3 className="text-xl font-bold">Profile Completeness</h3>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-[var(--color-text-muted)]">Completion</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${profileCompleteness === 100 ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'}`}>
                  {profileCompleteness}%
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${profileCompleteness === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-violet-600'}`}
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
            </div>
            <button
              className="w-full btn-premium ripple"
              onClick={() => navigate('/startup-onboarding')}
            >
              Complete Profile
            </button>
          </div>

          {/* Traction Metrics */}
          <div className="glass-premium p-6 rounded-3xl stagger-item spotlight">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">📈</div>
              <h3 className="text-xl font-bold">Traction Metrics</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[var(--color-bg-tertiary)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:scale-105">
                <span className="text-[var(--color-text-muted)] font-medium">Monthly Revenue</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-300 border border-green-400/30">{tractionMetrics.mrr}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[var(--color-bg-tertiary)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:scale-105">
                <span className="text-[var(--color-text-muted)] font-medium">Active Users</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-300 border border-green-400/30">{tractionMetrics.users}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[var(--color-bg-tertiary)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-all duration-300 hover:scale-105">
                <span className="text-[var(--color-text-muted)] font-medium">Growth Rate</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-300 border border-green-400/30">{tractionMetrics.growth}</span>
              </div>
            </div>
          </div>

          {/* Matched Investors */}
          <div className="holographic p-6 rounded-3xl stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">🎯</div>
              <h3 className="text-xl font-semibold">Matched Investors</h3>
            </div>
            <p className="text-[var(--color-text-muted)] mb-6">Based on your profile and industry focus</p>

            {loadingMatches ? (
              <div className="space-y-4 mb-6">
                <div className="skeleton-premium h-32 rounded-2xl" />
                <div className="skeleton-premium h-32 rounded-2xl" />
              </div>
            ) : matchedInvestors.length > 0 ? (
              <div className="space-y-4 mb-6">
                {matchedInvestors.slice(0, 3).map((match, index) => (
                  <div key={index} className="glass-premium p-4 rounded-2xl text-center hover:scale-105 transition-all duration-300 magnetic">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                      {getInvestorInitials(match.investor)}
                    </div>
                    <div className="font-semibold text-white text-lg">{match.investor.fullName || 'Unknown Investor'}</div>
                    <div className="text-sm text-gray-400 mb-3">{getInvestorOrganization(match.investor)}</div>
                    <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {match.score}% Match
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No investor matches found yet. Complete your profile to get better matches.
              </div>
            )}
            <button
              className="w-full btn-liquid"
              onClick={() => navigate('/investor-search')}
            >
              Find More Matches
            </button>
          </div>

          {/* AI Pitch Feedback */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg">🤖</div>
              <h3 className="text-xl font-semibold">AI Pitch Feedback</h3>
            </div>
            <div className="space-y-4 mb-6">
              {aiAnalysisLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-300 text-sm">Analyzing pitch deck...</span>
                </div>
              ) : aiFeedbackKeyPoints.length > 0 ? (
                aiFeedbackKeyPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {getAIFeedbackIcon(point.type)}
                    </div>
                    <div>
                      <div className={`font-semibold ${getAIFeedbackColor(point.type)}`}>{point.point}</div>
                      {point.suggestion && (
                        <p className="text-sm text-gray-300 mt-1">{point.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">No AI analysis available</div>
                  <p className="text-sm text-gray-500 mb-4">Upload your pitch deck to get AI-powered feedback</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex-1"
                      onClick={() => document.getElementById('pitch-deck-upload')?.click()}
                    >
                      Upload Pitch Deck
                    </button>
                    <input
                      id="pitch-deck-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <button
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex-1"
                      onClick={handleRefreshAIFeedback}
                      disabled={!selectedFile}
                    >
                      Analyze with AI
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
              onClick={() => setShowAIFeedback(true)}
            >
              Get Detailed Analysis
            </button>
            <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition mt-2">
              Upload New Deck
            </button>
          </div>

          {/* Messages & Meetings */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg">💬</div>
              <h3 className="text-xl font-semibold">Messages & Meetings</h3>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-purple-600/20 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Sarah Johnson - TechVentures</span>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
                <p className="text-gray-300">Interested in learning more about your traction metrics. Available for a call this week?</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Alex Chen - NextGen Capital</span>
                  <span className="text-sm text-gray-400">1 day ago</span>
                </div>
                <p className="text-gray-400">Thanks for sharing your pitch deck. Let's schedule a follow-up next week.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                onClick={() => navigate('/chat')}
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>

        {/* Featured Investors Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Investors</h2>
            <button
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              onClick={() => navigate('/investor-search')}
            >
              View All Investors →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInvestors.slice(0, 3).map((investor) => (
              <div key={investor.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {investor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold">{investor.name}</h3>
                    <p className="text-sm text-purple-400 mb-2">{investor.focus}</p>
                    <p className="text-sm text-gray-400 line-clamp-2">{investor.desc}</p>
                    <button
                      className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium"
                      onClick={() => navigate('/investor-search')}
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI sections quick access */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button className="w-full" onClick={() => navigate('/matches')}>View Matches</Button>
          <Button className="w-full" onClick={() => navigate('/investor-search')}>Explore Investors</Button>
        </div>
      </div>
      {/* AI Pitch Feedback Modal */}
      {showAIFeedback && startupData && (
        <AIPitchFeedback
          startupId={startupData._id}
          onClose={() => setShowAIFeedback(false)}
        />
      )}


    </div>
  );
};

export default StartupDashboard;