import React from 'react';
import JSZip from 'jszip';
import { Download } from 'lucide-react';

export const DownloadButton: React.FC = () => {
  const handleDownload = async () => {
    const zip = new JSZip();

    // Add configuration files
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

    // Add source files
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

    // Generate and download the zip file
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
    <button
      onClick={handleDownload}
      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
    >
      <Download size={20} className="mr-2" />
      Download Bot
    </button>
  );
};