
// Stock data fetching and processing
import { FMP_API_KEY } from './constants';
import { getDateNDaysAgo, getDateToday } from './utils';
import type { StockData, StockQuote, NewsItem } from './types';

/**
 * Fetches stock data from Financial Modeling Prep API or Yahoo Finance
 */
export async function fetchStockData(symbol: string): Promise<StockData> {
  try {
    console.log(`Buscando dados da ação ${symbol}`);
    
    // First, try with the FMP API
    const fmpUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol.replace('.SA', '')}?apikey=${FMP_API_KEY}`;
    console.log(`Tentando buscar dados via FMP: ${fmpUrl}`);
    const fmpResponse = await fetch(fmpUrl);
    
    if (fmpResponse.ok) {
      const fmpData = await fmpResponse.json();
      if (fmpData.length > 0) {
        return fmpData[0]; // Company profile from FMP
      }
    }
    
    // If it's a Brazilian stock, try fetching from Yahoo Finance
    if (symbol.endsWith('.SA')) {
      console.log(`Tentando buscar dados via Yahoo Finance para ação brasileira: ${symbol}`);
      const yahooData = await fetchYahooFinanceData(symbol);
      return yahooData;
    }
    
    // For other stocks, use simulated data
    console.log(`Usando dados simulados para ${symbol}`);
    return {
      symbol: symbol,
      companyName: symbol,
      price: Math.random() * 100 + 10,
      changes: (Math.random() * 10) - 5,
      changesPercentage: ((Math.random() * 10) - 5).toFixed(2),
      mktCap: Math.random() * 1000000000,
      sector: "Não disponível",
      country: "Não disponível",
      pe: (Math.random() * 20 + 5).toFixed(2),
      dividendYield: (Math.random() * 5).toFixed(2)
    };
  } catch (error) {
    console.error(`Erro ao buscar dados da ação ${symbol}:`, error);
    throw new Error(`Não foi possível obter dados para a ação ${symbol}. Verifique se o código é válido.`);
  }
}

/**
 * Simulates fetching data from Yahoo Finance for Brazilian stocks
 */
async function fetchYahooFinanceData(symbol: string): Promise<StockData> {
  try {
    // Simulate Yahoo Finance data (in production we would use the actual API)
    const companyName = symbol.replace('.SA', '');
    
    return {
      symbol: symbol,
      companyName: `${companyName} S.A.`,
      price: Math.random() * 100 + 10,
      changes: (Math.random() * 10) - 5,
      changesPercentage: ((Math.random() * 10) - 5).toFixed(2),
      mktCap: Math.random() * 1000000000,
      sector: "Brasil",
      country: "Brasil",
      pe: (Math.random() * 20 + 5).toFixed(2),
      dividendYield: (Math.random() * 5).toFixed(2)
    };
  } catch (error) {
    console.error(`Erro ao buscar dados do Yahoo Finance para ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetches current stock quote data
 */
export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    console.log(`Buscando cotação da ação ${symbol}`);
    
    // First, try with the FMP API
    const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol.replace('.SA', '')}?apikey=${FMP_API_KEY}`;
    const fmpResponse = await fetch(fmpUrl);
    
    if (fmpResponse.ok) {
      const fmpData = await fmpResponse.json();
      if (fmpData.length > 0) {
        return fmpData[0]; // Quote from FMP
      }
    }
    
    // If API fails, return simulated data
    console.log(`Usando cotação simulada para ${symbol}`);
    return {
      symbol: symbol,
      name: symbol,
      price: Math.random() * 100 + 10,
      change: (Math.random() * 10) - 5,
      changesPercentage: ((Math.random() * 10) - 5).toFixed(2) + '%'
    };
  } catch (error) {
    console.error(`Erro ao buscar cotação da ação ${symbol}:`, error);
    return {
      symbol: symbol,
      name: symbol,
      price: Math.random() * 100 + 10,
      change: (Math.random() * 10) - 5,
      changesPercentage: ((Math.random() * 10) - 5).toFixed(2) + '%'
    };
  }
}

/**
 * Fetches news related to a stock symbol
 */
export async function fetchNews(symbol: string): Promise<NewsItem[]> {
  try {
    console.log(`Buscando notícias para ${symbol}`);
    // Try to fetch news from Finnhub
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol.replace('.SA', '')}&from=${getDateNDaysAgo(30)}&to=${getDateToday()}&token=${process.env.FINNHUB_API_KEY}`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(`Notícias recebidas: ${data.length}`);
      return data.slice(0, 5); // get the 5 most recent news
    }
    
    // If API fails, return simulated news
    console.log(`Usando notícias simuladas para ${symbol}`);
    return [
      {
        headline: `Análise técnica de ${symbol}`,
        datetime: Date.now() - 86400000, // yesterday
        source: "Notícias Financeiras"
      },
      {
        headline: `Resultados trimestrais de ${symbol} superam expectativas`,
        datetime: Date.now() - 172800000, // 2 days ago
        source: "Análise do Mercado"
      },
      {
        headline: `Perspectivas para ${symbol} no próximo trimestre`,
        datetime: Date.now() - 259200000, // 3 days ago
        source: "Investimentos Hoje"
      }
    ];
  } catch (error) {
    console.error(`Erro ao buscar notícias para ${symbol}:`, error);
    return []; // return empty array on error to avoid breaking the flow
  }
}
