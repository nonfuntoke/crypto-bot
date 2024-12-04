import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useBotStore } from '../store/botStore';
import { BotConfig } from '../types/bot';
import { Chain } from '../types/token';

export const BotCreator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addBot = useBotStore((state) => state.addBot);

  const [config, setConfig] = useState<Partial<BotConfig>>({
    chain: 'ETH',
    tradingStrategy: {
      entryPrice: 0,
      takeProfitPercentage: 10,
      stopLossPercentage: 5,
      maxSlippagePercentage: 1,
      tradeAmount: 0.1
    },
    riskManagement: {
      maxInvestmentPerTrade: 1000,
      dailyLossLimit: 100,
      maxOpenTrades: 3
    },
    monitoring: {
      priceCheckInterval: 60,
      socialMetricsThreshold: {
        minTwitterFollowers: 10000
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!config.name) {
        throw new Error('Bot name is required');
      }

      const botConfig: BotConfig = {
        ...config,
        id: Date.now().toString(),
      } as BotConfig;

      addBot(botConfig);
      setIsOpen(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Plus size={20} className="mr-2" />
        Create New Bot
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Trading Bot</h2>
            
            {error && (
              <div className="mb-4 flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Configuration</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bot Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.name || ''}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chain</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.chain}
                      onChange={(e) => setConfig({ ...config, chain: e.target.value as Chain })}
                    >
                      <option value="ETH">Ethereum</option>
                      <option value="BSC">BSC</option>
                      <option value="AVAX">Avalanche</option>
                      <option value="SOL">Solana</option>
                    </select>
                  </div>
                </div>

                {/* Trading Strategy */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trading Strategy</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Take Profit %</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.tradingStrategy?.takeProfitPercentage || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        tradingStrategy: {
                          ...config.tradingStrategy!,
                          takeProfitPercentage: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stop Loss %</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.tradingStrategy?.stopLossPercentage || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        tradingStrategy: {
                          ...config.tradingStrategy!,
                          stopLossPercentage: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Slippage %</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.tradingStrategy?.maxSlippagePercentage || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        tradingStrategy: {
                          ...config.tradingStrategy!,
                          maxSlippagePercentage: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trade Amount</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.tradingStrategy?.tradeAmount || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        tradingStrategy: {
                          ...config.tradingStrategy!,
                          tradeAmount: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>

                {/* Risk Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Risk Management</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Investment per Trade</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.riskManagement?.maxInvestmentPerTrade || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        riskManagement: {
                          ...config.riskManagement!,
                          maxInvestmentPerTrade: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Daily Loss Limit</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.riskManagement?.dailyLossLimit || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        riskManagement: {
                          ...config.riskManagement!,
                          dailyLossLimit: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Open Trades</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.riskManagement?.maxOpenTrades || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        riskManagement: {
                          ...config.riskManagement!,
                          maxOpenTrades: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>

                {/* Monitoring Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Monitoring Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Check Interval (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.monitoring?.priceCheckInterval || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        monitoring: {
                          ...config.monitoring!,
                          priceCheckInterval: Number(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Twitter Followers</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={config.monitoring?.socialMetricsThreshold?.minTwitterFollowers || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        monitoring: {
                          ...config.monitoring!,
                          socialMetricsThreshold: {
                            ...config.monitoring!.socialMetricsThreshold,
                            minTwitterFollowers: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};