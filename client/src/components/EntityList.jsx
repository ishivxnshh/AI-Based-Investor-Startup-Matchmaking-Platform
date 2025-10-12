import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select } from './ui';
import axios from 'axios';

const EntityList = ({ type, currentUserId }) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    stage: '',
    sortBy: 'relevance'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data generator for demo purposes
  const generateMockData = (type) => {
    if (type === 'startups') {
      return [
        {
          id: 1,
          name: 'PaySense',
          domain: 'fintech',
          industry: 'Financial Services',
          stage: 'Series A',
          location: 'Bangalore, India',
          description: 'AI-powered payment solutions for emerging markets.',
          funding: '$5M',
          logo: '💳'
        },
        {
          id: 2,
          name: 'EduTech Pro',
          domain: 'edtech',
          industry: 'Education',
          stage: 'Seed',
          location: 'Singapore',
          description: 'Personalized learning platform with AI tutors.',
          funding: '$1.2M',
          logo: '🎓'
        },
        {
          id: 3,
          name: 'HealthTrack',
          domain: 'healthtech',
          industry: 'Healthcare',
          stage: 'Series B',
          location: 'New York, USA',
          description: 'Wearable devices for continuous health monitoring.',
          funding: '$12M',
          logo: '❤️'
        },
        {
          id: 4,
          name: 'AgriGrow',
          domain: 'agritech',
          industry: 'Agriculture',
          stage: 'Seed',
          location: 'Nairobi, Kenya',
          description: 'IoT solutions for small-scale farmers.',
          funding: '$750K',
          logo: '🌱'
        },
        {
          id: 5,
          name: 'CleanEnergy',
          domain: 'cleantech',
          industry: 'Energy',
          stage: 'Series A',
          location: 'Berlin, Germany',
          description: 'Renewable energy optimization platform.',
          funding: '$8.5M',
          logo: '⚡'
        }
      ];
    } else {
      return [
        {
          id: 1,
          name: 'John Doe',
          company: 'TechVentures',
          role: 'Partner',
          focus: 'Fintech, AI, SaaS',
          ticketSize: '$100K - $1M',
          location: 'San Francisco, CA',
          about: 'Early-stage investor with a focus on fintech innovation.',
          avatar: '👨‍💼'
        },
        {
          id: 2,
          name: 'Sarah Chen',
          company: 'NextGen Capital',
          role: 'Managing Partner',
          focus: 'Healthtech, Biotech',
          ticketSize: '$500K - $5M',
          location: 'Boston, MA',
          about: 'Investing in breakthrough healthcare technologies.',
          avatar: '👩‍⚕️'
        },
        {
          id: 3,
          name: 'Alex Rivera',
          company: 'LatAm Ventures',
          role: 'Investment Director',
          focus: 'EdTech, Fintech',
          ticketSize: '$250K - $2M',
          location: 'Sao Paulo, Brazil',
          about: 'Supporting Latin American startups with global potential.',
          avatar: '🌎'
        },
        {
          id: 4,
          name: 'Priya Patel',
          company: 'Emerald Capital',
          role: 'Principal',
          focus: 'E-commerce, Marketplaces',
          ticketSize: '$1M - $10M',
          location: 'London, UK',
          about: 'Focusing on scalable marketplace businesses in Europe.',
          avatar: '🛍️'
        },
        {
          id: 5,
          name: 'Michael Zhang',
          company: 'Dragon Fund',
          role: 'Venture Partner',
          focus: 'AI, Blockchain, Web3',
          ticketSize: '$2M - $20M',
          location: 'Singapore',
          about: 'Investing in the future of decentralized technologies.',
          avatar: '🐉'
        }
      ];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/${type}`, { params: { ...filters, search: searchTerm } });
        // setEntities(response.data);
        
        // For demo, use mock data
        setTimeout(() => {
          const data = generateMockData(type);
          setEntities(data);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setLoading(false);
      }
    };

    fetchData();
  }, [type, filters, searchTerm]);

  const handleConnect = async (entityId) => {
    try {
      // In a real app, this would be an API call
      // await axios.post('/api/connections/request', { userId: currentUserId, entityId, entityType: type });
      
      // Update UI to show connection request sent
      setEntities(entities.map(entity => 
        entity.id === entityId ? { ...entity, connectionStatus: 'requested' } : entity
      ));
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchTerm === '' || 
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.company && entity.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const entityValue = entity[key] || '';
      return String(entityValue).toLowerCase().includes(String(value).toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Available filters based on entity type
  const industryOptions = type === 'startups' 
    ? ['Financial Services', 'Education', 'Healthcare', 'Agriculture', 'Energy']
    : ['Fintech', 'Healthtech', 'EdTech', 'E-commerce', 'AI', 'Blockchain', 'SaaS'];

  const locationOptions = [
    'San Francisco, CA',
    'New York, NY',
    'London, UK',
    'Singapore',
    'Bangalore, India',
    'Nairobi, Kenya',
    'Berlin, Germany',
    'Sao Paulo, Brazil',
    'Boston, MA'
  ];

  const stageOptions = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {type === 'startups' ? 'Startup Listings' : 'Investor Directory'}
        </h2>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Search ${type === 'startups' ? 'startups' : 'investors'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full md:w-auto">
            <Select
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
              className="text-sm"
            >
              <option value="">All Industries</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </Select>
            
            <Select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="text-sm"
            >
              <option value="">All Locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
            
            {type === 'startups' && (
              <Select
                value={filters.stage}
                onChange={(e) => setFilters({...filters, stage: e.target.value})}
                className="text-sm"
              >
                <option value="">All Stages</option>
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </Select>
            )}
            
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="text-sm"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="newest">Newest First</option>
              {type === 'startups' ? (
                <option value="funding">Funding: High to Low</option>
              ) : (
                <option value="ticketSize">Ticket Size: High to Low</option>
              )}
            </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-700 rounded-lg p-6 h-32"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Entity List */}
          <div className="space-y-4">
            {currentItems.length > 0 ? (
              currentItems.map((entity) => (
                <div key={entity.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-3xl">
                      {entity.logo || entity.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg">{entity.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                            {type === 'startups' ? (
                              <>
                                <span>{entity.industry}</span>
                                <span>•</span>
                                <span>{entity.stage}</span>
                                <span>•</span>
                                <span>{entity.location}</span>
                                <span>•</span>
                                <span className="text-green-400">{entity.funding} raised</span>
                              </>
                            ) : (
                              <>
                                <span>{entity.company}</span>
                                <span>•</span>
                                <span>{entity.role}</span>
                                <span>•</span>
                                <span>{entity.location}</span>
                                <span>•</span>
                                <span className="text-purple-400">{entity.ticketSize}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant={entity.connectionStatus === 'requested' ? 'outline' : 'primary'}
                          disabled={entity.connectionStatus === 'requested'}
                          onClick={() => handleConnect(entity.id)}
                          className="whitespace-nowrap mt-2 md:mt-0"
                        >
                          {entity.connectionStatus === 'requested' ? 'Request Sent' : 'Connect'}
                        </Button>
                      </div>
                      
                      <p className="mt-3 text-gray-300 text-sm">
                        {entity.description || entity.about}
                      </p>
                      
                      {type === 'startups' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entity.domain && (
                            <Badge variant="secondary">{entity.domain}</Badge>
                          )}
                          {entity.industry && (
                            <Badge variant="secondary">{entity.industry}</Badge>
                          )}
                        </div>
                      )}
                      
                      {type === 'investors' && entity.focus && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entity.focus.split(', ').map((focusArea, i) => (
                            <Badge key={i} variant="secondary">{focusArea.trim()}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                No {type} found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredEntities.length > itemsPerPage && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
                >
                  «
                </button>
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
                >
                  ‹
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show current page and 2 pages before/after
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
                >
                  ›
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
                >
                  »
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default EntityList;
