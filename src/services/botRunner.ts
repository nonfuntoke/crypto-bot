import { BotConfig } from '../types/bot';
import { TokenDiscoveryService } from './tokenDiscovery';
import { AutoTrader } from './autoTrader';
import { useBotStore } from '../store/botStore';

export class BotRunner {
  private static runners: Map<string, NodeJS.Timeout> = new Map();

  static async startBot(botConfig: BotConfig): Promise<void> {
    if (this.runners.has(botConfig.id)) {
      return;
    }

    const runCycle = async () => {
      try {
        // Discover and analyze new tokens
        const analyses = await TokenDiscoveryService.startDiscovery(botConfig.chain);
        
        // Evaluate each token for potential trades
        for (const analysis of analyses) {
          await AutoTrader.evaluateAndTrade(botConfig, analysis);
        }

        // Monitor and update existing trades
        await AutoTrader.monitorAndUpdateTrades(botConfig);

      } catch (error) {
        useBotStore.getState().addEvent({
          type: 'ERROR',
          timestamp: new Date(),
          message: `Bot ${botConfig.id} error: ${error.message}`,
        });
      }
    };

    // Start the bot cycle
    const interval = setInterval(runCycle, botConfig.monitoring.priceCheckInterval * 1000);
    this.runners.set(botConfig.id, interval);

    useBotStore.getState().updateBotStatus(botConfig.id, { isActive: true });
  }

  static stopBot(botId: string): void {
    const interval = this.runners.get(botId);
    if (interval) {
      clearInterval(interval);
      this.runners.delete(botId);
      useBotStore.getState().updateBotStatus(botId, { isActive: false });
    }
  }
}