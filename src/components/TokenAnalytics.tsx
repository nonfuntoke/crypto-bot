import React from 'react';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';

export const TokenAnalytics: React.FC = () => {
  const analyses = useTradingStore((state) => state.analyses);
  const addToWatchlist = useTradingStore((state) => state.addToWatchlist);

  return (
    <div className="space-y-4">
      {analyses.map((analysis, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{analysis.token.name}</h3>
            <div className="flex items-center space-x-2">
              {analysis.buySignal ? (
                <span className="flex items-center text-green-500">
                  <CheckCircle className="mr-1" size={20} />
                  Buy Signal
                </span>
              ) : (
                <span className="flex items-center text-yellow-500">
                  <AlertTriangle className="mr-1" size={20} />
                  Watch Only
                </span>
              )}
              <button
                onClick={() => addToWatchlist(analysis.token)}
                className="p-2 text-gray-600 hover:text-blue-500"
              >
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Market Cap</p>
              <p className="font-semibold">${analysis.token.marketCap.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">24h Volume</p>
              <p className="font-semibold">${analysis.token.volume24h.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Analysis Points:</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.analysis.map((point, i) => (
                <li key={i} className="text-sm text-gray-700">{point}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              analysis.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
              analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.riskLevel} Risk
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};