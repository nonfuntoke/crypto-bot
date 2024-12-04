export type Chain = 'ETH' | 'BSC' | 'AVAX' | 'SOL';

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chain: Chain;
  marketCap: number;
  price: number;
  volume24h: number;
  socialMetrics: {
    twitterFollowers: number;
    telegramMembers?: number;
    redditSubscribers?: number;
  };
  riskMetrics: {
    liquidityScore: number;
    contractAudit: boolean;
    ownershipRenounced: boolean;
    honeypotRisk: number;
  };
}

export interface TokenAnalysis {
  token: Token;
  buySignal: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  analysis: string[];
}