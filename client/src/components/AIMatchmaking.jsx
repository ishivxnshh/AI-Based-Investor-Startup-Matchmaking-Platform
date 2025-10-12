import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import axios from 'axios';

const AIMatchmaking = ({ userType, userId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minScore: 70,
    industry: '',
    location: '',
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/matchmaking/${userType}/${userId}`, {
          params: filters
        });
        setMatches(response.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
        // For demo purposes, we'll use mock data if the API fails
        setMatches(generateMockMatches(userType));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userType, userId, filters]);

  const generateMockMatches = (type) => {
    if (type === 'startup') {
      return [
        {
          id: 1,
          name: 'John Doe',
          type: 'Investor',
          company: 'TechVentures',
          score: 92,
          reason: 'Specializes in early-stage fintech startups with strong growth metrics.',
          focus: 'Fintech, Seed-Stage',
          location: 'San Francisco, CA',
          avatar: '👨‍💼'
        },
        {
          id: 2,
          name: 'Sarah Chen',
          type: 'Investor',
          company: 'NextGen Capital',
          score: 88,
          reason: 'Looking for AI-powered solutions in the financial sector.',
          focus: 'AI, Fintech',
          location: 'New York, NY',
          avatar: '👩‍💼'
        }
      ];
    } else {
      return [
        {
          id: 1,
          name: 'PaySense',
          type: 'Startup',
          industry: 'Fintech',
          score: 95,
          reason: 'Strong team with proven track record in payment solutions.',
          stage: 'Series A',
          location: 'Bangalore, India',
          avatar: '💳'
        },
        {
          id: 2,
          name: 'EduTech Pro',
          type: 'Startup',
          industry: 'EdTech',
          score: 87,
          reason: 'Innovative platform with rapid user growth in emerging markets.',
          stage: 'Seed',
          location: 'Singapore',
          avatar: '🎓'
        }
      ];
    }
  };

  const handleConnect = async (matchId) => {
    try {
      await axios.post('/api/matchmaking/connect', { matchId, userId });
      // Update UI to show connection request sent
      setMatches(matches.map(match => 
        match.id === matchId ? { ...match, connectionStatus: 'requested' } : match
      ));
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI-Powered Matchmaking</h2>
        <div className="flex gap-2">
          <select 
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
            value={filters.minScore}
            onChange={(e) => setFilters({...filters, minScore: e.target.value})}
          >
            <option value="70">70%+ Match</option>
            <option value="80">80%+ Match</option>
            <option value="90">90%+ Match</option>
          </select>
          <input
            type="text"
            placeholder="Filter by industry..."
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm w-40"
            value={filters.industry}
            onChange={(e) => setFilters({...filters, industry: e.target.value})}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-700 rounded-lg p-4 h-32"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {match.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{match.name}</h3>
                      <p className="text-sm text-gray-400">
                        {match.type === 'Startup' 
                          ? `${match.industry} • ${match.stage} • ${match.location}`
                          : `${match.company} • ${match.focus} • ${match.location}`}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        match.score > 90 ? 'success' : 
                        match.score > 80 ? 'primary' : 'warning'
                      }
                      size="lg"
                    >
                      {match.score}% Match
                    </Badge>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">
                    <span className="font-semibold">Why this match?</span> {match.reason}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm" 
                      variant={match.connectionStatus === 'requested' ? 'outline' : 'primary'}
                      disabled={match.connectionStatus === 'requested'}
                      onClick={() => handleConnect(match.id)}
                    >
                      {match.connectionStatus === 'requested' ? 'Connection Requested' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No matches found. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AIMatchmaking;
