# Crypto Trading Bot Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [API Keys Configuration](#api-keys-configuration)
3. [RPC Endpoints Setup](#rpc-endpoints-setup)
4. [Wallet Configuration](#wallet-configuration)
5. [Error Handling](#error-handling)
6. [Security Best Practices](#security-best-practices)

## Prerequisites

Before setting up the trading bot, ensure you have:
- Node.js v16 or higher installed
- npm or yarn package manager
- Basic understanding of cryptocurrency trading
- Wallet with sufficient funds for trading

## API Keys Configuration

### 1. Supabase Setup
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
1. Create an account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy the project URL and anon key from the project settings
4. Add these to your `.env` file

### 2. Exchange API Keys

For each supported DEX, you'll need to configure the following:

#### Ethereum (Uniswap)
```env
ETH_RPC_URL=your-ethereum-node-url
ETH_WALLET_PRIVATE_KEY=your-private-key
```

#### BSC (PancakeSwap)
```env
BSC_RPC_URL=your-bsc-node-url
BSC_WALLET_PRIVATE_KEY=your-private-key
```

#### Avalanche (Trader Joe)
```env
AVAX_RPC_URL=your-avalanche-node-url
AVAX_WALLET_PRIVATE_KEY=your-private-key
```

#### Solana (Jupiter)
```env
SOL_RPC_URL=your-solana-node-url
SOL_WALLET_PRIVATE_KEY=your-private-key
```

## RPC Endpoints Setup

### Recommended RPC Providers:
- Ethereum: Infura, Alchemy
- BSC: GetBlock, Moralis
- Avalanche: Public RPC, Moralis
- Solana: Public RPC, QuickNode

### Setup Steps:
1. Create accounts with preferred RPC providers
2. Generate API keys/endpoints
3. Add RPC URLs to your `.env` file
4. Test connection using the built-in health check

## Wallet Configuration

### Setting Up Trading Wallets:
1. Create separate wallets for each chain
2. Export private keys (keep them secure!)
3. Add private keys to `.env` file
4. Set appropriate gas/transaction limits

### Security Considerations:
- Use dedicated trading wallets
- Never share private keys
- Set reasonable transaction limits
- Enable hardware wallet support (optional)

## Error Handling

The bot includes built-in error handling for common scenarios:

### Network Issues
```typescript
try {
  await dexService.executeTrade(params);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Retry logic implemented
    await retryTransaction(params);
  }
}
```

### Insufficient Funds
```typescript
if (balance < requiredAmount) {
  throw new Error('INSUFFICIENT_FUNDS');
}
```

### Slippage Errors
```typescript
if (priceImpact > maxSlippage) {
  throw new Error('SLIPPAGE_TOO_HIGH');
}
```

## Security Best Practices

1. **API Key Security**
   - Store keys in `.env` file
   - Never commit sensitive data
   - Use environment variables

2. **Transaction Security**
   - Set gas limits
   - Use price impact protection
   - Implement slippage checks

3. **Wallet Security**
   - Use hardware wallets when possible
   - Set transaction limits
   - Regular security audits

4. **Network Security**
   - Use secure RPC endpoints
   - Implement rate limiting
   - Monitor for suspicious activity