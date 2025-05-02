
// API keys and constant mapping values

export const FINNHUB_API_KEY = 'c7q3qv2ad3i9qv7qv7q0';
export const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj';

// Map of common names to Brazilian stock symbols
export const companyNameToSymbol = {
  'banco do brasil': 'BBAS3.SA',
  'bradesco': 'BBDC4.SA',
  'itau': 'ITUB4.SA',
  'itaú': 'ITUB4.SA',
  'vale': 'VALE3.SA',
  'petrobras': 'PETR4.SA',
  'ambev': 'ABEV3.SA',
  'b3': 'B3SA3.SA',
  'magazine luiza': 'MGLU3.SA',
  'magalu': 'MGLU3.SA',
  'itausa': 'ITSA4.SA',
  'santander': 'SANB11.SA',
  'weg': 'WEGE3.SA',
  'azul': 'AZUL4.SA',
  'gol': 'GOLL4.SA',
  'lojas renner': 'LREN3.SA',
  'nubank': 'NU',
  'americanas': 'AMER3.SA',
  'localiza': 'RENT3.SA',
  'raia drogasil': 'RADL3.SA',
  'drogasil': 'RADL3.SA'
};

// List of popular US stocks
export const popularUSStocks = {
  'apple': 'AAPL',
  'microsoft': 'MSFT',
  'amazon': 'AMZN',
  'google': 'GOOGL',
  'alphabet': 'GOOGL',
  'facebook': 'META',
  'meta': 'META',
  'tesla': 'TSLA',
  'netflix': 'NFLX',
  'nvidia': 'NVDA',
  'disney': 'DIS',
  'coca cola': 'KO',
  'coca-cola': 'KO',
  'pepsi': 'PEP',
  'pepsico': 'PEP',
  'mcdonalds': 'MCD',
  'nike': 'NKE',
  'walmart': 'WMT',
  'visa': 'V',
  'mastercard': 'MA'
};

// Map of forex pairs with variations
export const forexPairs = {
  'eurusd': 'EUR/USD',
  'eur/usd': 'EUR/USD',
  'eur-usd': 'EUR/USD',
  'eur usd': 'EUR/USD',
  'usdjpy': 'USD/JPY',
  'usd/jpy': 'USD/JPY',
  'usd-jpy': 'USD/JPY',
  'usd jpy': 'USD/JPY',
  'gbpusd': 'GBP/USD',
  'gbp/usd': 'GBP/USD',
  'gbp-usd': 'GBP/USD',
  'gbp usd': 'GBP/USD',
  'usdcad': 'USD/CAD',
  'usd/cad': 'USD/CAD',
  'usd-cad': 'USD/CAD',
  'usd cad': 'USD/CAD',
  'audusd': 'AUD/USD',
  'aud/usd': 'AUD/USD',
  'aud-usd': 'AUD/USD',
  'aud usd': 'AUD/USD',
  'usdbrl': 'USD/BRL',
  'usd/brl': 'USD/BRL',
  'usd-brl': 'USD/BRL',
  'usd brl': 'USD/BRL',
  'eurbrl': 'EUR/BRL',
  'eur/brl': 'EUR/BRL',
  'eur-brl': 'EUR/BRL',
  'eur brl': 'EUR/BRL',
};

// Simulated forex rates for when API fails
export const simulatedForexRates = {
  'EUR/USD': 1.0862,
  'USD/JPY': 151.62,
  'GBP/USD': 1.2568,
  'USD/CAD': 1.3624,
  'AUD/USD': 0.6609,
  'USD/BRL': 5.1246,
  'EUR/BRL': 5.5663
};
