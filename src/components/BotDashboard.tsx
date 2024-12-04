import React from 'react';
import { Play, Pause, AlertTriangle } from 'lucide-react';
import { useBotStore } from '../store/botStore';
import { BotStatus } from '../types/bot';
import { BotRunner } from '../services/botRunner';

export const BotDashboard: React.FC = () => {
  const { bots, botStatus, updateBotStatus } = useBotStore();

  const toggleBot = async (botId: string, currentStatus: BotStatus) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    if (currentStatus.isActive) {
      BotRunner.stopBot(botId);
    } else {
      await BotRunner.startBot(bot);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Active Bots</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => {
          const status = botStatus[bot.id];
          return (
            <div key={bot.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{bot.name}</h3>
                <button
                  onClick={() => toggleBot(bot.id, status)}
                  className={`p-2 rounded-full ${
                    status.isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status.isActive ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chain</span>
                  <span className="font-medium">{bot.chain}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">P/L</span>
                  <span
                    className={`font-medium ${
                      status.profitLoss >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {status.profitLoss >= 0 ? '+' : ''}
                    {status.profitLoss.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Open Trades</span>
                  <span className="font-medium">
                    {status.openTrades.length}
                  </span>
                </div>
              </div>

              {status.openTrades.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Active Trades</h4>
                  {status.openTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="text-xs flex justify-between items-center"
                    >
                      <span>{trade.tokenIn}/{trade.tokenOut}</span>
                      <span className="text-gray-600">
                        ${trade.currentPrice.toFixed(6)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {bots.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bots created</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new trading bot.
          </p>
        </div>
      )}
    </div>
  );
};