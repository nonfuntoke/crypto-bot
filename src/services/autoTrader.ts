import { BotConfig, Trade } from '../types/bot';
import { TokenAnalysis } from '../types/token';
import { DexFactory } from './dex/dexFactory';
import { useBotStore } from '../store/botStore';

export class AutoTrader {
  private static async executeTrade(
    botConfig: BotConfig,
    analysis: TokenAnalysis,
    type: 'BUY' | 'SELL'
  ): Promise<Trade> {
    const dexService = DexFactory.getService(botConfig.chain);
    
    // In a real implementation, this would:
    // 1. Calculate optimal trade size based on risk management
    // 2. Determine best route for trade execution
    // 3. Set appropriate slippage and deadline
    // 4. Execute the trade through the DEX

    const trade: Trade = {
      id: Date.now().toString(),
      tokenIn: type === 'BUY' ? 'USDT' : analysis.token.symbol,
      tokenOut: type === 'BUY' ? analysis.token.symbol : 'USDT',
      amount: botConfig.tradingStrategy.tradeAmount,
      entryPrice: analysis.token.price,
      currentPrice: analysis.token.price,
      timestamp: new Date(),
      status: 'EXECUTED',
      type
    };

    useBotStore.getState().addTrade(botConfig.id, trade);
    return trade;
  }

  static async evaluateAndTrade(
    botConfig: BotConfig,
    analysis: TokenAnalysis
  ): Promise<void> {
    if (!analysis.buySignal) {
      return;
    }

    const botStatus = useBotStore.getState().botStatus[botConfig.id];
    
    // Check if we can open new trades
    if (botStatus.openTrades.length >= botConfig.riskManagement.maxOpenTrades) {
      return;
    }

    // Check if we're within daily loss limit
    const dailyPL = botStatus.openTrades.reduce(
      (total, trade) => total + (trade.currentPrice - trade.entryPrice) * trade.amount,
      0
    );
    
    if (dailyPL < -botConfig.riskManagement.dailyLossLimit) {
      return;
    }

    // Execute buy trade if all conditions are met
    await this.executeTrade(botConfig, analysis, 'BUY');
  }

  static async monitorAndUpdateTrades(botConfig: BotConfig): Promise<void> {
    const botStatus = useBotStore.getState().botStatus[botConfig.id];
    const dexService = DexFactory.getService(botConfig.chain);

    for (const trade of botStatus.openTrades) {
      // Update current price
      const currentPrice = await dexService.getTokenPrice(trade.tokenOut);
      
      // Calculate profit/loss percentage
      const plPercentage = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100;

      // Check take profit and stop loss conditions
      if (plPercentage >= botConfig.tradingStrategy.takeProfitPercentage ||
          plPercentage <= -botConfig.tradingStrategy.stopLossPercentage) {
        await this.executeTrade(
          botConfig,
          { token: { ...trade, price: currentPrice } } as TokenAnalysis,
          'SELL'
        );
      }
    }
  }
}