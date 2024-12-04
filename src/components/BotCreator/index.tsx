import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useBotStore } from '../../store/botStore';
import { BotConfig } from '../../types/bot';
import { useWeb3Store } from '../../store/web3Store';
import { BotForm } from './BotForm';
import JSZip from 'jszip';

export const BotCreator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addBot = useBotStore((state) => state.addBot);
  const { isConnected } = useWeb3Store();
  const [downloadMode, setDownloadMode] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!config.name) {
        throw new Error('Bot name is required');
      }

      if (!downloadMode && !isConnected) {
        throw new Error('Please connect your wallet to create a live bot');
      }

      const botConfig: BotConfig = {
        ...config,
        id: Date.now().toString(),
      } as BotConfig;

      if (downloadMode) {
        await handleDownload(botConfig);
      } else {
        addBot(botConfig);
      }
      
      setIsOpen(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownload = async (botConfig: BotConfig) => {
    const zip = new JSZip();

    // Add configuration
    zip.file('config.json', JSON.stringify(botConfig, null, 2));

    // Add package.json
    zip.file('package.json', JSON.stringify({
      name: 'crypto-trading-bot',
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'node dist/index.js',
        build: 'tsc',
        dev: 'ts-node src/index.ts'
      },
      dependencies: {
        '@pancakeswap/sdk': '^5.0.0',
        '@solana/web3.js': '^1.91.1',
        '@jup-ag/core': '^4.0.0-beta.22',
        '@traderjoe-xyz/sdk': '^4.0.0',
        '@uniswap/sdk-core': '^4.2.0',
        '@uniswap/v3-sdk': '^3.11.0',
        'web3': '^4.5.0',
        'ethers': '^6.11.1',
        'axios': '^1.6.7'
      }
    }, null, 2));

    // Add README
    zip.file('README.md', `# Crypto Trading Bot

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure your API keys in \`.env\`:
   \`\`\`
   ETHEREUM_RPC_URL=your_ethereum_rpc_url
   BSC_RPC_URL=your_bsc_rpc_url
   AVALANCHE_RPC_URL=your_avalanche_rpc_url
   SOLANA_RPC_URL=your_solana_rpc_url
   PRIVATE_KEY=your_wallet_private_key
   \`\`\`

3. Start the bot:
   \`\`\`bash
   npm start
   \`\`\`
`);

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto-trading-bot.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="mb-6">
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setIsOpen(true);
            setDownloadMode(false);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} className="mr-2" />
          Create New Bot
        </button>
        <button
          onClick={() => {
            setIsOpen(true);
            setDownloadMode(true);
          }}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Download size={20} className="mr-2" />
          Download Bot
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {downloadMode ? 'Download Trading Bot' : 'Create Trading Bot'}
            </h2>
            
            <BotForm
              config={config}
              setConfig={setConfig}
              error={error}
            />

            <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {downloadMode ? 'Download Bot' : 'Create Bot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};