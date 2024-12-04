import { Token, TokenAnalysis, Chain } from '../types/token';
import { TokenService } from './tokenService';
import { DexScreenerService } from './dexScreener';
import { TwitterService } from './twitterService';
import { SecurityService } from './securityService';

export class TokenDiscoveryService {
  static async scanNewTokens(chain: Chain): Promise<Token[]> {
    try {
      // Get new pairs from DexScreener
      const newPairs = await DexScreenerService.getNewPairs(chain);
      
      // Filter pairs based on initial criteria
      const potentialTokens = newPairs.filter(pair => {
        return pair.liquidity.usd >= 50000 && // Minimum liquidity $50k
               pair.volume.h24 >= 10000;      // Minimum 24h volume $10k
      });

      const tokens: Token[] = [];
      
      for (const pair of potentialTokens) {
        try {
          const token = await TokenService.fetchBasicTokenInfo(pair.baseToken.address, chain);
          tokens.push(token);
        } catch (error) {
          console.error(`Error processing token ${pair.baseToken.address}:`, error);
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error scanning new tokens:', error);
      throw new Error('Failed to scan new tokens');
    }
  }

  static async analyzeSocialMetrics(token: Token): Promise<boolean> {
    try {
      const twitterMetrics = await TwitterService.getTokenMetrics(token.symbol);
      return twitterMetrics.followers >= token.socialMetrics.minTwitterFollowers;
    } catch (error) {
      console.error('Error analyzing social metrics:', error);
      return false;
    }
  }

  static async performSecurityCheck(token: Token, chain: Chain): Promise<boolean> {
    try {
      const securityScore = await SecurityService.analyzeToken(token.address, chain);
      
      return (
        securityScore.isContractVerified &&
        securityScore.liquidityLocked &&
        securityScore.honeypotScore < 0.2 &&
        !securityScore.isBlacklisted
      );
    } catch (error) {
      console.error('Error performing security check:', error);
      return false;
    }
  }

  static async startDiscovery(chain: Chain): Promise<TokenAnalysis[]> {
    const newTokens = await this.scanNewTokens(chain);
    const analyses: TokenAnalysis[] = [];

    for (const token of newTokens) {
      try {
        const [socialValid, securityValid] = await Promise.all([
          this.analyzeSocialMetrics(token),
          this.performSecurityCheck(token, chain)
        ]);
        
        if (socialValid && securityValid) {
          const analysis = await TokenService.analyzeToken(token.address, chain);
          analyses.push(analysis);
        }
      } catch (error) {
        console.error(`Error analyzing token ${token.address}:`, error);
      }
    }

    return analyses;
  }
}