import create from 'zustand';
import { BotConfig, BotStatus, Trade, BotEvent } from '../types/bot';

interface BotStore {
  bots: BotConfig[];
  botStatus: Record<string, BotStatus>;
  events: BotEvent[];
  addBot: (config: BotConfig) => void;
  removeBot: (id: string) => void;
  updateBotStatus: (id: string, status: Partial<BotStatus>) => void;
  addEvent: (event: BotEvent) => void;
  addTrade: (botId: string, trade: Trade) => void;
}

export const useBotStore = create<BotStore>((set) => ({
  bots: [],
  botStatus: {},
  events: [],
  addBot: (config) =>
    set((state) => ({
      bots: [...state.bots, config],
      botStatus: {
        ...state.botStatus,
        [config.id]: {
          id: config.id,
          isActive: false,
          currentPrice: 0,
          profitLoss: 0,
          lastUpdated: new Date(),
          openTrades: [],
        },
      },
    })),
  removeBot: (id) =>
    set((state) => ({
      bots: state.bots.filter((bot) => bot.id !== id),
      botStatus: Object.fromEntries(
        Object.entries(state.botStatus).filter(([botId]) => botId !== id)
      ),
    })),
  updateBotStatus: (id, status) =>
    set((state) => ({
      botStatus: {
        ...state.botStatus,
        [id]: { ...state.botStatus[id], ...status },
      },
    })),
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 100), // Keep last 100 events
    })),
  addTrade: (botId, trade) =>
    set((state) => ({
      botStatus: {
        ...state.botStatus,
        [botId]: {
          ...state.botStatus[botId],
          openTrades: [...state.botStatus[botId].openTrades, trade],
        },
      },
    })),
}));