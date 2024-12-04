-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table to store authentication data
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint users_pkey primary key (id)
);

-- Enable RLS
alter table public.users enable row level security;

-- User profiles for additional user data
create table public.profiles (
  id uuid references public.users on delete cascade not null primary key,
  username text unique,
  wallet_address text,
  preferred_chain text check (preferred_chain in ('ETH', 'BSC', 'AVAX', 'SOL')),
  risk_tolerance text check (risk_tolerance in ('LOW', 'MEDIUM', 'HIGH')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Trading bots configuration
create table public.bots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  chain text check (chain in ('ETH', 'BSC', 'AVAX', 'SOL')) not null,
  trading_strategy jsonb not null,
  risk_management jsonb not null,
  monitoring_config jsonb not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bots enable row level security;

-- Watchlist tokens
create table public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  token_address text not null,
  chain text check (chain in ('ETH', 'BSC', 'AVAX', 'SOL')) not null,
  symbol text not null,
  name text not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, token_address, chain)
);

-- Enable RLS
alter table public.watchlist enable row level security;

-- Trading history
create table public.trades (
  id uuid default uuid_generate_v4() primary key,
  bot_id uuid references public.bots on delete cascade not null,
  token_in text not null,
  token_out text not null,
  amount_in numeric not null,
  amount_out numeric not null,
  price_in numeric not null,
  price_out numeric not null,
  transaction_hash text,
  status text check (status in ('PENDING', 'EXECUTED', 'COMPLETED', 'FAILED')) not null,
  type text check (type in ('BUY', 'SELL')) not null,
  executed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.trades enable row level security;

-- Token analysis results
create table public.token_analyses (
  id uuid default uuid_generate_v4() primary key,
  token_address text not null,
  chain text check (chain in ('ETH', 'BSC', 'AVAX', 'SOL')) not null,
  market_cap numeric,
  price numeric not null,
  volume_24h numeric,
  social_metrics jsonb,
  risk_metrics jsonb,
  risk_level text check (risk_level in ('LOW', 'MEDIUM', 'HIGH')) not null,
  buy_signal boolean default false,
  analysis_points text[],
  analyzed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.token_analyses enable row level security;

-- Create RLS policies

-- Users policy
create policy "Users can view own data"
  on public.users
  for select
  using (auth.uid() = id);

-- Profiles policy
create policy "Users can view and update own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Bots policy
create policy "Users can manage own bots"
  on public.bots
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Watchlist policy
create policy "Users can manage own watchlist"
  on public.watchlist
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trades policy
create policy "Users can view own bot trades"
  on public.trades
  for select
  using (
    exists (
      select 1 from public.bots
      where bots.id = trades.bot_id
      and bots.user_id = auth.uid()
    )
  );

-- Token analyses policy
create policy "Everyone can view token analyses"
  on public.token_analyses
  for select
  using (true);

-- Create functions for common operations

-- Function to add token to watchlist
create or replace function add_to_watchlist(
  p_token_address text,
  p_chain text,
  p_symbol text,
  p_name text
) returns uuid as $$
declare
  v_watchlist_id uuid;
begin
  insert into public.watchlist (
    user_id,
    token_address,
    chain,
    symbol,
    name
  ) values (
    auth.uid(),
    p_token_address,
    p_chain,
    p_symbol,
    p_name
  )
  returning id into v_watchlist_id;
  
  return v_watchlist_id;
end;
$$ language plpgsql security definer;