import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';

export const Watchlist: React.FC = () => {
  const watchlist = useTradingStore((state) => state.watchlist);
  const removeFromWatchlist = useTradingStore((state) => state.removeFromWatchlist);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
      <div className="space-y-4">
        {watchlist.map((token) => (
          <div
            key={token.address}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{token.name}</h3>
              <p className="text-sm text-gray-600">{token.symbol}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium">${token.price.toFixed(6)}</p>
              <button
                onClick={() => removeFromWatchlist(token.address)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {watchlist.length === 0 && (
          <p className="text-gray-500 text-center">No tokens in watchlist</p>
        )}
      </div>
    </div>
  );
};