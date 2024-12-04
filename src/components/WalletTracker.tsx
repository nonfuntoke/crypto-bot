import React, { useState } from 'react';
import { Plus, Activity, Trash2 } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { WalletTrackerService } from '../services/walletTracker';
import { WalletTracker as WalletTrackerType } from '../types/wallet';

export const WalletTracker: React.FC = () => {
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({
    address: '',
    chain: 'ETH' as WalletTrackerType['chain'],
    name: '',
    description: '',
  });

  const { trackedWallets, transactions, addWallet, removeWallet, toggleWalletTracking } = useWalletStore();

  const handleAddWallet = () => {
    const wallet: WalletTrackerType = {
      id: Date.now().toString(),
      ...newWallet,
      isActive: true,
      performance: {
        totalTrades: 0,
        successRate: 0,
        profitLoss: 0,
      },
    };

    addWallet(wallet);
    WalletTrackerService.startTracking(wallet);
    setIsAddingWallet(false);
    setNewWallet({ address: '', chain: 'ETH', name: '', description: '' });
  };

  const handleRemoveWallet = (id: string) => {
    WalletTrackerService.stopTracking(id);
    removeWallet(id);
  };

  const handleToggleTracking = (wallet: WalletTrackerType) => {
    if (wallet.isActive) {
      WalletTrackerService.stopTracking(wallet.id);
    } else {
      WalletTrackerService.startTracking(wallet);
    }
    toggleWalletTracking(wallet.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Wallet Tracker</h2>
        <button
          onClick={() => setIsAddingWallet(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} className="mr-2" />
          Track New Wallet
        </button>
      </div>

      {isAddingWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Wallet to Track</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chain</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newWallet.chain}
                  onChange={(e) => setNewWallet({ ...newWallet, chain: e.target.value as WalletTrackerType['chain'] })}
                >
                  <option value="ETH">Ethereum</option>
                  <option value="BSC">BSC</option>
                  <option value="AVAX">Avalanche</option>
                  <option value="SOL">Solana</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newWallet.description}
                  onChange={(e) => setNewWallet({ ...newWallet, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddingWallet(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWallet}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trackedWallets.map((wallet) => (
          <div key={wallet.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{wallet.name}</h3>
                <p className="text-sm text-gray-600 truncate">{wallet.address}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleTracking(wallet)}
                  className={`p-2 rounded-full ${
                    wallet.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Activity size={20} />
                </button>
                <button
                  onClick={() => handleRemoveWallet(wallet.id)}
                  className="p-2 rounded-full text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Trades</span>
                <span>{wallet.performance.totalTrades}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Success Rate</span>
                <span>{wallet.performance.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/L</span>
                <span className={wallet.performance.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {wallet.performance.profitLoss >= 0 ? '+' : ''}
                  {wallet.performance.profitLoss.toFixed(2)}%
                </span>
              </div>
            </div>

            {transactions[wallet.id]?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Transactions</h4>
                {transactions[wallet.id].slice(0, 3).map((tx) => (
                  <div key={tx.hash} className="text-xs space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      <span>{tx.type}</span>
                    </div>
                    {tx.tokenIn && tx.tokenOut && (
                      <div className="text-gray-800">
                        {tx.tokenIn.amount} {tx.tokenIn.symbol} → {tx.tokenOut.amount} {tx.tokenOut.symbol}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};