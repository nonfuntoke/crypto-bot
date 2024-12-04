import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import { TokenInfo } from '../types/token';

export class JupiterService {
  private static connection: Connection;
  private static jupiter: Jupiter;

  static async initialize() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.jupiter = await Jupiter.load({
      connection: this.connection,
      cluster: 'mainnet-beta'
    });
  }

  static async getTokenPrice(tokenMint: string): Promise<number> {
    try {
      const routes = await this.jupiter.computeRoutes({
        inputMint: new PublicKey(tokenMint),
        outputMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
        amount: 1_000_000, // 1 token
        slippageBps: 100
      });

      if (routes.routesInfos.length === 0) {
        throw new Error('No routes found');
      }

      return Number(routes.routesInfos[0].outAmount) / 1_000_000; // Convert to USDC price
    } catch (error) {
      console.error('Error getting token price:', error);
      throw error;
    }
  }

  static async executeTrade(params: {
    tokenIn: string;
    tokenOut: string;
    amount: number;
    slippage: number;
  }) {
    try {
      const routes = await this.jupiter.computeRoutes({
        inputMint: new PublicKey(params.tokenIn),
        outputMint: new PublicKey(params.tokenOut),
        amount: params.amount,
        slippageBps: params.slippage * 100
      });

      if (routes.routesInfos.length === 0) {
        throw new Error('No routes found for trade');
      }

      const { execute } = await this.jupiter.exchange({
        routeInfo: routes.routesInfos[0]
      });

      const result = await execute();
      return result;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  }
}