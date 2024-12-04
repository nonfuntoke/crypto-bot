import { supabase } from './supabase';
import { BotConfig, Trade } from '../types/bot';
import { Token, TokenAnalysis } from '../types/token';

export const supabaseQueries = {
  // Bot operations
  createBot: async (botConfig: BotConfig) => {
    const { data, error } = await supabase
      .from('bots')
      .insert({
        name: botConfig.name,
        chain: botConfig.chain,
        trading_strategy: botConfig.tradingStrategy,
        risk_management: botConfig.riskManagement,
        monitoring_config: botConfig.monitoring
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getBots: async () => {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  updateBotStatus: async (botId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('bots')
      .update({ is_active: isActive })
      .eq('id', botId);

    if (error) throw error;
  },

  // Trade operations
  recordTrade: async (trade: Trade, botId: string) => {
    const { data, error } = await supabase
      .from('trades')
      .insert({
        bot_id: botId,
        token_in: trade.tokenIn,
        token_out: trade.tokenOut,
        amount_in: trade.amount,
        price_in: trade.entryPrice,
        price_out: trade.currentPrice,
        status: trade.status,
        type: trade.type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Watchlist operations
  addToWatchlist: async (token: Token) => {
    const { data, error } = await supabase
      .rpc('add_to_watchlist', {
        p_token_address: token.address,
        p_chain: token.chain,
        p_symbol: token.symbol,
        p_name: token.name
      });

    if (error) throw error;
    return data;
  },

  getWatchlist: async () => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  removeFromWatchlist: async (tokenAddress: string) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('token_address', tokenAddress);

    if (error) throw error;
  },

  // Token analysis operations
  saveTokenAnalysis: async (analysis: TokenAnalysis) => {
    const { data, error } = await supabase
      .from('token_analyses')
      .insert({
        token_address: analysis.token.address,
        chain: analysis.token.chain,
        market_cap: analysis.token.marketCap,
        price: analysis.token.price,
        volume_24h: analysis.token.volume24h,
        social_metrics: analysis.token.socialMetrics,
        risk_metrics: analysis.token.riskMetrics,
        risk_level: analysis.riskLevel,
        buy_signal: analysis.buySignal,
        analysis_points: analysis.analysis
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getTokenAnalyses: async () => {
    const { data, error } = await supabase
      .from('token_analyses')
      .select('*')
      .order('analyzed_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }
};