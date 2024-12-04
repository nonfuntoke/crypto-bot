import create from 'zustand';
import { Token, TokenAnalysis } from '../types/token';

interface TradingStore {
  watchlist: Token[];
  analyses: TokenAnalysis[];
  addToWatchlist: (token: Token) => void;
  removeFromWatchlist: (address: string) => void;
  addAnalysis: (analysis: TokenAnalysis) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  watchlist: [],
  analyses: [],
  addToWatchlist: (token) =>
    set((state) => ({
      watchlist: [...state.watchlist, token],
    })),
  removeFromWatchlist: (address) =>
    set((state) => ({
      watchlist: state.watchlist.filter((token) => token.address !== address),
    })),
  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [...state.analyses, analysis],
    })),
}));