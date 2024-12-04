import React from 'react';
import { Wallet } from 'lucide-react';
import { useWeb3Store } from '../store/web3Store';

export const WalletConnect: React.FC = () => {
  const { account, isConnected, isInitializing, error, connect, disconnect } = useWeb3Store();

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <div className="flex items-center">
      {error && (
        <span className="text-red-500 text-sm mr-4">{error}</span>
      )}
      <button
        onClick={handleConnect}
        disabled={isInitializing}
        className={`flex items-center px-4 py-2 rounded-lg ${
          isConnected
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:opacity-50`}
      >
        <Wallet size={20} className="mr-2" />
        {isInitializing
          ? 'Connecting...'
          : isConnected
          ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
          : 'Connect Wallet'}
      </button>
    </div>
  );
};