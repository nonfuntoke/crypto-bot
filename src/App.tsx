import React from 'react';
import { Bot } from 'lucide-react';
import { TokenSearch } from './components/TokenSearch';
import { TokenAnalytics } from './components/TokenAnalytics';
import { Watchlist } from './components/Watchlist';
import { WalletConnect } from './components/WalletConnect';
import { BotCreator } from './components/BotCreator';
import { BotDashboard } from './components/BotDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="text-blue-500" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Crypto Trading Bot</h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section>
            <BotCreator />
            <BotDashboard />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Token Analysis</h2>
                <TokenSearch />
              </div>
              <TokenAnalytics />
            </div>
            
            <div className="lg:col-span-1">
              <Watchlist />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;