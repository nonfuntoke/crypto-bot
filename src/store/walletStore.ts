import create from 'zustand';
import { WalletTracker, Transaction } from '../types/wallet';

interface WalletStore {
  trackedWallets: WalletTracker[];
  transactions: Record<string, Transaction[]>;
  addWallet: (wallet: WalletTracker) => void;
  removeWallet: (id: string) => void;
  toggleWalletTracking: (id: string) => void;
  updateWalletPerformance: (id: string, performance: Partial<WalletTracker['performance']>) => void;
  addTransaction: (walletId: string, transaction: Transaction) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  trackedWallets: [],
  transactions: {},
  addWallet: (wallet) =>
    set((state) => ({
      trackedWallets: [...state.trackedWallets, wallet],
      transactions: { ...state.transactions, [wallet.id]: [] },
    })),
  removeWallet: (id) =>
    set((state) => ({
      trackedWallets: state.trackedWallets.filter((w) => w.id !== id),
      transactions: Object.fromEntries(
        Object.entries(state.transactions).filter(([key]) => key !== id)
      ),
    })),
  toggleWalletTracking: (id) =>
    set((state) => ({
      trackedWallets: state.trackedWallets.map((w) =>
        w.id === id ? { ...w, isActive: !w.isActive } : w
      ),
    })),
  updateWalletPerformance: (id, performance) =>
    set((state) => ({
      trackedWallets: state.trackedWallets.map((w) =>
        w.id === id ? { ...w, performance: { ...w.performance, ...performance } } : w
      ),
    })),
  addTransaction: (walletId, transaction) =>
    set((state) => ({
      transactions: {
        ...state.transactions,
        [walletId]: [transaction, ...(state.transactions[walletId] || [])],
      },
    })),
}));