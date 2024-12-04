import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { TokenInfo } from '../../types/token';

export class SolanaTokenAnalyzer {
  private static connection = new Connection('https://api.mainnet-beta.solana.com');

  static async getHolderCount(tokenAddress: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://public-api.solscan.io/token/holders/count?tokenAddress=${tokenAddress}`
      );
      return response.data.count;
    } catch (error) {
      console.error('Error getting holder count:', error);
      throw error;
    }
  }

  static async getHolderHistory(tokenAddress: string): Promise<{
    count: number;
    timestamp: number;
  }[]> {
    try {
      const response = await axios.get(
        `https://public-api.solscan.io/token/holders/history?tokenAddress=${tokenAddress}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting holder history:', error);
      throw error;
    }
  }

  static async analyzeHolderGrowth(tokenAddress: string): Promise<{
    growthRate: number;
    isIncreasing: boolean;
  }> {
    const history = await this.getHolderHistory(tokenAddress);
    if (history.length < 2) return { growthRate: 0, isIncreasing: false };

    const recent = history.slice(-2);
    const growthRate = 
      ((recent[1].count - recent[0].count) / recent[0].count) * 100;

    return {
      growthRate,
      isIncreasing: growthRate > 0
    };
  }

  static async getTokenMetadata(tokenAddress: string): Promise<TokenInfo> {
    try {
      const response = await axios.get(
        `https://public-api.solscan.io/token/meta?tokenAddress=${tokenAddress}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting token metadata:', error);
      throw error;
    }
  }

  static async isRugSafe(tokenAddress: string): Promise<{
    isSafe: boolean;
    reasons: string[];
  }> {
    try {
      // Check token metadata
      const metadata = await this.getTokenMetadata(tokenAddress);
      const reasons: string[] = [];

      // Check if token has verified creator
      if (!metadata.creatorVerified) {
        reasons.push('Creator not verified');
      }

      // Check holder distribution
      const holders = await this.getHolderCount(tokenAddress);
      if (holders < 100) {
        reasons.push('Low holder count');
      }

      // Check if token is frozen
      const tokenInfo = await this.connection.getParsedAccountInfo(
        new PublicKey(tokenAddress)
      );
      if (!tokenInfo.value) {
        reasons.push('Token account not found');
      }

      return {
        isSafe: reasons.length === 0,
        reasons
      };
    } catch (error) {
      console.error('Error checking rug safety:', error);
      throw error;
    }
  }

  static async getMarketCap(tokenAddress: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://public-api.solscan.io/token/market?tokenAddress=${tokenAddress}`
      );
      return response.data.marketCap || 0;
    } catch (error) {
      console.error('Error getting market cap:', error);
      throw error;
    }
  }
}