import create from 'zustand';
import { web3Service } from '../services/web3Service';

interface Web3Store {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWeb3Store = create<Web3Store>((set) => ({
  account: null,
  chainId: null,
  isConnected: false,
  isInitializing: false,
  error: null,

  connect: async () => {
    try {
      set({ isInitializing: true, error: null });
      await web3Service.initialize();
      
      const account = await web3Service.getAccount();
      const chainId = await web3Service.getChainId();
      
      set({
        account,
        chainId,
        isConnected: !!account,
        isInitializing: false
      });
    } catch (error) {
      set({
        error: error.message,
        isInitializing: false,
        isConnected: false
      });
    }
  },

  disconnect: () => {
    set({
      account: null,
      chainId: null,
      isConnected: false,
      error: null
    });
  }
}));