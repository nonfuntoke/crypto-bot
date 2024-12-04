import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BotConfig, Chain } from '../../types/bot';

interface BotFormProps {
  config: Partial<BotConfig>;
  setConfig: (config: Partial<BotConfig>) => void;
  error: string | null;
}

export const BotForm: React.FC<BotFormProps> = ({ config, setConfig, error }) => {
  return (
    <form className="space-y-6">
      {error && (
        <div className="mb-4 flex items-center space-x-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

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
    </form>
  );
};