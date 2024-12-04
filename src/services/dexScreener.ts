import axios from 'axios';
import { Chain } from '../types/token';

interface DexScreenerPair {
  chainId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  liquidity: {
    usd: number;
  };
  volume: {
    h24: number;
  };
  createdAt: number;
}

export class DexScreenerService {
  private static readonly API_URL = 'https://api.dexscreener.com/latest';

  static async getNewPairs(chain: Chain): Promise<DexScreenerPair[]> {
    try {
      const response = await axios.get(`${this.API_URL}/dex/pairs/${chain.toLowerCase()}`);
      
      return response.data.pairs
        .filter((pair: DexScreenerPair) => {
          const hoursSinceCreation = (Date.now() - pair.createdAt) / (1000 * 60 * 60);
          return hoursSinceCreation <= 24; // Only pairs created in the last 24 hours
        })
        .sort((a: DexScreenerPair, b: DexScreenerPair) => b.liquidity.usd - a.liquidity.usd);
    } catch (error) {
      console.error('Error fetching new pairs:', error);
      throw new Error('Failed to fetch new pairs from DexScreener');
    }
  }

  static async getPairInfo(pairAddress: string, chain: Chain): Promise<DexScreenerPair> {
    try {
      const response = await axios.get(`${this.API_URL}/dex/pairs/${chain.toLowerCase()}/${pairAddress}`);
      return response.data.pair;
    } catch (error) {
      console.error('Error fetching pair info:', error);
      throw new Error('Failed to fetch pair info from DexScreener');
    }
  }
}