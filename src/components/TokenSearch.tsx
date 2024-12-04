import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { TokenService } from '../services/tokenService';
import { useTradingStore } from '../store/tradingStore';
import { Chain } from '../types/token';
import { useWeb3Store } from '../store/web3Store';

export const TokenSearch: React.FC = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState<Chain>('ETH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addAnalysis = useTradingStore((state) => state.addAnalysis);
  const { isConnected } = useWeb3Store();

  const handleSearch = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const analysis = await TokenService.analyzeToken(address, chain);
      addAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing token:', error);
      setError(error.message || 'Failed to analyze token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex gap-4">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as Chain)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ETH">Ethereum</option>
          <option value="BSC">BSC</option>
          <option value="AVAX">Avalanche</option>
          <option value="SOL">Solana</option>
        </select>
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter token address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !address}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500">
          Analyzing token...
        </div>
      )}
    </div>
  );
}