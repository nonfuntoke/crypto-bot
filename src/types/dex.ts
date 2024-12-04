export type ChainId = 'ETH' | 'BSC' | 'AVAX' | 'SOL';

export interface DexConfig {
  name: string;
  chain: ChainId;
  router: string;
  factory: string;
}

export interface TradeParams {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  slippage: number;
  deadline: number;
}

export interface PriceQuote {
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  route: string[];
}

export interface DexService {
  getQuote(params: TradeParams): Promise<PriceQuote>;
  executeTrade(params: TradeParams): Promise<string>;
  getTokenPrice(tokenAddress: string): Promise<number>;
}