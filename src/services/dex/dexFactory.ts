import { ChainId, DexService } from '../../types/dex';
import { PancakeswapService } from './pancakeswap';
import { JupiterService } from './jupiter';
import { TraderJoeService } from './traderjoe';
import { UniswapService } from './uniswap';

export class DexFactory {
  private static services: Map<ChainId, DexService> = new Map([
    ['BSC', new PancakeswapService()],
    ['SOL', new JupiterService()],
    ['AVAX', new TraderJoeService()],
    ['ETH', new UniswapService()]
  ]);

  static getService(chain: ChainId): DexService {
    const service = this.services.get(chain);
    if (!service) {
      throw new Error(`No DEX service available for chain: ${chain}`);
    }
    return service;
  }
}