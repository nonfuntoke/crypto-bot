import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TokenAnalysis } from '../../types/token';
import axios from 'axios';
import { sleep } from '../../utils/common';

export class SolanaTokenService {
  private static connection = new Connection(import.meta.env.VITE_SOL_RPC_URL);
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  static async fetchTokenData(address: string): Promise<Token> {
    try {
      // Validate Solana address
      if (!address) {
        throw new Error('Token address is required');
      }

      let pubKey: PublicKey;
      try {
        pubKey = new PublicKey(address);
        if (!PublicKey.isOnCurve(pubKey.toBytes())) {
          throw new Error('Invalid Solana address format');
        }
      } catch (error) {
        throw new Error('Invalid Solana address format');
      }
      
      // Fetch token metadata with retries
      const tokenMetadata = await this.retryOperation(
        () => this.getTokenMetadata(address),
        'Failed to fetch token metadata'
      );

      // Get market data with retries
      const marketData = await this.retryOperation(
        () => this.getMarketData(address),
        'Failed to fetch market data'
      );

      // Verify token exists on-chain
      const accountInfo = await this.connection.getParsedAccountInfo(pubKey);
      if (!accountInfo.value) {
        throw new Error('Token not found on Solana blockchain');
      }

      return {
        address: address,
        name: tokenMetadata.name || 'Unknown Token',
        symbol: tokenMetadata.symbol || 'UNKNOWN',
        decimals: tokenMetadata.decimals || 9,
        chain: 'SOL',
        marketCap: marketData.marketCap,
        price: marketData.price,
        volume24h: marketData.volume24h,
        socialMetrics: {
          twitterFollowers: 0,
          telegramMembers: 0,
          redditSubscribers: 0
        },
        riskMetrics: {
          liquidityScore: marketData.liquidityScore,
          contractAudit: false,
          ownershipRenounced: true,
          honeypotRisk: marketData.honeypotRisk || 0
        }
      };
    } catch (error) {
      console.error('Error fetching Solana token:', error);
      throw new Error(error.message || 'Failed to fetch Solana token data');
    }
  }

  private static async retryOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < this.MAX_RETRIES - 1) {
          await sleep(this.RETRY_DELAY * (i + 1));
        }
      }
    }
    
    throw new Error(`${errorMessage}: ${lastError?.message || 'Unknown error'}`);
  }

  private static async getTokenMetadata(address: string) {
    const response = await axios.get(`https://api.solscan.io/token/meta?token=${address}`);
    if (!response.data || response.data.error) {
      throw new Error(response.data?.error || 'Invalid response from Solscan');
    }
    
    return {
      name: response.data.name,
      symbol: response.data.symbol,
      decimals: response.data.decimals
    };
  }

  private static async getMarketData(address: string) {
    // Get price from Jupiter
    const jupiterResponse = await axios.get(`https://price.jup.ag/v4/price?ids=${address}`);
    const price = jupiterResponse.data?.data?.[address]?.price || 0;
    
    // Get market data from Solscan
    const marketResponse = await axios.get(`https://api.solscan.io/market?token=${address}`);
    const marketData = marketResponse.data;
    
    // Calculate honeypot risk based on various factors
    const honeypotRisk = this.calculateHoneypotRisk(marketData);
    
    return {
      price,
      marketCap: marketData.marketCap || 0,
      volume24h: marketData.volume24h || 0,
      liquidityScore: this.calculateLiquidityScore(marketData),
      honeypotRisk
    };
  }

  private static calculateLiquidityScore(marketData: any): number {
    if (!marketData.liquidity || !marketData.volume24h) {
      return 0.2;
    }

    const liquidityRatio = marketData.liquidity / marketData.volume24h;
    return Math.min(Math.max(liquidityRatio, 0.2), 0.8);
  }

  private static calculateHoneypotRisk(marketData: any): number {
    let risk = 0;

    // Low liquidity relative to market cap
    if (marketData.liquidity && marketData.marketCap) {
      const liquidityRatio = marketData.liquidity / marketData.marketCap;
      if (liquidityRatio < 0.1) risk += 0.3;
    }

    // Low trading volume
    if (marketData.volume24h < 10000) {
      risk += 0.2;
    }

    // High price impact
    if (marketData.priceChange?.h24 > 50) {
      risk += 0.3;
    }

    return Math.min(risk, 1);
  }

  static async analyzeToken(address: string): Promise<TokenAnalysis> {
    try {
      const token = await this.fetchTokenData(address);
      
      const analysis: string[] = [];
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
      let buySignal = false;

      // Market cap analysis
      if (token.marketCap > 1000000) {
        analysis.push('Market cap is significant');
        riskLevel = 'MEDIUM';
      }

      // Volume analysis
      if (token.volume24h > 100000) {
        analysis.push('Good trading volume');
        riskLevel = token.riskMetrics.liquidityScore > 0.5 ? 'LOW' : 'MEDIUM';
      }

      // Liquidity analysis
      if (token.riskMetrics.liquidityScore > 0.8) {
        analysis.push('High liquidity');
        riskLevel = 'LOW';
      }

      // Honeypot risk analysis
      if (token.riskMetrics.honeypotRisk < 0.3) {
        analysis.push('Low honeypot risk');
      } else if (token.riskMetrics.honeypotRisk > 0.7) {
        analysis.push('High honeypot risk - Exercise caution');
        riskLevel = 'HIGH';
      }

      // Program verification
      const programInfo = await this.connection.getParsedAccountInfo(new PublicKey(address));
      if (programInfo.value) {
        analysis.push('Token contract exists and is active');
      }

      // Buy signal determination
      buySignal = riskLevel === 'LOW' && 
                  token.volume24h > 50000 &&
                  token.riskMetrics.liquidityScore > 0.7 &&
                  token.riskMetrics.honeypotRisk < 0.3;

      return {
        token,
        buySignal,
        riskLevel,
        analysis
      };
    } catch (error) {
      console.error('Solana token analysis error:', error);
      throw new Error(`Failed to analyze token: ${error.message}`);
    }
  }
}