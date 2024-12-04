import { JupiterService } from './jupiterService';
import { SolanaTokenAnalyzer } from './tokenAnalyzer';
import { BotConfig } from '../../types/bot';
import { supabaseQueries } from '../../lib/supabase-queries';

export class SolanaTradingBot {
  private config: BotConfig;
  private isRunning: boolean = false;

  constructor(config: BotConfig) {
    this.config = config;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.runTradingCycle();
  }

  stop() {
    this.isRunning = false;
  }

  private async runTradingCycle() {
    while (this.isRunning) {
      try {
        // 1. Get latest tokens from DEXScreener
        const newPairs = await this.getLatestTokens();

        for (const pair of newPairs) {
          try {
            // 2. Analyze the token
            const analysis = await this.analyzeToken(pair.tokenAddress);
            
            // 3. If analysis is positive, execute trade
            if (analysis.shouldTrade) {
              await this.executeTrade(pair.tokenAddress);
            }

            // 4. Save analysis to database
            await supabaseQueries.saveTokenAnalysis(analysis);
          } catch (error) {
            console.error(`Error processing token ${pair.tokenAddress}:`, error);
          }
        }

        // Wait for next cycle
        await new Promise(resolve => setTimeout(resolve, 60000));
      } catch (error) {
        console.error('Trading cycle error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async analyzeToken(tokenAddress: string) {
    // 1. Get holder information
    const holderAnalysis = await SolanaTokenAnalyzer.analyzeHolderGrowth(tokenAddress);
    
    // 2. Check rug safety
    const rugCheck = await SolanaTokenAnalyzer.isRugSafe(tokenAddress);
    
    // 3. Get market cap
    const marketCap = await SolanaTokenAnalyzer.getMarketCap(tokenAddress);
    
    // 4. Make trading decision
    const shouldTrade = 
      holderAnalysis.isIncreasing &&
      rugCheck.isSafe &&
      marketCap > 100000 && // Minimum $100k market cap
      marketCap < 1000000;  // Maximum $1M market cap

    return {
      tokenAddress,
      holderAnalysis,
      rugCheck,
      marketCap,
      shouldTrade
    };
  }

  private async executeTrade(tokenAddress: string) {
    try {
      const tradeAmount = this.config.tradingStrategy.tradeAmount;
      
      await JupiterService.executeTrade({
        tokenIn: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        tokenOut: tokenAddress,
        amount: tradeAmount,
        slippage: this.config.tradingStrategy.maxSlippagePercentage
      });

      // Record trade in database
      await supabaseQueries.recordTrade({
        tokenIn: 'USDC',
        tokenOut: tokenAddress,
        amount: tradeAmount,
        type: 'BUY',
        status: 'EXECUTED',
        timestamp: new Date()
      }, this.config.id);
    } catch (error) {
      console.error('Trade execution error:', error);
      throw error;
    }
  }
}