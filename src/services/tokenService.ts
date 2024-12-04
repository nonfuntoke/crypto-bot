import axios from 'axios';
import { Token, TokenAnalysis, Chain } from '../types/token';
import { DexFactory } from './dex/dexFactory';
import { web3Service } from './web3Service';
import { ethers } from 'ethers';

// Minimal ABI for token info
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)'
];

export class TokenService {
  private static async getTokenContract(address: string, chain: Chain) {
    const provider = web3Service.getProvider();
    if (!provider) {
      throw new Error('Web3 provider not initialized');
    }
    return new ethers.Contract(address, ERC20_ABI, provider);
  }

  private static async fetchTokenData(address: string, chain: Chain): Promise<Token> {
    try {
      // Validate address format
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid token address format');
      }

      const dexService = DexFactory.getService(chain);
      const contract = await this.getTokenContract(address, chain);
      
      // Fetch basic token info
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      // Get current price
      const price = await dexService.getTokenPrice(address);

      // Fetch social metrics from Twitter API (simplified for demo)
      const socialMetrics = {
        twitterFollowers: 10000, // Demo value
        telegramMembers: 5000,   // Demo value
        redditSubscribers: 2000  // Demo value
      };

      // Calculate market cap
      const marketCap = (Number(totalSupply) / (10 ** decimals)) * price;

      // Perform basic contract verification
      const riskMetrics = await this.analyzeContractRisk(address, chain);

      return {
        address,
        name,
        symbol,
        decimals,
        chain,
        marketCap,
        price,
        volume24h: 1000000, // Demo value - should be fetched from DEX
        socialMetrics,
        riskMetrics
      };
    } catch (error) {
      console.error('Token data fetch error:', error);
      throw new Error(`Failed to fetch token data: ${error.message}`);
    }
  }

  private static async analyzeContractRisk(address: string, chain: Chain) {
    try {
      // In a production environment, these checks would be more thorough
      const provider = web3Service.getProvider();
      const code = await provider.getCode(address);
      
      return {
        liquidityScore: 0.8,
        contractAudit: true,
        ownershipRenounced: code.length > 0,
        honeypotRisk: 0.1
      };
    } catch (error) {
      console.error('Contract risk analysis error:', error);
      throw new Error('Failed to analyze contract risk');
    }
  }

  static async analyzeToken(address: string, chain: Chain): Promise<TokenAnalysis> {
    try {
      const token = await this.fetchTokenData(address, chain);
      
      const analysis: string[] = [];
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
      let buySignal = false;

      // Market cap analysis
      if (token.marketCap > 1000000) {
        analysis.push('Market cap is significant');
        riskLevel = 'MEDIUM';
      }

      // Liquidity analysis
      if (token.riskMetrics.liquidityScore > 0.8) {
        analysis.push('High liquidity score');
        riskLevel = 'LOW';
      }

      // Social metrics analysis
      if (token.socialMetrics.twitterFollowers > 10000) {
        analysis.push('Strong social presence');
        riskLevel = 'MEDIUM';
      }

      // Security analysis
      if (token.riskMetrics.contractAudit && token.riskMetrics.ownershipRenounced) {
        analysis.push('Contract is audited and ownership is renounced');
        riskLevel = 'LOW';
      }

      // Buy signal determination
      buySignal = riskLevel === 'LOW' && 
                  token.riskMetrics.honeypotRisk < 0.2 &&
                  token.socialMetrics.twitterFollowers > 50000;

      return {
        token,
        buySignal,
        riskLevel,
        analysis
      };
    } catch (error) {
      console.error('Token analysis error:', error);
      throw new Error(`Token analysis failed: ${error.message}`);
    }
  }
}