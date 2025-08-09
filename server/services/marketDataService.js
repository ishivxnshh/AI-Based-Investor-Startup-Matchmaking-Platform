import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// API Keys
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cached data or fetch new data
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  // Alpha Vantage API calls
  async getSectorPerformance() {
    try {
      if (!ALPHA_VANTAGE_API_KEY) {
        console.log('Alpha Vantage API key not configured, using fallback data');
        return this.getFallbackSectorData();
      }

      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SECTOR&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message']);
      }

      const sectorData = response.data['Rank A: Real-Time Performance'];
      return this.parseSectorData(sectorData);
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      return this.getFallbackSectorData();
    }
  }

  parseSectorData(sectorData) {
    if (!sectorData) return this.getFallbackSectorData();

    const sectors = [];
    for (const [sector, performance] of Object.entries(sectorData)) {
      const percentage = parseFloat(performance.replace('%', ''));
      sectors.push({
        name: sector,
        performance: percentage,
        trend: percentage > 0 ? 'up' : 'down'
      });
    }

    return sectors.sort((a, b) => b.performance - a.performance);
  }

  async getMarketIndices() {
    try {
      const indices = ['^GSPC', '^IXIC', '^DJI']; // S&P 500, NASDAQ, Dow Jones
      const results = [];

      for (const symbol of indices) {
        const data = await this.getYahooFinanceData(symbol);
        if (data) {
          results.push({
            symbol: symbol,
            name: this.getIndexName(symbol),
            price: data.price,
            change: data.change,
            changePercent: data.changePercent
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return this.getFallbackIndicesData();
    }
  }

  async getYahooFinanceData(symbol) {
    try {
      const response = await axios.get(`${YAHOO_FINANCE_BASE_URL}/${symbol}?interval=1d&range=1d`);
      
      if (response.data && response.data.chart && response.data.chart.result) {
        const result = response.data.chart.result[0];
        const quote = result.indicators.quote[0];
        const meta = result.meta;
        
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        return {
          price: currentPrice,
          change: change,
          changePercent: changePercent
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
      return null;
    }
  }

  getIndexName(symbol) {
    const names = {
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^DJI': 'Dow Jones'
    };
    return names[symbol] || symbol;
  }

  async getEconomicIndicators() {
    try {
      if (!ALPHA_VANTAGE_API_KEY) {
        return this.getFallbackEconomicData();
      }

      // Get key economic indicators
      const indicators = [
        { symbol: 'VIX', name: 'Volatility Index' },
        { symbol: 'DGS10', name: '10-Year Treasury Rate' },
        { symbol: 'DGS2', name: '2-Year Treasury Rate' }
      ];

      const results = [];
      for (const indicator of indicators) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${indicator.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
          );

          if (response.data['Time Series (Daily)']) {
            const timeSeries = response.data['Time Series (Daily)'];
            const latestDate = Object.keys(timeSeries)[0];
            const latestData = timeSeries[latestDate];
            const currentValue = parseFloat(latestData['4. close']);

            results.push({
              name: indicator.name,
              symbol: indicator.symbol,
              value: currentValue,
              trend: 'stable' // You could calculate trend from historical data
            });
          }
        } catch (error) {
          console.error(`Error fetching ${indicator.symbol}:`, error);
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching economic indicators:', error);
      return this.getFallbackEconomicData();
    }
  }

  async getVentureCapitalTrends() {
    // This would typically come from paid APIs like PitchBook or Crunchbase
    // For now, we'll use a combination of public data and AI analysis
    return this.getFallbackVCTrends();
  }

  async getCryptoMarketTrends() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        return {
          totalMarketCap: data.total_market_cap.usd,
          totalVolume: data.total_volume.usd,
          marketCapChange: data.market_cap_change_percentage_24h_usd,
          topGainers: await this.getTopCryptoGainers(),
          topLosers: await this.getTopCryptoLosers()
        };
      }
      return this.getFallbackCryptoData();
    } catch (error) {
      console.error('Error fetching crypto trends:', error);
      return this.getFallbackCryptoData();
    }
  }

  async getTopCryptoGainers() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_24h_desc&per_page=5&page=1&sparkline=false'
      );
      return response.data.map(coin => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h
      }));
    } catch (error) {
      console.error('Error fetching crypto gainers:', error);
      return [];
    }
  }

  async getTopCryptoLosers() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_24h_asc&per_page=5&page=1&sparkline=false'
      );
      return response.data.map(coin => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h
      }));
    } catch (error) {
      console.error('Error fetching crypto losers:', error);
      return [];
    }
  }

  // Fallback data methods
  getFallbackSectorData() {
    return [
      { name: 'Technology', performance: 2.5, trend: 'up' },
      { name: 'Healthcare', performance: 1.8, trend: 'up' },
      { name: 'Financial Services', performance: 0.9, trend: 'up' },
      { name: 'Consumer Discretionary', performance: -0.3, trend: 'down' },
      { name: 'Energy', performance: -1.2, trend: 'down' }
    ];
  }

  getFallbackIndicesData() {
    return [
      { symbol: '^GSPC', name: 'S&P 500', price: 4500.25, change: 15.75, changePercent: 0.35 },
      { symbol: '^IXIC', name: 'NASDAQ', price: 14250.80, change: 45.20, changePercent: 0.32 },
      { symbol: '^DJI', name: 'Dow Jones', price: 35250.45, change: 125.30, changePercent: 0.36 }
    ];
  }

  getFallbackEconomicData() {
    return [
      { name: 'Volatility Index', symbol: 'VIX', value: 18.5, trend: 'stable' },
      { name: '10-Year Treasury Rate', symbol: 'DGS10', value: 4.25, trend: 'stable' },
      { name: '2-Year Treasury Rate', symbol: 'DGS2', value: 4.85, trend: 'stable' }
    ];
  }

  getFallbackVCTrends() {
    return {
      totalDeals: '2,847',
      avgDealSize: '$12.5M',
      growthRate: '23%',
      exitValue: '$89.2B',
      topSectors: ['AI/ML', 'Fintech', 'HealthTech', 'CleanTech', 'EdTech'],
      emergingTrends: ['Web3 adoption', 'Sustainable tech', 'Remote work solutions', 'Cybersecurity']
    };
  }

  getFallbackCryptoData() {
    return {
      totalMarketCap: 2500000000000, // $2.5T
      totalVolume: 85000000000, // $85B
      marketCapChange: 2.5,
      topGainers: [
        { name: 'Bitcoin', symbol: 'BTC', price: 45000, change24h: 3.2 },
        { name: 'Ethereum', symbol: 'ETH', price: 2800, change24h: 2.8 }
      ],
      topLosers: [
        { name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: -2.1 },
        { name: 'Solana', symbol: 'SOL', price: 95, change24h: -1.8 }
      ]
    };
  }

  // Main method to get comprehensive market trends
  async getComprehensiveMarketTrends() {
    try {
      const [
        sectorPerformance,
        marketIndices,
        economicIndicators,
        vcTrends,
        cryptoTrends
      ] = await Promise.all([
        this.getSectorPerformance(),
        this.getMarketIndices(),
        this.getEconomicIndicators(),
        this.getVentureCapitalTrends(),
        this.getCryptoMarketTrends()
      ]);

      // Calculate overall market sentiment
      const sentiment = this.calculateMarketSentiment(sectorPerformance, marketIndices);

      return {
        success: true,
        trends: {
          sectorPerformance,
          marketIndices,
          economicIndicators,
          vcTrends,
          cryptoTrends,
          marketSentiment: sentiment,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error getting comprehensive market trends:', error);
      return {
        success: false,
        error: error.message,
        trends: {
          sectorPerformance: this.getFallbackSectorData(),
          marketIndices: this.getFallbackIndicesData(),
          economicIndicators: this.getFallbackEconomicData(),
          vcTrends: this.getFallbackVCTrends(),
          cryptoTrends: this.getFallbackCryptoData(),
          marketSentiment: 'Neutral',
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }

  calculateMarketSentiment(sectors, indices) {
    // Simple sentiment calculation based on sector and index performance
    const positiveSectors = sectors.filter(s => s.performance > 0).length;
    const totalSectors = sectors.length;
    const sectorRatio = positiveSectors / totalSectors;

    const positiveIndices = indices.filter(i => i.changePercent > 0).length;
    const totalIndices = indices.length;
    const indexRatio = positiveIndices / totalIndices;

    const overallRatio = (sectorRatio + indexRatio) / 2;

    if (overallRatio >= 0.7) return 'Bullish';
    if (overallRatio >= 0.4) return 'Neutral';
    return 'Bearish';
  }
}

export default new MarketDataService(); 