export interface WalletTracker {
  id: string;
  address: string;
  chain: 'ETH' | 'BSC' | 'AVAX' | 'SOL';
  name: string;
  description?: string;
  performance: {
    totalTrades: number;
    successRate: number;
    profitLoss: number;
  };
  isActive: boolean;
  lastTransaction?: {
    hash: string;
    timestamp: Date;
    type: string;
  };
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  chain: string;
  type: 'SWAP' | 'TRANSFER' | 'LIQUIDITY' | 'OTHER';
  tokenIn?: {
    address: string;
    symbol: string;
    amount: string;
  };
  tokenOut?: {
    address: string;
    symbol: string;
    amount: string;
  };
}