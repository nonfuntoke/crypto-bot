export interface BotConfig {
  id: string;
  name: string;
  chain: 'ETH' | 'BSC' | 'AVAX' | 'SOL';
  tradingPair: {
    tokenIn: string;
    tokenOut: string;
  };
  tradingStrategy: {
    entryPrice: number;
    takeProfitPercentage: number;
    stopLossPercentage: number;
    maxSlippagePercentage: number;
    tradeAmount: number;
  };
  riskManagement: {
    maxInvestmentPerTrade: number;
    dailyLossLimit: number;
    maxOpenTrades: number;
  };
  monitoring: {
    priceCheckInterval: number;
    socialMetricsThreshold: {
      minTwitterFollowers: number;
      minTelegramMembers?: number;
    };
    technicalIndicators: {
      rsi?: {
        period: number;
        overbought: number;
        oversold: number;
      };
      macd?: {
        enable: boolean;
      };
    };
  };
}

export interface BotStatus {
  id: string;
  isActive: boolean;
  currentPrice: number;
  profitLoss: number;
  lastUpdated: Date;
  openTrades: Trade[];
}

export interface Trade {
  id: string;
  tokenIn: string;
  tokenOut: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  timestamp: Date;
  status: 'PENDING' | 'EXECUTED' | 'COMPLETED' | 'FAILED';
  type: 'BUY' | 'SELL';
}

export type BotEvent = {
  type: 'PRICE_UPDATE' | 'TRADE_EXECUTED' | 'ERROR' | 'WARNING';
  timestamp: Date;
  message: string;
  data?: any;
};