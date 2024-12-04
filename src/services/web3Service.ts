import Web3 from 'web3';
import { ethers } from 'ethers';

class Web3Service {
  private static instance: Web3Service;
  private web3: Web3 | null = null;
  private provider: any = null;

  private constructor() {}

  static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        // Create Web3 instance
        this.provider = window.ethereum;
        this.web3 = new Web3(this.provider);
        
        // Request account access
        await this.provider.request({ method: 'eth_requestAccounts' });
        
        // Listen for account changes
        this.provider.on('accountsChanged', (accounts: string[]) => {
          console.log('Account changed:', accounts[0]);
        });

        // Listen for chain changes
        this.provider.on('chainChanged', (chainId: string) => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error initializing Web3:', error);
        throw error;
      }
    } else {
      console.warn('Please install MetaMask or another Web3 wallet');
    }
  }

  async getAccount(): Promise<string | null> {
    if (!this.web3) return null;
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0] || null;
  }

  async getChainId(): Promise<number | null> {
    if (!this.web3) return null;
    return await this.web3.eth.getChainId();
  }

  getWeb3(): Web3 | null {
    return this.web3;
  }

  getProvider(): any {
    return this.provider;
  }
}

export const web3Service = Web3Service.getInstance();