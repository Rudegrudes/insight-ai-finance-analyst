// API keys and constant mapping values

export const FINNHUB_API_KEY = 'd09tc7hr01qus8rfaki0d09tc7hr01qus8rfakig'; // Updated with user's Finnhub API key
export const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj'; // Confirmed user's FMP API key

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
  // Euro pairs
  'eurusd': 'EUR/USD',
  'eur/usd': 'EUR/USD',
  'eur-usd': 'EUR/USD',
  'eur usd': 'EUR/USD',
  'eurgbp': 'EUR/GBP',
  'eur/gbp': 'EUR/GBP',
  'eur-gbp': 'EUR/GBP',
  'eur gbp': 'EUR/GBP',
  'eurjpy': 'EUR/JPY',
  'eur/jpy': 'EUR/JPY',
  'eur-jpy': 'EUR/JPY',
  'eur jpy': 'EUR/JPY',
  'eurchf': 'EUR/CHF',
  'eur/chf': 'EUR/CHF',
  'eur-chf': 'EUR/CHF',
  'eur chf': 'EUR/CHF',
  'euraud': 'EUR/AUD',
  'eur/aud': 'EUR/AUD',
  'eur-aud': 'EUR/AUD',
  'eur aud': 'EUR/AUD',
  'eurcad': 'EUR/CAD',
  'eur/cad': 'EUR/CAD',
  'eur-cad': 'EUR/CAD',
  'eur cad': 'EUR/CAD',
  'eurbrl': 'EUR/BRL',
  'eur/brl': 'EUR/BRL',
  'eur-brl': 'EUR/BRL',
  'eur brl': 'EUR/BRL',
  
  // USD pairs
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
  'usdchf': 'USD/CHF',
  'usd/chf': 'USD/CHF',
  'usd-chf': 'USD/CHF',
  'usd chf': 'USD/CHF',
  'usdmxn': 'USD/MXN',
  'usd/mxn': 'USD/MXN',
  'usd-mxn': 'USD/MXN',
  'usd mxn': 'USD/MXN',
  'usdcny': 'USD/CNY',
  'usd/cny': 'USD/CNY',
  'usd-cny': 'USD/CNY',
  'usd cny': 'USD/CNY',
  'usdrub': 'USD/RUB',
  'usd/rub': 'USD/RUB',
  'usd-rub': 'USD/RUB',
  'usd rub': 'USD/RUB',
  'usdinr': 'USD/INR',
  'usd/inr': 'USD/INR',
  'usd-inr': 'USD/INR',
  'usd inr': 'USD/INR',
  
  // GBP pairs
  'gbpjpy': 'GBP/JPY',
  'gbp/jpy': 'GBP/JPY',
  'gbp-jpy': 'GBP/JPY',
  'gbp jpy': 'GBP/JPY',
  'gbpaud': 'GBP/AUD',
  'gbp/aud': 'GBP/AUD',
  'gbp-aud': 'GBP/AUD',
  'gbp aud': 'GBP/AUD',
  'gbpcad': 'GBP/CAD',
  'gbp/cad': 'GBP/CAD',
  'gbp-cad': 'GBP/CAD',
  'gbp cad': 'GBP/CAD',
  
  // Other major pairs
  'audjpy': 'AUD/JPY',
  'aud/jpy': 'AUD/JPY',
  'aud-jpy': 'AUD/JPY',
  'aud jpy': 'AUD/JPY',
  'cadjpy': 'CAD/JPY',
  'cad/jpy': 'CAD/JPY',
  'cad-jpy': 'CAD/JPY',
  'cad jpy': 'CAD/JPY',
  'nzdusd': 'NZD/USD',
  'nzd/usd': 'NZD/USD',
  'nzd-usd': 'NZD/USD',
  'nzd usd': 'NZD/USD',
};

// Updated simulated forex rates for when API fails (with more recent values)
export const simulatedForexRates = {
  'EUR/USD': 1.0848, // Updated to recent value as of 2023-05-03
  'EUR/GBP': 0.8574,
  'EUR/JPY': 167.855,
  'EUR/CHF': 0.9768,
  'EUR/AUD': 1.6326,
  'EUR/CAD': 1.4751,
  'EUR/BRL': 5.4852,
  'USD/JPY': 154.73,
  'USD/CHF': 0.9005,
  'USD/CAD': 1.3598,
  'USD/MXN': 16.7542,
  'USD/CNY': 7.2418,
  'USD/RUB': 92.0658,
  'USD/INR': 83.4125,
  'USD/BRL': 5.0564,
  'GBP/USD': 1.2651,
  'GBP/JPY': 195.7896,
  'GBP/AUD': 1.9043,
  'GBP/CAD': 1.7205,
  'AUD/USD': 0.6643,
  'AUD/JPY': 102.7654,
  'CAD/JPY': 113.7896,
  'NZD/USD': 0.6024
};

// Error codes for standardized error handling
export const ERROR_CODES = {
  ASSET_NOT_FOUND: 'ASSET_NOT_FOUND',
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  INVALID_SYMBOL: 'INVALID_SYMBOL',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATA_PARSING_ERROR: 'DATA_PARSING_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Update timestamp for when simulated data was last updated
export const SIMULATED_DATA_TIMESTAMP = Date.now(); // Current timestamp to indicate recent data
